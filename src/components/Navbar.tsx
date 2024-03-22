'use client'

import Logo from '@/images/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Navbar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import SavedSetsButtonBorder from '@/images/saved-sets-button-border.svg'

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <button className={styles.menuButton}>
                <FontAwesomeIcon className={styles.menuIcon} icon={faBars} />
            </button>
            <div className={styles.searchBar}>
                <FontAwesomeIcon className={styles.searchIcon} icon={faMagnifyingGlass} />
                <input type="text" className={styles.searchBarText} placeholder="Activity Search" />
            </div>
            <Link href="/" className={styles.savedSetsButton}>
                <Image
                    src={SavedSetsButtonBorder}
                    className={styles.savedSetsButtonBorder}
                    alt=''
                />
                <Image
                    src={Logo}
                    className={styles.logo}
                    alt="D2 Callouts Logo"
                />
            </Link>
        </nav>
    )
}