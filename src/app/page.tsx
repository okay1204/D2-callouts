
import { getCalloutSets } from '@/utils/callouts/calloutSets';
// import { getMapData } from '@/utils/maps/maps';
import HomePage from './HomePage';

export default async function Home() {
    // console.log(await getMapData());
    return <HomePage calloutSets={await getCalloutSets()} />
}
