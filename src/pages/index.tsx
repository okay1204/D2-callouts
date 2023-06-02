import calloutData from '@/calloutData'
import RaidEmblem from '@/images/raid-emblem.png'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MouseEvent, useState } from 'react'
import styles from './Home.module.css'


export default function Home() {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [mouseShadowVisible, setMouseShadowVisible] = useState(false);
    const [isHoveringActivity, setIsHoveringActivity] = useState(false);

    const router = useRouter();
    
    return (
        <main>
            <div className={styles.showcaseBackground}
                onMouseMove={(event: MouseEvent) => setMousePos({ x: event.clientX, y: event.clientY })}
                onMouseEnter={() => setMouseShadowVisible(true)}
                onMouseLeave={() => setMouseShadowVisible(false)}
            >
                <div className={styles.showcaseMouse} style={{top: mousePos.y - 330, left: mousePos.x - 250, visibility: mouseShadowVisible ? 'visible' : 'hidden'}} />
                <div className={styles.showcaseBackgroundFade}>
                    <div className={styles.showcase}>
                        <div className={styles.showCaseText}>
                            <h1>Get your raid team on the same page.</h1>
                            <span>View, edit, and share callouts in an instant</span>
                        </div>
                        <div className={styles.showcaseImageContainer}>
                            <Image className={styles.showcaseImage} src={RaidEmblem} alt='Raid Emblem' />
                        </div>
                    </div>
                </div>
            </div>

            <h1 className={styles.calloutListHeader}>Callout sets</h1>
            <div className={styles.calloutList}>
                {calloutData.map(calloutSet => (
                    <div className={styles.calloutSet}
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
                    </div>
                ))}
            </div>
        </main>
    )
}
