'use client'

import { CalloutSet } from "@/utils/callouts/calloutSets";
import styles from './CalloutSetPage.module.css'
import DefaultErrorPage from 'next/error';

export default function CalloutSetPage({ calloutSet }: { calloutSet: CalloutSet | undefined }) {

    if (!calloutSet) return <DefaultErrorPage statusCode={404} />
    
    return (
        <main>
            <h1 className={styles.title}>{calloutSet.name}</h1>
            <div className={styles.activitySelect}>
                <button className={styles.activitySelectButton}>All</button>
                {calloutSet.activities.map(activity => (
                    <button key={activity.id} className={styles.activitySelectButton}>{activity.name}</button>
                ))}
            </div>
        </main>
    )
}
