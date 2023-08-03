import 'server-only'
import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'
import { BaseCalloutSet, RawActivity, rawCalloutSets } from './rawCalloutSets'

export interface ImageReference {
    id: number
    name: string
    url: string
}

interface CalloutImageDictionary {
    [imageId: number]: ImageReference
}

export interface Activity extends RawActivity {
    images: ImageReference[];
}

export interface CalloutSet extends BaseCalloutSet {
    activities: Activity[];
    bannerImage: ImageReference;
    allImages: ImageReference[];
}


const getCalloutImages = cache(async (calloutSetId: string): Promise<CalloutImageDictionary> => {
    const calloutImages: CalloutImageDictionary = {}

    const imageUrls = await fs.readdir(path.join(process.cwd(), '/public/images/callouts', calloutSetId))
    for (const fileName of imageUrls) {
        if (fileName === 'extra') continue

        const imageParts = path.basename(fileName).split('-')
        const imageId = parseInt(imageParts[0])
        const imageName = imageParts[1].split('.')[0]

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
        const allImages = Object.values(calloutImages)

        const calloutSet: CalloutSet = {
            ...rawCalloutSet,
            activities: rawCalloutSet.activities.map(activity => {
                return {
                    ...activity,
                    images: activity.imageIds.map(imageId => {
                        return calloutImages[imageId]
                    }),
                }
            }),
            bannerImage: calloutImages[rawCalloutSet.bannerImageId],
            allImages,
        }

        calloutSets.push(calloutSet)
    }

    return calloutSets
})
