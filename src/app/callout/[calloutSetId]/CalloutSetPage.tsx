'use client'

import { CalloutSet } from "@/utils/callouts/calloutSets";
import styles from './CalloutSetPage.module.css'
import DefaultErrorPage from 'next/error';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CalloutSetPage({ calloutSet }: { calloutSet: CalloutSet | undefined }) {
    const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined)
    const router = useRouter()

    if (!calloutSet) return <DefaultErrorPage statusCode={404} />

    const changeActivity = (activity: string) => {
        setSelectedActivity(activity)
        // Set query params
        if (activity != 'all') {
            router.replace(`${window.location.pathname}?activity=${activity}`)
        }
        else {
            // Remove query params if activity is 'all'
            router.replace(window.location.pathname)
        }
    }

    useEffect(() => {
        // read query params to see if activity is specified
        const urlParams = new URLSearchParams(window.location.search);
        const activity = urlParams.get('activity');

        if (activity && calloutSet.activities.find(a => a.id == activity)) {
            changeActivity(activity)
        }
        else {
            changeActivity('all')
        }
    }, [])
    
    return (
        <main>
            <h1 className={styles.title}>{calloutSet.name}</h1>
            <div className={styles.activityButtonSelect}>
                <button
                    className={`${styles.activitySelectButton} ${selectedActivity == 'all' ? styles.selectedActivity : ''}`}
                    onClick={() => changeActivity('all')}
                >
                    All
                </button>
                {calloutSet.activities.map(activity => (
                    <button
                        key={activity.id}
                        className={`${styles.activitySelectButton} ${selectedActivity == activity.id ? styles.selectedActivity : ''}`}
                        onClick={() => changeActivity(activity.id)}
                    >
                        {activity.name}
                    </button>
                ))}
            </div>
            <select
                className={styles.activityMobileSelect}
                value={selectedActivity}
                onChange={e => changeActivity(e.target.value)}
            >
                <option value="all">All</option>
                {calloutSet.activities.map(activity => (
                    <option key={activity.id} value={activity.id}>{activity.name}</option>
                ))}
            </select>
        </main>
    )
}
