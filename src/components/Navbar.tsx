import Logo from '@/images/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/"><Image src={Logo} alt="D2 Callouts Logo" width={50} height={50} /></Link>
            <h1>D2 Callouts</h1>
            <h3>by okay</h3>
        </nav>
    )
}