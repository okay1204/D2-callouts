import '@/styles/globals.css';
import styles from './RootLayout.module.css';

import Navbar from '@/components/Navbar';
import { Metadata } from 'next';

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html>
            <body className={styles.webpageContainer}>
                <Navbar />
                {children}
            </body>
        </html>
    )
}

export const metadata: Metadata = {
    title: 'D2 Callouts',
    description: 'Cooperate with your team and master your raid callouts',
    viewport: 'width=device-width, initial-scale=1',
    applicationName: 'D2 Callouts',
    authors: [{ name: 'okay1204', url: 'https://github.com/okay1204'}, { name: 'Shadowttk', url: 'https://www.twitch.tv/shadowttk'}],
    generator: 'Next.js',
    keywords: ['d2', 'destiny', 'destiny 2', 'callouts', 'd2 callouts', 'destiny callouts', 'vow', 'hive', 'last wish', 'symbols', 'icons', 'glyphs', 'runes', 'raid', 'raid callouts', 'raid symbols', 'raid icons', 'raid glyphs', 'raid runes'],
    icons: '/favicon.ico',
    themeColor: '#3D3B8E',
    colorScheme: 'dark',
}