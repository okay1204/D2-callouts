
import { getCalloutSets } from '@/utils/callouts/calloutSets';
import HomePage from './HomePage';

export default async function Home() {
    return <HomePage calloutSets={await getCalloutSets()} />
}
