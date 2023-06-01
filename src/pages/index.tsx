import RaidEmblem from '@/images/raid-emblem.webp'
import Image from 'next/image'
import styles from './Home.module.css'

export default function Home() {
    return (
        <main>
            <div className={styles.showcaseBackground}>
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
        </main>
    )
}
