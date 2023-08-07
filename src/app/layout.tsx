import Footer from '@/components/Footer';
import { Montserrat, Roboto } from 'next/font/google';
import styles from './RootLayout.module.css';
import './globals.css';


import { Metadata } from 'next';
import Navbar from '@/components/Navbar';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['500', '800', '900'],
    display: 'swap',
    variable: '--font-title',
})

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '700', '900'],
    display: 'swap',
    variable: '--font-primary',
})

export default function RootLayout({children}: {children: React.ReactNode[]}) {
    return (
        <html lang='en' className={`${montserrat.variable} ${roboto.variable}`}>
            <body>
                <Navbar />
                <div className={styles.webpageContainer}>
                    <main>
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    )
}

const title = 'D2 Callouts'
const description = 'Cooperate with your team and master your raid callouts. View, customize, and share callouts for Destiny 2 raids and dungeons.'

export const metadata: Metadata = {
    title: title,
    description: description,
    metadataBase: new URL('https://d2callouts.com'),
    openGraph: {
        type: 'website',
        title: title,
        siteName: 'D2 Callouts',
        description: description,         
    },
    twitter: {
        creator: '@okay2996',
    },
    viewport: 'width=device-width, initial-scale=1',
    applicationName: 'D2 Callouts',
    authors: [{ name: 'okay1204', url: 'https://linktr.ee/okay1204'}, { name: 'Shadowttk', url: 'https://linktr.ee/shadowttk'}],
    generator: 'Next.js',
    keywords: ['d2', 'destiny', 'destiny 2', 'callouts', 'd2 callouts', 'destiny callouts', 'vow', 'hive', 'last wish', 'symbols', 'icons', 'glyphs', 'runes', 'raid', 'raid callouts', 'raid symbols', 'raid icons', 'raid glyphs', 'raid runes'],
    icons: '/favicon.ico',
    themeColor: '#3D3B8E',
    colorScheme: 'dark',
}