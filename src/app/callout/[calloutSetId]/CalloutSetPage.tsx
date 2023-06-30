'use client'

import { Activity, CalloutSet } from "@/utils/callouts/calloutSets";
import styles from './CalloutSetPage.module.css'
import DefaultErrorPage from 'next/error';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Image from "next/image";

export default function CalloutSetPage({ calloutSet }: { calloutSet: CalloutSet | undefined }) {
    // null means All, undefined means not loaded yet
    const [selectedActivity, setSelectedActivity] = useState<Activity | null | undefined >(undefined)
    const router = useRouter()

    if (!calloutSet) return <DefaultErrorPage statusCode={404} />

    const changeActivity = (activity: Activity | null) => {
        setSelectedActivity(activity)
        // Set query params
        if (activity) {
            router.replace(`${window.location.pathname}?activity=${activity.id}`)
        }
        else {
            // Remove query params if activity is 'all'
            router.replace(window.location.pathname)
        }
    }

    useEffect(() => {
        // read query params to see if activity is specified
        const urlParams = new URLSearchParams(window.location.search);
        const activityId = urlParams.get('activity');
        const activity = calloutSet.activities.find(activity => activity.id == activityId)

        if (activity) {
            changeActivity(activity)
        }
        else {
            changeActivity(null)
        }
    }, [])

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


            <div className={styles.symbolList}>
                {(selectedActivity ? selectedActivity.images : calloutSet.allImages).map(imageReference => (
                    <div key={imageReference.id} className={styles.symbolContainer}>
                        <Image
                            fill={true}
                            sizes="10rem, (max-width: 600px) 7.5rem"
                            className={styles.symbol}
                            src={imageReference.url}
                            alt='Callout Set Symbol'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
