import calloutData from '@/calloutData';
import { promises as fs } from 'fs';
import path from 'path';
import HomePage from './Home';

export default async function Home() {
    const calloutSetBannerSymbols: { [key: string]: string[] } = {}

    for (const calloutSet of calloutData) {
        calloutSetBannerSymbols[calloutSet.id] = await fs.readdir(path.join(process.cwd(), '/public/images/callouts', calloutSet.id.replace(' ', '%20'), '/banner/symbols'))
    }

    return <HomePage calloutSetBannerSymbols={calloutSetBannerSymbols} />
}