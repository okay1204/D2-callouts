'use client'

import Link from 'next/link'
import styles from './Navbar.module.css'
import Image from 'next/image'

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/"><Image src="/logo.png" alt="D2 Callouts Logo" width={50} height={50} /></Link>
            <h1>D2 Callouts</h1>
            <h3>by okay</h3>
        </nav>
    )
}