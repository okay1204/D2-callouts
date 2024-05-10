export interface BaseCalloutSet {
    name: string;
    id: string;
    bannerImageId: number;
    bannerColor: string;
}

export interface RawActivity {
    name: string;
    id: string;
    imageIds: number[];
}

export interface RawCalloutSet extends BaseCalloutSet {
    activities: RawActivity[];
}

export const rawCalloutSets: RawCalloutSet[] = [
    {
        name: 'Wish Symbols',
        activities: [
            {
                name: 'Shattered Throne',
                id: 'shattered-throne',
                imageIds: [1, 2, 4, 7, 9, 12, 15],
            },
            {
                name: 'Last Wish',
                id: 'last-wish',
                imageIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            },
            {
                name: 'Starcrossed',
                id: 'starcrossed',
                imageIds: [2, 5, 8, 15],
            }
        ],
        id: 'wish-symbols',
        bannerImageId: 5,
        bannerColor: '#B0C2FF',
    },
    {
        name: 'Hive Runes',
        activities: [
            {
                name: 'Pit of Heresy',
                id: 'pit-of-heresy',
                imageIds: [2, 3, 4, 7, 8, 9, 10, 12, 13, 16],
            },
            {
                name: "King's Fall",
                id: 'kings-fall',
                imageIds: [0, 1, 4, 5, 6, 7, 9, 11, 17],
            },
            {
                name: 'Ghosts of the Deep',
                id: 'ghosts-of-the-deep',
                imageIds: [0, 1, 2, 3, 4, 5, 6, 7],
            },
        ],
        id: 'hive-runes',
        bannerImageId: 7,
        bannerColor: '#9EFFC5',
    },
    {
        name: 'Glyphs',
        activities: [
            {
                name: 'Vow of the Disciple',
                id: 'vow-of-the-disciple',
                imageIds: [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
                ],
            },
        ],
        id: 'glyphs',
        bannerImageId: 10,
        bannerColor: '#FF88BA',
    },
];
