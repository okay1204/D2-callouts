import { getCalloutSets } from "@/utils/callouts/calloutSets";
import CalloutSetListPage from "./CalloutSetListPage";

export default async function CalloutSetList() {
    return <CalloutSetListPage calloutSets={await getCalloutSets()} />
}