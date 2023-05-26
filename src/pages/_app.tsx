import '@/styles/globals.css'
import styles from './App.module.css'
import type { AppProps } from 'next/app'

import Head from 'next/head'
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>D2 Callouts</title>
                <meta name="description" content="Cooperate with your team and master your raid callouts" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.webpageContainer}>
                <Navbar />
                <Component {...pageProps} />
            </div>
        </>
    );
}