'use client'

import Loading from "@/components/loading";
import PageSection from "@/components/PageSection";
import { ImageReference } from "@/utils/callouts/calloutSets";
import { Map, MapSet, mapSets } from "@/utils/maps/maps";
import { faDownload, faPen, faRotateRight, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { stagger } from "framer-motion";
import DefaultErrorPage from 'next/error';
import { useCallback, useEffect, useState } from "react";
import styles from './MapPage.module.css';

interface CustomNames {
    [mapPositionId: number]: string
}

export default function MapPage({ params }: {params: { mapSetId: string } }) {
    const { mapSetId } = params

    // null means All, undefined means not loaded yet
    const [mapSet, setMapSet] = useState<MapSet | null | undefined>(undefined)
    const [selectedMap, setSelectedMap] = useState<Map | null | undefined>(undefined)
    const [loadedImages, setLoadedImages] = useState<number[]>([])
    const [inEditMode, setInEditMode] = useState<boolean>(false)
    const [mapPositionNames, setMapPositionNames] = useState<CustomNames>({})
    const [copyTimeout, setCopyTimeout] = useState<number | null>(null)
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false)
    const [restoreDefaultsClicked, setRestoreDefaultsClicked] = useState<boolean>(false)

    const changeMap = useCallback((map: Map | null) => {
        setSelectedMap(map)

        const urlParams = new URLSearchParams(window.location.search);
        if (map) {
            urlParams.set('map', map.id)
        }
        else {
            urlParams.delete('map')
        }

        // set query params to reflect the selected activity, or remove them if null
        window.history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`)
    }, [])

    const onRestoreDefaults = () => {
        setMapPositionNames({})
        localStorage.setItem(`${mapSetId}.customNames`, JSON.stringify({}))

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

    const handleNameChange = (positionId: number, name: string) => {
        // If the name is the same as the default, remove it from the custom names
        // Otherwise, add it to the custom names
        const position = selectedMap?.positions.find(position => position.id == positionId)
        if (!position) return

        setMapPositionNames(prevCustomNames => {
            const newCustomNames = { ...prevCustomNames }
            if (name == position.defaultName) {
                delete newCustomNames[positionId]
            }
            else {
                newCustomNames[positionId] = name
            }

            localStorage.setItem(`${mapSetId}.customNames`, JSON.stringify(newCustomNames))
            return newCustomNames
        })
    };

    // Set the selected activity and custom names based on the query params on page load
    useEffect(() => {
        const mapSet = mapSets.find(mapSet => mapSet.id == mapSetId)
        setMapSet(mapSet)

        if (!selectedMap) {
            return
        }

        // read query params to see if activity is specified
        const urlParams = new URLSearchParams(window.location.search);
        const mapId = urlParams.get('map')
        // const map = calloutSet.activities.find(activity => activity.id == activityId)
        const map = mapSets.find(mapSet => mapSet.id == mapSetId)?.maps.find(map => map.id == mapId)

        changeMap(selectedMap ?? null)

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

        setMapPositionNames(customNames)

        // if the callout set is not custom, attempt to load the custom names from local storage
        if (!urlParams.has('isCustom') || urlParams.get('isCustom') != 'true') {
            const customNamesJson = localStorage.getItem(`${calloutSet.id}.customNames`)
            if (customNamesJson) {
                setMapPositionNames(JSON.parse(customNamesJson))
            }
        }
    }, [changeMap])

    const downloadImage = () => {
        if (isGeneratingImage) return
        setIsGeneratingImage(true)
        setIsGeneratingImage(false);
    }

    const copyShareLink = () => {
        if (copyTimeout != null) return

        const urlParams = new URLSearchParams(window.location.search);

        // First clear all custom names from the url
        for (const imageId of Object.keys(selectedMap!.allImages)) {
            urlParams.delete(imageId)
        }

        // Then add the custom names
        for (const [imageId, name] of Object.entries(mapPositionNames)) {
            urlParams.set(imageId, name)
        }
        
        // Signify that this is a custom callout set
        urlParams.set('isCustom', 'true')

        navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${urlParams.toString()}`)
        .then(() => {
            setCopyTimeout(window.setTimeout(() => setCopyTimeout(null), 2000))
        })
    }


    let imageList: ImageReference[] = []
    if (calloutSet != undefined) {
        imageList = selectedMap ? selectedMap.images : calloutSet.allImages
    }

    // Handle outside clicks to exit edit mode
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inEditMode && !scope.current.contains(event.target)) {
                setInEditMode(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [inEditMode, scope])

    // Animate the symbol list if all images are loaded
    useEffect(() => {
        if (loadedImages.length >= imageList.length) {
            animate([
                [`.${styles.symbolSelector}`, { opacity: 0 }, { duration: 0 }],
                [`.${styles.symbolSelector}`, { opacity: 1 }, { duration: 0.3, delay: stagger(0.02) }],
            ])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadedImages, selectedMap])

    if (!calloutSet) return <DefaultErrorPage statusCode={404} />
    if (selectedMap === undefined) return <Loading />

    const backgroundImageSrc = `/images/callouts/${calloutSet.id}/extra/symbol-list-background.png`

    return (
        <PageSection backgroundSrc={backgroundImageSrc} backgroundAlt='' imageClassName={styles.backgroundImage}>
            <div className={styles.mainContent}>
                <h1 className={styles.title}>{calloutSet.name}</h1>
                {
                    // We should only show the activity buttons if there is more than one activity available
                    calloutSet.activities.length > 1 && (
                        <>
                            <div className={styles.activityButtonList}>
                                <button
                                    className={`${styles.activitySelectButton} ${selectedMap == null ? styles.selectedActivity : ''}`}
                                    onClick={() => changeMap(null)}
                                >
                                    All
                                </button>
                                {calloutSet.activities.map(activity => (
                                    <button
                                        key={activity.id}
                                        className={`${styles.activitySelectButton} ${selectedMap && selectedMap.id == activity.id ? styles.selectedActivity : ''}`}
                                        onClick={() => changeMap(activity)}
                                    >
                                        {activity.name}
                                    </button>
                                ))}
                            </div>
                            <select
                                className={styles.activityMobileSelect}
                                value={selectedMap ? selectedMap.id : 'all'}
                                onChange={e => changeMap(calloutSet.activities.find(activity => activity.id == e.target.value) ?? null)}
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
                            <FontAwesomeIcon icon={faRotateRight} />
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
                                onLoad={() => { handleImageLoad(imageReference.id) }}
                                name={mapPositionNames[imageReference.id] ?? imageReference.name}
                                onNameChange={e => handleNameChange(imageReference.id, e.target.value)}
                                restoreDefaultsClicked={restoreDefaultsClicked}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.exportButtonList}>
                    <button onClick={() => copyShareLink()}>
                        {copyTimeout == null ? 'Share' : 'Copied!'}
                        {copyTimeout == null && <FontAwesomeIcon icon={faShare} className={styles.exportButtonIcon} />}
                    </button>

                    <button onClick={() => downloadImage()}>
                        {isGeneratingImage ? 'Generating...' : 'Download'}
                        {!isGeneratingImage && <FontAwesomeIcon icon={faDownload} className={styles.exportButtonIcon} />}
                    </button>
                </div>
            </div>
        </PageSection>
    )
}
