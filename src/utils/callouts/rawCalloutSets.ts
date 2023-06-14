export interface RawActivity {
    name: string;
    imageIds: number[];
}

export interface RawCalloutSet {
    name: string;
    activities: RawActivity[];
    // The id is also the image folder name
    id: string;
    bannerImageIds: number[];
    whiteBannerSymbolFilter?: boolean;
}

export const rawCalloutSets: RawCalloutSet[] = [
    {
        name: 'Wish Symbols',
        activities: [
            {
                name: 'Shattered Throne',
                imageIds: [1, 2, 4, 7, 9, 12, 15],
            },
            {
                name: 'Last Wish',
                imageIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            },
        ],
        id: 'wish-symbols',
        bannerImageIds: [0, 11, 15]
    },
    {
        name: 'Hive Runes',
        activities: [
            {
                name: 'Pit of Heresy',
                imageIds: [2, 3, 4, 7, 8, 9, 10, 12, 13, 16],
            },
            {
                name: "King's Fall",
                imageIds: [0, 1, 4, 5, 6, 7, 9, 11, 17],
            },
            {
                name: 'Ghosts of the Deep',
                imageIds: [0, 2, 3, 4, 5, 6, 7],
            },
        ],
        id: 'hive-runes',
        bannerImageIds: [12, 14, 15],
        whiteBannerSymbolFilter: true
    },
    {
        name: 'Glyphs',
        activities: [
            {
                name: 'Vow of the Disciple',
                imageIds: [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
                ],
            },
        ],
        id: 'glyphs',
        bannerImageIds: [11, 23, 25]
    },
];
