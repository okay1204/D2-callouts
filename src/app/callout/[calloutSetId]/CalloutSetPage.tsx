'use client'

import PageSection from "@/components/PageSection";
import Loading from "@/components/loading";
import FullLogo from "@/images/full-logo.png";
import { Activity, CalloutSet, ImageReference } from "@/utils/callouts/calloutSets";
import { faDownload, faPen, faRotateRight, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { stagger, useAnimate } from "framer-motion";
import DefaultErrorPage from 'next/error';
import { useCallback, useEffect, useState } from "react";
import styles from './CalloutSetPage.module.css';
import Symbol from "./Symbol";

interface CustomNames {
    [imageId: number]: string
}

// Function to draw a rounded rectangle
const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
}

export default function CalloutSetPage({ calloutSet }: { calloutSet: CalloutSet | undefined }) {
    // null means All, undefined means not loaded yet
    const [selectedActivity, setSelectedActivity] = useState<Activity | null | undefined>(undefined)
    const [loadedImages, setLoadedImages] = useState<number[]>([])
    const [inEditMode, setInEditMode] = useState<boolean>(false)
    const [customNames, setCustomNames] = useState<CustomNames>({})
    const [copyTimeout, setCopyTimeout] = useState<number | null>(null)
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false)
    const [restoreDefaultsClicked, setRestoreDefaultsClicked] = useState<boolean>(false)
    const [scope, animate] = useAnimate()
    
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
        window.history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`)
    }, [])

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

    // Set the selected activity and custom names based on the query params on page load
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
    }, [calloutSet, changeActivity])
    
    const downloadImage = () => {
        if (isGeneratingImage) return
        setIsGeneratingImage(true)

        // Define sizes for canvas components
        const canvasWidth = 1000;
        const logoHeight = 70;
        const logoMargin = 16;
        const symbolsPerRow = 6;
        const symbolCardWidth = 140;
        const symbolCardHeight = 175;
        const symbolCardGap = 8;
        const symbolImageSize = 96;

        // Calculate canvas height based on number of symbols
        // Symbols are arranged like a flexbox row with wrap
        const canvasHeight = Math.ceil(imageList.length / symbolsPerRow) * (symbolCardHeight + symbolCardGap) + symbolCardGap + logoHeight + (logoMargin * 2);
        const canvasMargin = Math.ceil((canvasWidth - (symbolsPerRow * (symbolCardWidth + symbolCardGap)) + symbolCardGap) / 2);

        // Create canvas element in the html document
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Get 2d drawing context
        const ctx = canvas.getContext('2d')!;

        const RobotoBold = new FontFace('Roboto-Bold', 'url(/fonts/Roboto-Bold.ttf)')
        
        RobotoBold.load()
        .then(() => (
            new Promise<void>(resolve => {
                document.fonts.add(RobotoBold);

                // Draw background image (same as the one used for the PageSection)
                const background = new Image();
                background.src = backgroundImageSrc;

                background.onload = () => {
                    // Calculate scaling factors to cover the canvas while maintaining aspect ratio
                    const scaleX = canvasWidth / background.width;
                    const scaleY = canvasHeight / background.height;
                    const scale = Math.max(scaleX, scaleY);
    
                    // Calculate the new width and height of the image
                    const newWidth = background.width * scale;
                    const newHeight = background.height * scale;
    
                    // Calculate the position to center the image on the canvas
                    const x = (canvasWidth - newWidth) / 2;
                    const y = (canvasHeight - newHeight) / 2;
    
                    // Draw the background image with the calculated parameters
                    ctx.filter = 'brightness(0.4) blur(10px)';
                    ctx.drawImage(background, x, y, newWidth, newHeight);
    
                    // Reset filter
                    ctx.filter = 'none';
    
                    resolve();
                };
            })
        ))
        .then(() => {
            // List of promises for loading images
            const imagePromises: Promise<void>[] = [];

            // Load the logo image
            const logo = new Image();
            logo.src = FullLogo.src;
            imagePromises.push(new Promise<void>(resolve => {
                logo.onload = () => {
                    // Calculate the scaled width to maintain aspect ratio
                    const scaledWidth = (logoHeight / logo.naturalHeight) * logo.naturalWidth;

                    // Draw logo horizontally centered with a margin at the top
                    ctx.drawImage(
                        logo,
                        canvasWidth / 2 - scaledWidth / 2,
                        logoMargin,
                        scaledWidth,
                        logoHeight
                    );
                    resolve();
                }
            }));
            
            // Calculate values for drawing symbols in the last row
            const symbolsInLastRow = imageList.length % symbolsPerRow;
            const lastRowOffset = (symbolsPerRow - symbolsInLastRow) * (symbolCardWidth + symbolCardGap) / 2

            // Draw symbols with rounded backgrounds
            for (let i = 0; i < imageList.length; i++) {
                const imageReference = imageList[i];

                // If the symbol is in the last row, we need to adjust the x position to center it
                const isLastRow = i >= imageList.length - symbolsInLastRow;
            
                const x = (i % symbolsPerRow) * (symbolCardWidth + symbolCardGap) + symbolCardGap + canvasMargin + (isLastRow ? lastRowOffset : 0);
                const y = Math.floor(i / symbolsPerRow) * (symbolCardHeight + symbolCardGap) + symbolCardGap + logoHeight + (logoMargin * 2);

                // Draw transparent gray background for symbol with rounded borders
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                roundRect(ctx, x, y, symbolCardWidth, symbolCardHeight, 16);

                // Draw symbol image
                const image = new Image();
                image.src = imageReference.url;
                imagePromises.push(new Promise<void>(resolve => {
                    image.onload = () => {
                        ctx.drawImage(image, x + (symbolCardWidth - symbolImageSize) / 2, y + (symbolCardHeight - symbolImageSize) / 4, symbolImageSize, symbolImageSize);
                        resolve();
                    }
                }));

                // Draw symbol name
                ctx.fillStyle = 'white';
                ctx.font = '20px Roboto-Bold';
                ctx.textAlign = 'center';
                ctx.fillText(customNames[imageReference.id] ?? imageReference.name, x + symbolCardWidth / 2, y + symbolCardHeight - 24, symbolCardWidth - 16);
            }

            // Convert canvas to Blob and trigger download after all images are loaded
            Promise.all(imagePromises)
            .then(() => {
                canvas.toBlob(blob => {
                    // Trigger download
                    const a = document.createElement('a');
                    a.download = `${calloutSet?.name}.png`;
                    a.href = URL.createObjectURL(blob!);
                    a.click();
                    setIsGeneratingImage(false);
                });
            })
        });
    }

    const copyShareLink = () => {
        if (copyTimeout != null) return

        const urlParams = new URLSearchParams(window.location.search);

        // First clear all custom names from the url
        for (const imageId of Object.keys(calloutSet!.allImages)) {
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
    }


    let imageList: ImageReference[] = []
    if (calloutSet != undefined) {
        imageList = selectedActivity ? selectedActivity.images : calloutSet.allImages
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
    }, [loadedImages, selectedActivity])

    if (!calloutSet) return <DefaultErrorPage statusCode={404} />
    if (selectedActivity === undefined) return <Loading />

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
                                name={customNames[imageReference.id] ?? imageReference.name}
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
