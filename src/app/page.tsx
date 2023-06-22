
import { CalloutSet, getCalloutSets } from '@/utils/callouts/calloutSets';
import HomePage from './Home';

export default async function Home({ calloutSets }: { calloutSets: CalloutSet }) {
    return <HomePage calloutSets={await getCalloutSets()} />
}
