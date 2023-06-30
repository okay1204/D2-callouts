'use client'

import Image from 'next/image'
import styles from './Footer.module.css'
import Logo from '@/images/logo.png'
import Link from 'next/link'
import { useWindowSize } from '@/utils/hooks';

export default function Footer() {
    const windowSize = useWindowSize();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.imageContainer}>
                    <Image className={styles.image} src={Logo} alt="D2 Callouts Logo" />
                </div>
                <div className={styles.footerText}>
                    <h3>D2 Callouts</h3>
                    <p>
                        developed by <Link href={'https://linktr.ee/okay1204'} target='_blank' >okay</Link> {windowSize.width && windowSize.width >= 500 ? '•' : <br />} designed by <Link href={'https://linktr.ee/shadowttk'} target='_blank' >Shadow</Link>
                    </p>
                </div>
            </div>
        </footer>
    )
}