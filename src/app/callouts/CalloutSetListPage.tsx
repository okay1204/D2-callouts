'use client'

import { CalloutSet } from '@/utils/callouts/calloutSets'
import { useWindowSize } from '@/utils/hooks'
import { Variants, motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MouseEvent, useEffect, useState } from 'react'
import styles from './CalloutSetList.module.css'

const calloutSetVariants: Variants = {
    visible: {
        y: 0,
        opacity: 1.01,
        transition: {
            y: {duration: 0.1}
        },
    },
    hidden: {
        y: 100,
        opacity: 0,
    },
}

export default function CalloutSetListPage({ calloutSets }: { calloutSets: CalloutSet[] }) {
    const calloutSetVerticalMaxWidth = 850;

    const [isHoveringActivity, setIsHoveringActivity] = useState(false);
    const windowSize = useWindowSize();

    const router = useRouter();

    useEffect(() => {
        calloutSets.forEach(calloutSet => {
            router.prefetch(`/callouts/${calloutSet.id}`)
        })
    }, [calloutSets, router])

    return (
        <>
            <h1 className={styles.calloutListHeader}>Callout Sets</h1>
            <div className={styles.calloutList}>
                {calloutSets.map(calloutSet => (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={calloutSetVariants}
                        className={styles.calloutSet}
                        style={{
                            background: `linear-gradient(to ${windowSize.width! > calloutSetVerticalMaxWidth ? 'right' : 'bottom'}, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3533788515406162) ${windowSize.width! > calloutSetVerticalMaxWidth ? 28 : 50}%, rgba(0,0,0,0) ${windowSize.width! > calloutSetVerticalMaxWidth ? 36 : 70}%), no-repeat center / cover url('/images/callouts/${calloutSet.id}/banner/background.png')`
                        }}
                        key={calloutSet.id}
                        onClick={(event: MouseEvent) => !isHoveringActivity && router.push(`/callouts/${calloutSet.id}`)}
                    >
                        <div className={styles.calloutSetText}>
                            <h2>{calloutSet.name}</h2>
                            <ul>
                                {calloutSet.activities.map(activity => (
                                    <Link
                                        key={activity.name}    
                                        href={`/callouts/${calloutSet.id}?activity=${activity.id}`}
                                        onMouseEnter={() => setIsHoveringActivity(true)}
                                        onMouseLeave={() => setIsHoveringActivity(false)}
                                    >
                                        <li>{activity.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.calloutSetSymbols}>
                            {calloutSet.bannerImages.map(imageReference => (
                                <div className={styles.calloutSetSymbolContainer} key={imageReference.name}>
                                    <Image
                                        fill={true}
                                        sizes="7rem, (max-width: 850px) 6rem, (max-width: 400px) 4rem"
                                        className={styles.calloutSetSymbol}
                                        src={imageReference.url}
                                        alt='Callout Set Symbol'
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    )
}
