'use client'

import Logo from '@/images/logo.png'
import { useWindowSize } from '@/utils/hooks'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
    const windowSize = useWindowSize();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.left}>
                    <div className={styles.imageContainer}>
                        <Image className={styles.image} src={Logo} alt="D2 Callouts Logo" />
                    </div>
                    <div className={styles.footerText}>
                        <h3>D2 Callouts</h3>
                        <p>
                            developed by <Link href={'https://linktr.ee/okay1204'} target='_blank' >okay</Link> {windowSize.width && windowSize.width >= 510 ? '•' : <br />} designed by <Link href={'https://linktr.ee/shadowttk'} target='_blank' >Shadow</Link>
                        </p>
                    </div>
                </div>
                <div className={styles.right}>
                    <Link href='https://discord.gg/invite/qKxRvtx62H' target='_blank' className={styles.discordButton} title='Join our Discord'>
                        <FontAwesomeIcon icon={faDiscord} className={styles.discordButtonIcon} />
                    </Link>
                </div>
            </div>
        </footer>
    )
}