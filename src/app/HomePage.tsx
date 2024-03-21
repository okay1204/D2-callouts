'use client'

import PageSection from '@/components/PageSection'
import Slideshow from '@/components/Slideshow'
import KingsFallDoor from '@/images/home-carousel/kings-fall-door.png'
import MenacingCrota from '@/images/home-carousel/menacing-crota.png'
import MenacingOryx from '@/images/home-carousel/menacing-oryx.png'
import MenacingRhulk from '@/images/home-carousel/menacing-rhulk.png'
import WitnessWitnessing from '@/images/home-carousel/witness-witnessing.png'
import PlanetsBackground from '@/images/planets-background.png'
import { CalloutSet } from '@/utils/callouts/calloutSets'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Variants, motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import styles from './Home.module.css'

const calloutSetVariants: Variants = {
    visible: {
        y: 0,
        opacity: 1,
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
    const [hoveredCalloutSet, setHoveredCalloutSet] = useState<string | null>(null);
    const [isHoveringActivity, setIsHoveringActivity] = useState(false);
    const calloutSetRef = useRef<HTMLHeadingElement>(null);

    const router = useRouter();

    return (
        <div className={styles.homePage}>
            <PageSection backgroundSrc={PlanetsBackground} backgroundAlt='Planets background' ref={calloutSetRef}>
                <div className={styles.calloutSectionCenterAligner}>
                    <div className={styles.calloutSplitter}>
                        <div className={styles.calloutListSection}>
                            <div className={styles.calloutTypePicker}>
                                <div className={styles.calloutTypeButton}>
                                    Symbols
                                </div>
                                <div className={styles.calloutTypeButton}>
                                    Maps
                                </div>
                            </div>
                            <div className={styles.calloutList}>
                                {calloutSets.map(calloutSet => (
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        variants={calloutSetVariants}
                                        className={styles.calloutSet}
                                        onMouseEnter={() => setHoveredCalloutSet(calloutSet.id)}
                                        onMouseLeave={() => setHoveredCalloutSet(null)}
                                        key={calloutSet.id}
                                        onClick={() => !isHoveringActivity && router.push(`/callout/${calloutSet.id}`)}
                                    >
                                        <Image 
                                            className={styles.calloutSetBackground}
                                            src={`/images/callouts/${calloutSet.id}/extra/banner-background.png`}
                                            alt='Callout Set Background'
                                            fill
                                        />
                                        <div className={styles.calloutSetSymbolContainer} key={calloutSet.bannerImage.name}>
                                            <Image
                                                fill
                                                sizes="5.25rem, (max-width: 850px) 5rem, (max-width: 450px) 4rem"
                                                className={styles.calloutSetSymbol}
                                                src={calloutSet.bannerImage.url}
                                                alt='Callout Set Symbol'
                                            />
                                        </div>
                                        <div className={styles.calloutSetText}>
                                            <h2>{calloutSet.name}</h2>
                                            <ul
                                                className={styles.calloutSetActivityList}
                                                // One activity is approximately 23px tall
                                                style={{ maxHeight: hoveredCalloutSet === calloutSet.id ? 23 * calloutSet.activities.length : 0 }}
                                            >
                                                {calloutSet.activities.map(activity => (
                                                    <Link
                                                        key={activity.name}
                                                        className={styles.calloutSetActivityLink}
                                                        href={`/callout/${calloutSet.id}?activity=${activity.id}`}
                                                        onMouseEnter={() => setIsHoveringActivity(true)}
                                                        onMouseLeave={() => setIsHoveringActivity(false)}
                                                    >
                                                        <li>{activity.name}</li>
                                                    </Link>
                                                ))}
                                            </ul>
                                        </div>
                                        <FontAwesomeIcon className={styles.calloutSetArrow} icon={faArrowRight} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className={styles.calloutSetSlideshowWrapper}
                        >
                            <Slideshow images={[WitnessWitnessing, KingsFallDoor, MenacingOryx, MenacingRhulk, MenacingCrota]} />
                        </motion.div>
                    </div>
                </div>
            </PageSection>
        </div>
    )
}
