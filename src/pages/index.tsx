import RaidEmblem from '@/images/raid-emblem.png'
import Image from 'next/image'
import styles from './Home.module.css'
import { useEffect, useState } from 'react'


export default function Home() {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [visible, setVisible] = useState(false);

    // Track mouse position and update showcaseMouse position
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePos({ x: event.clientX, y: event.clientY });
        };


        window.addEventListener('mousemove', handleMouseMove);
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <main>
            <div className={styles.showcaseBackground} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
                <div className={styles.showcaseMouse} style={{top: mousePos.y - 330, left: mousePos.x - 250, visibility: visible ? 'visible' : 'hidden'}}>
                </div>
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
