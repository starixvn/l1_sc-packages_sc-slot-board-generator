import { Difficulty } from "./difficulties";

export default {
    reels: 5,
    symbolsOnReel: 6,
    numberOfSymbols: 11,
    normalSymbols: [
        {
            symbol: 0,
            payout: [
                { from: 8, to: 9, odds: 0.5 },
                { from: 10, to: 11, odds: 1.5 },
                { from: 12, to: 30, odds: 4 },
            ],
        },
        {
            symbol: 1,
            payout: [
                { from: 8, to: 9, odds: 0.8 },
                { from: 10, to: 11, odds: 1.8 },
                { from: 12, to: 30, odds: 8 },
            ],
        },
        {
            symbol: 2,
            payout: [
                { from: 8, to: 9, odds: 1 },
                { from: 10, to: 11, odds: 2 },
                { from: 12, to: 30, odds: 10 },
            ],
        },
        {
            symbol: 3,
            payout: [
                { from: 8, to: 9, odds: 1.6 },
                { from: 10, to: 11, odds: 2.4 },
                { from: 12, to: 30, odds: 16 },
            ],
        },
        {
            symbol: 4,
            payout: [
                { from: 8, to: 9, odds: 2 },
                { from: 10, to: 11, odds: 3 },
                { from: 12, to: 30, odds: 20 },
            ],
        },
        {
            symbol: 5,
            payout: [
                { from: 8, to: 9, odds: 3 },
                { from: 10, to: 11, odds: 4 },
                { from: 12, to: 30, odds: 24 },
            ],
        },
        {
            symbol: 6,
            payout: [
                { from: 8, to: 9, odds: 4 },
                { from: 10, to: 11, odds: 10 },
                { from: 12, to: 30, odds: 30 },
            ],
        },
        {
            symbol: 7,
            payout: [
                { from: 8, to: 9, odds: 5 },
                { from: 10, to: 11, odds: 20 },
                { from: 12, to: 30, odds: 50 },
            ],
        },
        {
            symbol: 8,
            payout: [
                { from: 8, to: 9, odds: 20 },
                { from: 10, to: 11, odds: 50 },
                { from: 12, to: 30, odds: 100 },
            ],
        },
    ],
    freeSpins: {
        symbol: 9,
        initialOdds: [
            { count: 4, odds: 3 },
            { count: 5, odds: 6 },
            { count: 6, odds: 18 },
        ],
        additionalOdds: [{ count: 4, odds: 5 }],
    },
    multiplier: {
        symbol: 10,
        min: 2,
        max: 21,
    },
    numberOfShuffles: 3,
    numberOfSymbolsByDifficulty: {
        [Difficulty.Hard]: {
            0: 39,
            1: 78,
            2: 98,
            3: 122,
            4: 146,
            5: 183,
            6: 219,
            7: 244,
            8: 293,
            9: 26,
            10: 1,
        },
        [Difficulty.Medium]: {
            0: 26,
            1: 52,
            2: 65,
            3: 81,
            4: 98,
            5: 122,
            6: 146,
            7: 163,
            8: 195,
            9: 17,
            10: 1,
        },
        [Difficulty.Easy]: {
            0: 20,
            1: 40,
            2: 50,
            3: 63,
            4: 75,
            5: 94,
            6: 113,
            7: 125,
            8: 150,
            9: 13,
            10: 1,
        },
        [Difficulty.Trial]: {
            0: 19,
            1: 38,
            2: 48,
            3: 59,
            4: 71,
            5: 89,
            6: 107,
            7: 119,
            8: 143,
            9: 13,
            10: 1,
        },
    },
};
