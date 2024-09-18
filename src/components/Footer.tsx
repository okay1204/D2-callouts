'use client'

import { useWindowSize } from '@/utils/hooks'
import FullLogo from '@/images/full-logo.png'
import styles from './Footer.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faHeart } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
    const windowSize = useWindowSize();

    return (
        <footer className={styles.footer}>
            <div className={styles.imageContainer}>
                <Image className={styles.image} src={FullLogo} alt="D2 Callouts Logo" />
            </div>

            <hr className={styles.footerDivider} />

            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h2 className={styles.footerSectionHeader}>Resources</h2>
                    <ul className={styles.footerSectionList}>
                        <li>
                            <Link href='https://www.youtube.com/watch?v=0C7q2geELtc&ab_channel=Shadow' target='_blank'>
                                Tutorial Video
                                <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.footerListIcon} />
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h2 className={styles.footerSectionHeader}>Updates & Feedback</h2>
                    <ul className={styles.footerSectionList}>
                        <li>
                            <Link href='https://discord.com/invite/qKxRvtx62H' target='_blank'>
                                Discord Server
                                <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.footerListIcon} />
                            </Link>
                        </li>
                        <li>
                            <Link href='https://twitter.com/d2callouts' target='_blank'>
                                Twitter/X
                                <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.footerListIcon} />
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h2 className={styles.footerSectionHeader}>Support Us</h2>
                    <ul className={styles.footerSectionList}>
                        <li>
                            <Link href='https://ko-fi.com/zackariaghanbari' target='_blank'>
                                Donate
                                <FontAwesomeIcon icon={faHeart} className={styles.footerListIcon} />
                            </Link>
                        </li>
                        <li>
                            <Link href='https://linktr.ee/shadowttk' target='_blank'>
                                Shadow <span className={styles.sideText}>(designer)</span>
                            </Link>
                        </li>
                        <li>
                            <Link href='https://linktr.ee/okay1204' target='_blank'>
                                okay <span className={styles.sideText}>(developer)</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}