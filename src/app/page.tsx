'use client'

import RaidEmblem from '@/images/raid-emblem.png'
import { motion } from "framer-motion"
import Image from 'next/image'
import styles from './Home.module.css'

export default function HomePage() {
    return (
        <>
            <div className={styles.bannerBackground}>
                <div className={styles.bannerBackgroundFade}>
                    <div className={styles.banner}>
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className={styles.bannerText}
                        >
                            <h1>Get your raid team on the same page.</h1>
                            <span>View, edit, and share callouts in an instant</span>
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
                            <Image className={styles.bannerImage} src={RaidEmblem} alt='Raid Emblem' />
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    )
}
