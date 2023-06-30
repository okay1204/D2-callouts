'use client'

import Loading from "@/app/loading";
import { Activity, CalloutSet } from "@/utils/callouts/calloutSets";
import { stagger, useAnimate } from "framer-motion";
import DefaultErrorPage from 'next/error';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from './CalloutSetPage.module.css';

export default function CalloutSetPage({ calloutSet }: { calloutSet: CalloutSet | undefined }) {
    // null means All, undefined means not loaded yet
    const [selectedActivity, setSelectedActivity] = useState<Activity | null | undefined >(undefined)
    const [scope, animate] = useAnimate()
    const router = useRouter()

    
    const changeActivity = useCallback((activity: Activity | null) => {
        setSelectedActivity(activity)
        
        // set query params to reflect the selected activity, or remove them if null
        router.replace(activity ? `${window.location.pathname}?activity=${activity.id}` : window.location.pathname)
    }, [router])
    
    useEffect(() => {
        if (calloutSet) {
            // read query params to see if activity is specified
            const urlParams = new URLSearchParams(window.location.search);
            const activityId = urlParams.get('activity');
            const activity = calloutSet.activities.find(activity => activity.id == activityId)
            
            changeActivity(activity ?? null)
        }
    }, [calloutSet, changeActivity])
    
    useEffect(() => {
        // Animate the symbol list
        if (scope.current) {
            animate([
                [`.${styles.symbol}`, { opacity: 0 }, { duration: 0 }],
                [`.${styles.symbol}`, { opacity: 1 }, { duration: 0.3, delay: stagger(0.02) }],
            ])
        }
    }, [animate, scope, selectedActivity])
    
    if (!calloutSet) return <DefaultErrorPage statusCode={404} />
    if (selectedActivity === undefined) return <Loading />
    
    return (
        <div onClick={() => animate(scope.current)}>
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
        
            <div className={styles.symbolList} ref={scope}>
                {(selectedActivity ? selectedActivity.images : calloutSet.allImages).map(imageReference => (
                    <div key={imageReference.id} className={styles.symbol}>
                        <div className={styles.symbolImageContainer}>
                            <Image
                                fill={true}
                                priority={true}
                                sizes="10rem, (max-width: 600px) 7.5rem"
                                className={styles.symbol}
                                src={imageReference.url}
                                alt='Callout Set Symbol'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
