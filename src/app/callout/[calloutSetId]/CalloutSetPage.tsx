'use client'

import Loading from "@/app/loading";
import PageSection from "@/components/PageSection";
import { Activity, CalloutSet, ImageReference } from "@/utils/callouts/calloutSets";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { stagger, useAnimate } from "framer-motion";
import DefaultErrorPage from 'next/error';
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from './CalloutSetPage.module.css';
import Symbol from "./Symbol";

interface CustomNames {
    [imageId: number]: string
}

export default function CalloutSetPage({ calloutSet }: { calloutSet: CalloutSet | undefined }) {
    // null means All, undefined means not loaded yet
    const [selectedActivity, setSelectedActivity] = useState<Activity | null | undefined>(undefined)
    const [loadedImages, setLoadedImages] = useState<number[]>([])
    const [inEditMode, setInEditMode] = useState<boolean>(false)
    const [customNames, setCustomNames] = useState<CustomNames>({})
    const [copyTimeout, setCopyTimeout] = useState<number | null>(null)
    const [scope, animate] = useAnimate()
    const [restoreDefaultsClicked, setRestoreDefaultsClicked] = useState<boolean>(false)
    const router = useRouter()

    const changeActivity = useCallback((activity: Activity | null) => {
        setSelectedActivity(activity)

        const urlParams = new URLSearchParams(window.location.search);
        if (activity) {
            urlParams.set('activity', activity.id)
        }
        else {
            urlParams.delete('activity')
        }

        // set query params to reflect the selected activity, or remove them if null
        router.replace(`${window.location.pathname}?${urlParams.toString()}`)
    }, [router])

    const onRestoreDefaults = () => {
        setCustomNames({})
        localStorage.setItem(`${calloutSet?.id}.customNames`, JSON.stringify({}))

        if (!restoreDefaultsClicked) {
            setRestoreDefaultsClicked(true)

            setTimeout(() => {
                setRestoreDefaultsClicked(false)
            }, 500)
        }
    }

    const handleImageLoad = (imageId: number) => {
        if (!loadedImages.includes(imageId)) {
            setLoadedImages(prevLoadedImages => [...prevLoadedImages, imageId]);
        }
    };

    const handleNameChange = (imageId: number, name: string) => {
        // If the name is the same as the default, remove it from the custom names
        // Otherwise, add it to the custom names
        const imageReference = calloutSet?.allImages.find(image => image.id == imageId)
        if (!imageReference) return

        setCustomNames(prevCustomNames => {
            const newCustomNames = { ...prevCustomNames }
            if (name == imageReference.name) {
                delete newCustomNames[imageId]
            }
            else {
                newCustomNames[imageId] = name
            }

            localStorage.setItem(`${calloutSet?.id}.customNames`, JSON.stringify(newCustomNames))
            return newCustomNames
        })
    };

    useEffect(() => {
        if (calloutSet) {
            // read query params to see if activity is specified
            const urlParams = new URLSearchParams(window.location.search);
            const activityId = urlParams.get('activity');
            const activity = calloutSet.activities.find(activity => activity.id == activityId)

            changeActivity(activity ?? null)

            // also populate custom names
            const customNames: CustomNames = {}

            // Convert urlParams.entries() to an array and iterate over it
            Array.from(urlParams.entries()).forEach(([key, value]) => {
                const imageId = parseInt(key)
                if (isNaN(imageId)) return

                const imageReference = calloutSet.allImages.find(image => image.id == imageId)
                if (!imageReference) return

                // If the name is the same as the default, remove it from the custom names
                if (imageReference.name != value) {
                    customNames[imageId] = value
                }
            })

            setCustomNames(customNames)

            // if the callout set is not custom, attempt to load the custom names from local storage
            if (!urlParams.has('isCustom') || urlParams.get('isCustom') != 'true') {
                const customNamesJson = localStorage.getItem(`${calloutSet.id}.customNames`)
                if (customNamesJson) {
                    setCustomNames(JSON.parse(customNamesJson))
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let imageList: ImageReference[] = []
    if (calloutSet != undefined) {
        imageList = selectedActivity ? selectedActivity.images : calloutSet.allImages
    }

    useEffect(() => {
        // Animate the symbol list if all images are loaded
        if (loadedImages.length >= imageList.length) {
            animate([
                [`.${styles.symbolSelector}`, { opacity: 0 }, { duration: 0 }],
                [`.${styles.symbolSelector}`, { opacity: 1 }, { duration: 0.3, delay: stagger(0.02) }],
            ])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadedImages, selectedActivity])

    if (!calloutSet) return <DefaultErrorPage statusCode={404} />
    if (selectedActivity === undefined) return <Loading />

    return (
        <PageSection backgroundSrc={`/images/callouts/${calloutSet.id}/extra/symbol-list-background.png`} backgroundAlt='Planets background' imageClassName={styles.backgroundImage} includeNavHeight={true}>
            <div className={styles.mainContent}>
                <h1 className={styles.title}>{calloutSet.name}</h1>
                {
                    // We should only show the activity buttons if there is more than one activity available
                    calloutSet.activities.length > 1 && (
                        <>
                            <div className={styles.activityButtonList}>
                                <button
                                    className={`${styles.activitySelectButton} ${selectedActivity == null ? styles.selectedActivity : ''}`}
                                    onClick={() => changeActivity(null)}
                                >
                                    All
                                </button>
                                {calloutSet.activities.map(activity => (
                                    <button
                                        key={activity.id}
                                        className={`${styles.activitySelectButton} ${selectedActivity && selectedActivity.id == activity.id ? styles.selectedActivity : ''}`}
                                        onClick={() => changeActivity(activity)}
                                    >
                                        {activity.name}
                                    </button>
                                ))}
                            </div>
                            <select
                                className={styles.activityMobileSelect}
                                value={selectedActivity ? selectedActivity.id : 'all'}
                                onChange={e => changeActivity(calloutSet.activities.find(activity => activity.id == e.target.value) ?? null)}
                            >
                                <option value="all">All</option>
                                {calloutSet.activities.map(activity => (
                                    <option key={activity.id} value={activity.id}>{activity.name}</option>
                                ))}
                            </select>
                        </>
                    )
                }

                {loadedImages.length < imageList.length && <Loading />}
                <div className={`${styles.symbolsDisplay} ${loadedImages.length < imageList.length ? 'hide-visibility' : ''}`}>
                    <div className={styles.actionButtonList}>
                        <button className={styles.actionButton} onClick={() => setInEditMode(!inEditMode)}>
                            <FontAwesomeIcon icon={faPen} />
                            <span>{inEditMode ? 'Done' : 'Edit'}</span>
                        </button>
                        <button className={styles.actionButton} onClick={() => onRestoreDefaults()}>
                            <span>Restore Defaults</span>
                        </button>
                    </div>
                    <div className={styles.symbolList} ref={scope}>
                        {imageList.map(imageReference => (
                            <Symbol
                                key={imageReference.id}
                                imageReference={imageReference}
                                selectorClassName={styles.symbolSelector}
                                inEditMode={inEditMode}
                                setInEditMode={setInEditMode}
                                onLoadingComplete={() => { handleImageLoad(imageReference.id) }}
                                name={customNames[imageReference.id] ?? imageReference.name}
                                onNameChange={e => handleNameChange(imageReference.id, e.target.value)}
                                restoreDefaultsClicked={restoreDefaultsClicked}
                            />
                        ))}
                    </div>
                </div>

                <button
                    className={styles.shareButton}
                    onClick={() => {
                        if (copyTimeout != null) return

                        const urlParams = new URLSearchParams(window.location.search);

                        // First clear all custom names from the url
                        for (const imageId of Object.keys(calloutSet.allImages)) {
                            urlParams.delete(imageId)
                        }

                        // Then add the custom names
                        for (const [imageId, name] of Object.entries(customNames)) {
                            urlParams.set(imageId, name)
                        }
                        
                        // Signify that this is a custom callout set
                        urlParams.set('isCustom', 'true')

                        navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${urlParams.toString()}`)
                        .then(() => {
                            setCopyTimeout(window.setTimeout(() => setCopyTimeout(null), 2000))
                        })
                    }}
                >
                    {copyTimeout == null ? 'Share 📥' : 'Copied! 📥'}
                </button>
            </div>
        </PageSection>
    )
}
