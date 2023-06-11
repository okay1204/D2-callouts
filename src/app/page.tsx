import calloutData from '@/calloutData';
import { promises as fs } from 'fs';
import path from 'path';
import HomePage from './Home';

export default async function Home() {
    const calloutSetBannerSymbols: { [key: string]: string[] } = {}

    for (const calloutSet of calloutData) {
        const symbols = await fs.readdir(path.join(process.cwd(), '/public/images/callouts', calloutSet.id, '/banner/symbols'))
        calloutSetBannerSymbols[calloutSet.id] = symbols.map(symbol => symbol.replace(' ', '%20'))
    }

    return <HomePage calloutSetBannerSymbols={calloutSetBannerSymbols} />
}