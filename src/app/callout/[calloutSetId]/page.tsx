import { getCalloutSets } from "@/utils/callouts/calloutSets";
import CalloutSetPage from "./CalloutSetPage";

export default async function CalloutSet({ params }: {params: { calloutSetId: string } }) {
    const calloutSets = await getCalloutSets();
    const calloutSet = calloutSets.find(calloutSet => calloutSet.id === params.calloutSetId);

    return <CalloutSetPage calloutSet={calloutSet} />
}