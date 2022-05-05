export default {
    reels: 5,
    symbolsOnReel: 6,
    numberOfSymbols: 11,
    normalSymbols: [
        {
            symbol: 0,
            payout: [
                { from: 8, to: 10, odds: 5 },
                { from: 10, to: 12, odds: 15 },
                { from: 12, to: 30, odds: 40 },
            ],
        },
        {
            symbol: 1,
            payout: [
                { from: 8, to: 10, odds: 8 },
                { from: 10, to: 12, odds: 18 },
                { from: 12, to: 30, odds: 80 },
            ],
        },
        {
            symbol: 2,
            payout: [
                { from: 8, to: 10, odds: 10 },
                { from: 10, to: 12, odds: 20 },
                { from: 12, to: 30, odds: 100 },
            ],
        },
        {
            symbol: 3,
            payout: [
                { from: 8, to: 10, odds: 16 },
                { from: 10, to: 12, odds: 24 },
                { from: 12, to: 30, odds: 160 },
            ],
        },
        {
            symbol: 4,
            payout: [
                { from: 8, to: 10, odds: 20 },
                { from: 10, to: 12, odds: 30 },
                { from: 12, to: 30, odds: 200 },
            ],
        },
        {
            symbol: 5,
            payout: [
                { from: 8, to: 10, odds: 30 },
                { from: 10, to: 12, odds: 40 },
                { from: 12, to: 30, odds: 240 },
            ],
        },
        {
            symbol: 6,
            payout: [
                { from: 8, to: 10, odds: 40 },
                { from: 10, to: 12, odds: 100 },
                { from: 12, to: 30, odds: 300 },
            ],
        },
        {
            symbol: 7,
            payout: [
                { from: 8, to: 10, odds: 50 },
                { from: 10, to: 12, odds: 200 },
                { from: 12, to: 30, odds: 500 },
            ],
        },
        {
            symbol: 8,
            payout: [
                { from: 8, to: 10, odds: 200 },
                { from: 10, to: 12, odds: 500 },
                { from: 12, to: 30, odds: 1000 },
            ],
        },
    ],
    freeSpins: {
        symbol: 9,
        payout: [
            { from: 4, to: 5, odds: 3 },
            { from: 5, to: 6, odds: 6 },
            { from: 6, to: 30, odds: 18 },
        ],
        retriggerAward: 5,
    },
    multiplier: {
        symbol: 10,
        min: 2,
        max: 200,
    },
    numberOfShuffles: 3,
};
