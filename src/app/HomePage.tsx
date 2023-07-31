'use client'

import Navbar from '@/components/Navbar'
import PlanetsBackground from '@/images/planets-background.png'
import RaidEmblem from '@/images/raid-emblem.png'
import SpaceBackground from '@/images/space-background.png'
import WitnessWitnessing from '@/images/witness-witnessing.png'
import { CalloutSet } from '@/utils/callouts/calloutSets'
import { Variants, motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
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
    const calloutSetRef = useRef<HTMLHeadingElement>(null);

    const router = useRouter();

    return (
        <div className={styles.homePage}>
            <section className={styles.sectionOne}>
                <Image
                    className={styles.sectionBackground}
                    src={SpaceBackground}
                    alt='Space background'
                    fill={true}
                    draggable={false}
                />
                <Navbar />
                <div className={styles.banner}>

                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className={styles.bannerText}
                    >
                        <h1>Destiny&nbsp;2&nbsp;Callouts Made&nbsp;Simple</h1>
                        <span>View, customize and share callouts in an instant</span>
                        <button onClick={() => calloutSetRef.current?.scrollIntoView({ behavior: 'smooth' })}>Get Started</button>
                    </motion.div>
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        animate={{
                            y: [null, -20],
                            transition: {
                                repeat: Infinity,
                                repeatType: 'mirror',
                                duration: 5,
                                ease: 'easeInOut',
                            }
                        }}
                        className={styles.bannerImageContainer}
                    >
                        <Image
                            className={styles.bannerImage}
                            src={RaidEmblem}
                            alt='Raid Emblem'
                        />
                    </motion.div>
                </div>
            </section>
            
            <section ref={calloutSetRef}>
                <Image
                    className={styles.sectionBackground}
                    src={PlanetsBackground}
                    alt='Planets background'
                    fill={true}
                    draggable={false}
                />
                <div className={styles.calloutSplitter}>
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className={styles.calloutSetImageWrapper}
                    >
                        <Image
                            className={styles.calloutSetImage}
                            src={WitnessWitnessing}
                            alt='Witness witnessing'
                        />
                    </motion.div>
                    <div className={styles.calloutListSection}>
                        <h1 className={styles.calloutListHeader} id="calloutSets">Symbol Callouts</h1>
                        <div className={styles.calloutList}>
                            {calloutSets.map(calloutSet => (
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    variants={calloutSetVariants}
                                    className={styles.calloutSet}
                                    style={{
                                        background: `url('/images/callouts/${calloutSet.id}/banner/background.png') center center / cover`
                                    }}
                                    key={calloutSet.id}
                                    onClick={() => !isHoveringActivity && router.push(`/callout/${calloutSet.id}`)}
                                >
                                    <div className={styles.calloutSetSymbolContainer} key={calloutSet.bannerImage.name}>
                                        <Image
                                            fill={true}
                                            sizes="7rem, (max-width: 850px) 5rem, (max-width: 450px) 4rem"
                                            className={styles.calloutSetSymbol}
                                            src={calloutSet.bannerImage.url}
                                            alt='Callout Set Symbol'
                                        />
                                    </div>
                                    <div className={styles.calloutSetText}>
                                        <h2>{calloutSet.name}</h2>
                                        <ul className={styles.calloutSetActivityList}>
                                            {calloutSet.activities.map(activity => (
                                                <Link
                                                    key={activity.name}    
                                                    href={`/callout/${calloutSet.id}?activity=${activity.id}`}
                                                    onMouseEnter={() => setIsHoveringActivity(true)}
                                                    onMouseLeave={() => setIsHoveringActivity(false)}
                                                >
                                                    <li>{activity.name}</li>
                                                </Link>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
