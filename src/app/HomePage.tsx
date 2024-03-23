'use client'

import PageSection from '@/components/PageSection'
import Slideshow from '@/components/Slideshow'
import WelcomeModal from '@/components/WelcomeModal'
import EarthBackground from '@/images/earth-background.png'
import KingsFallDoor from '@/images/home-carousel/kings-fall-door.png'
import MenacingCrota from '@/images/home-carousel/menacing-crota.png'
import MenacingOryx from '@/images/home-carousel/menacing-oryx.png'
import MenacingRhulk from '@/images/home-carousel/menacing-rhulk.png'
import WitnessWitnessing from '@/images/home-carousel/witness-witnessing.png'
import MapsIcon from '@/images/icons/maps.svg'
import SymbolsIcon from '@/images/icons/symbols.svg'
import { CalloutSet } from '@/utils/callouts/calloutSets'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Variants, motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
    const [symbolsSelected, setSymbolsSelected] = useState(true);
    const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

    // Only show the welcome modal if it's the user's first time visiting the site
    useEffect(() => {
        if (!localStorage.getItem('welcomeModalAcknowledged')) {
            setWelcomeModalOpen(true);
        }
    }, []);
    
    const handleWelcomeModalButtonClick = () => {
        setWelcomeModalOpen(false);
        localStorage.setItem('welcomeModalAcknowledged', 'true');
    }

    const router = useRouter();

    return (
        <div className={styles.homePage}>
            {welcomeModalOpen && <WelcomeModal onButtonClick={handleWelcomeModalButtonClick} />}

            <PageSection backgroundSrc={EarthBackground} backgroundAlt='Earth Background'>
                <div className={styles.calloutSectionCenterAligner}>
                    <div className={styles.calloutSplitter}>
                        <div className={styles.calloutListSection}>
                            <div className={styles.calloutTypePicker}>
                                <div className={`${styles.calloutTypeButton} ${symbolsSelected ? styles.selectedCalloutType : ''}`} onClick={() => setSymbolsSelected(true)}>
                                    <Image 
                                        src={SymbolsIcon}
                                        alt='Symbols Icon'
                                        className={styles.calloutTypeIcon}
                                    />
                                    <h2 className={styles.calloutTypeText}>Symbols</h2>
                                </div>
                                <div className={`${styles.calloutTypeButton} ${!symbolsSelected ? styles.selectedCalloutType : ''}`} onClick={() => setSymbolsSelected(false)}>
                                    <Image 
                                        src={MapsIcon}
                                        alt='Maps Icon'
                                        className={styles.calloutTypeIcon}
                                    />
                                    <h2 className={styles.calloutTypeText}>Maps</h2>
                                </div>
                            </div>
                            <div className={styles.calloutList}>
                                {calloutSets.map(calloutSet => (
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        variants={calloutSetVariants}
                                        className={styles.calloutSet}
                                        // style={{ maxHeight: hoveredCalloutSet === calloutSet.id ? (23 * calloutSet.activities.length) + 110 : 110 }}
                                        onMouseEnter={() => setHoveredCalloutSet(calloutSet.id)}
                                        onMouseLeave={() => setHoveredCalloutSet(null)}
                                        key={calloutSet.id}
                                        onClick={() => !isHoveringActivity && router.push(`/callout/${calloutSet.id}`)}
                                    >
                                        <div className={styles.calloutSetSymbolContainer} key={calloutSet.bannerImage.name}>
                                            <Image
                                                fill
                                                sizes="4.25rem, (max-width: 850px) 5rem, (max-width: 450px) 4rem"
                                                className={styles.calloutSetSymbol}
                                                src={calloutSet.bannerImage.url}
                                                alt='Callout Set Symbol'
                                            />
                                        </div>
                                        <div className={styles.calloutSetDivider} style={{backgroundColor: calloutSet.bannerColor}} />
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
