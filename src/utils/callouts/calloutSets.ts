import 'server-only'
import { RawCalloutSet, rawCalloutSets } from './rawCalloutSets'
import { cache } from 'react'
import path from 'path'
import fs from 'fs/promises'

interface ImageReference {
    id: number
    name: string
    url: string
}

interface CalloutImageDictionary {
    [imageId: number]: ImageReference
}

interface Activity {
    name: string;
    images: ImageReference[];
}

export interface CalloutSet {
    name: string;
    activities: Activity[];
    // The id is also the image folder name
    id: string;
    bannerImages: ImageReference[];
    whiteBannerSymbolFilter?: boolean;
}


const getCalloutImages = cache(async (calloutSetId: string): Promise<CalloutImageDictionary> => {
    const calloutImages: CalloutImageDictionary = {}

    const imageUrls = await fs.readdir(path.join(process.cwd(), '/public/images/callouts', calloutSetId))
    for (const fileName of imageUrls) {
        const imageParts = path.basename(fileName).split('-')
        const imageId = parseInt(imageParts[0])
        const imageName = imageParts[1]

        calloutImages[imageId] = {
            id: imageId,
            name: imageName,
            url: `/images/callouts/${calloutSetId}/${fileName.replace(' ', '%20')}`
        }
    }

    return calloutImages
})

export const getCalloutSets = cache(async (): Promise<CalloutSet[]> => {
    const calloutSets: CalloutSet[] = []

    for (const rawCalloutSet of rawCalloutSets) {
        const calloutImages = await getCalloutImages(rawCalloutSet.id)

        const calloutSet: CalloutSet = {
            ...rawCalloutSet,
            activities: rawCalloutSet.activities.map(activity => {
                return {
                    name: activity.name,
                    images: activity.imageIds.map(imageId => {
                        return calloutImages[imageId]
                    }),
                }
            }),
            bannerImages: rawCalloutSet.bannerImageIds.map(imageId => {
                return calloutImages[imageId]
            }),
        }

        calloutSets.push(calloutSet)
    }

    return calloutSets
})
