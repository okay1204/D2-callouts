import Image from 'next/image'
import styles from './WelcomeModal.module.css'
import Logo from '@/images/logo.png'

export default function WelcomeModal({ onButtonClick }: { onButtonClick: () => void }) {
    return (
        <div className={styles.welcomeModalBackground}>
            <div className={styles.welcomeModal}>
                <div className={styles.logoContainer}>
                    <Image 
                        src={Logo}
                        alt='Logo'
                        className={styles.logo}
                    />
                </div>
                <div className={styles.text}>
                    <h1 className={styles.header1}>Create & Share</h1>
                    <h1 className={styles.header2}>Custom Destiny 2 Callouts</h1>
                </div>
                <hr className={styles.divider} />
                <button className={styles.getStartedButton} onClick={() => onButtonClick()}>Get Started</button>
                <span className={styles.version}>Version 1.2.0</span>
            </div>
        </div>
    )
}