'use client'

import Loading from "@/app/loading";
import { Activity, CalloutSet, ImageReference } from "@/utils/callouts/calloutSets";
import { stagger, useAnimate } from "framer-motion";
import DefaultErrorPage from 'next/error';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from './CalloutSetPage.module.css';

interface CustomNames {
    [imageId: number]: string
}

export default function CalloutSetPage({ calloutSet }: { calloutSet: CalloutSet | undefined }) {
    // null means All, undefined means not loaded yet
    const [selectedActivity, setSelectedActivity] = useState<Activity | null | undefined>(undefined)
    const [loadedImages, setLoadedImages] = useState<number[]>([])
    const [customNames, setCustomNames] = useState<CustomNames>({})
    const [copyTimeout, setCopyTimeout] = useState<number | null>(null)
    const [scope, animate] = useAnimate()
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

    const handleImageLoad = (imageId: number) => {
        if (!loadedImages.includes(imageId)) {
            setLoadedImages((prevLoadedImages) => [...prevLoadedImages, imageId]);
        }
    };

    const handleNameChange = (imageId: number, name: string) => {
        // If the name is the same as the default, remove it from the custom names
        // Otherwise, add it to the custom names
        if (!calloutSet) return

        const imageReference = calloutSet.allImages.find(image => image.id == imageId)
        if (!imageReference) return

        if (name == imageReference.name) {
            const newCustomNames = { ...customNames }
            delete newCustomNames[imageId]
            setCustomNames(newCustomNames)
        }
        else {
            // Add the query param
            setCustomNames(prevCustomNames => ({ ...prevCustomNames, [imageId]: name }));
        }
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
                const imageReference = calloutSet.allImages.find(image => image.id == imageId)
                if (!imageReference) return

                if (imageReference.name != value) {
                    customNames[imageId] = value
                }
            })

            setCustomNames(customNames)
        }
    }, [calloutSet, changeActivity])

    let imageList: ImageReference[] = []
    if (calloutSet === undefined) {
        imageList = []
    }
    else {
        imageList = selectedActivity ? selectedActivity.images : calloutSet.allImages
    }

    useEffect(() => {
        if (typeof selectedActivity == 'undefined' || !calloutSet) return

        // Animate the symbol list if all images are loaded
        if (scope.current && loadedImages.length >= imageList.length) {
            animate([
                [`.${styles.symbol}`, { opacity: 0 }, { duration: 0 }],
                [`.${styles.symbol}`, { opacity: 1 }, { duration: 0.3, delay: stagger(0.02) }],
            ])
        }
    }, [animate, calloutSet, imageList.length, loadedImages, scope, selectedActivity])


    if (!calloutSet) return <DefaultErrorPage statusCode={404} />
    if (selectedActivity === undefined) return <Loading />

    return (
        <div>
            <h1 className={styles.title}>{calloutSet.name}</h1>
            {
                // We should only show the activity buttons if there is more than one activity available
                calloutSet.activities.length > 1 && (
                    <>
                        <div className={styles.activityButtonSelect}>
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

                    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${urlParams.toString()}`)
                    .then(() => {
                        setCopyTimeout(window.setTimeout(() => setCopyTimeout(null), 2000))
                    })
                }}
            >
                {copyTimeout == null ? 'Share 📥' : 'Copied! 📥'}
            </button>

            {loadedImages.length < imageList.length && <Loading />}
            <div className={`${styles.symbolList} ${loadedImages.length < imageList.length ? 'hide' : ''}`} ref={scope}>
                {imageList.map(imageReference => (
                    <div key={imageReference.id} className={styles.symbol}>
                        <div className={styles.symbolImageContainer}>
                            <Image
                                fill={true}
                                priority={true}
                                onLoadingComplete={() => { handleImageLoad(imageReference.id) }}
                                sizes="10rem, (max-width: 600px) 7.5rem"
                                className={styles.symbol}
                                src={imageReference.url}
                                alt='Callout Set Symbol'
                            />
                        </div>

                        <input
                            type="text"
                            className={styles.symbolName}
                            // Display the custom name if it exists, otherwise use the default name
                            value={customNames[imageReference.id] ?? imageReference.name}
                            onChange={e => handleNameChange(imageReference.id, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
