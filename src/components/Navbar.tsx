'use client'

import FullLogo from '@/images/full-logo.png'
import KofiButton from "kofi-button"
import Image from 'next/image'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.logoContainer}>
                <Image
                    src={FullLogo}
                    className={styles.logo}
                    alt="D2 Callouts Logo"
                />
            </Link>
            
            <KofiButton title='Buy me a coffee' color='var(--primary-darker)' kofiID='zackariaghanbari'/>
        </nav>
    )
}