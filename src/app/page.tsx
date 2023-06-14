
import { promises as fs } from 'fs';
import path from 'path';
import HomePage from './Home';
import getCalloutSets from '@/utils/callouts/calloutSets';

export default async function Home() {
    return <HomePage calloutSets={await getCalloutSets()} />
}