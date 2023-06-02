interface Activity {
    name: string;
    imageIds: number[];
}

interface CalloutSet {
    name: string;
    activities: Activity[];
    // The id is also the image foler name
    id: string;
}

const symbols: CalloutSet[] = [
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
    },
];

export default symbols;