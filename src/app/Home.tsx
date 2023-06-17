'use client'

import RaidEmblem from '@/images/raid-emblem.png'
import { CalloutSet } from '@/utils/callouts/calloutSets'
import { Variants, motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MouseEvent, useState } from 'react'
import styles from './Home.module.css'

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

export default function HomePage({ calloutSets }: { calloutSets: CalloutSet[] }) {
    const [isHoveringActivity, setIsHoveringActivity] = useState(false);

    const router = useRouter();

    return (
        <main>
            <div className={styles.showcaseBackground}>
                <div className={styles.showcaseBackgroundFade}>
                    <div className={styles.showcase}>
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className={styles.showCaseText}
                        >
                            <h1>Get your raid team on the same page.</h1>
                            <span>View, edit, and share callouts in an instant</span>
                        </motion.div>
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className={styles.showcaseImageContainer}
                        >
                            <Image className={styles.showcaseImage} src={RaidEmblem} alt='Raid Emblem' />
                        </motion.div>
                    </div>
                </div>
            </div>

            <h1 className={styles.calloutListHeader}>Callout Sets</h1>
            <div className={styles.calloutList}>
                {calloutSets.map(calloutSet => (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={calloutSetVariants}
                        className={styles.calloutSet}
                        style={{ background: `linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3533788515406162) 28%, rgba(0,0,0,0) 36%), no-repeat center / cover url('/images/callouts/${calloutSet.id}/banner/background.png')` }}
                        key={calloutSet.id}
                        onClick={(event: MouseEvent) => !isHoveringActivity && router.push(`/callout/${calloutSet.id}`)}
                    >
                        <div className={styles.calloutSetText}>
                            <h2>{calloutSet.name}</h2>
                            <ul>
                                {calloutSet.activities.map(activity => (
                                    <Link href={`/callout/${calloutSet.id}/${activity.name}`} key={activity.name} onMouseEnter={() => setIsHoveringActivity(true)} onMouseLeave={() => setIsHoveringActivity(false)}>
                                        <li>{activity.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.calloutSetSymbols}>
                            {calloutSet.bannerImages.map(imageReference => (
                                <div className={`${styles.calloutSetSymbolContainer} ${calloutSet.whiteBannerSymbolFilter ? styles.calloutSetWhiteFilter : ''}`} key={imageReference.name}>
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
        </main>
    )
}
