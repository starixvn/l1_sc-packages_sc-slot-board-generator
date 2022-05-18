export default {
    normalSymbols: [
        {
            symbol: 0,
            payout: [
                { from: 8, to: 9, odds: 5 },
                { from: 10, to: 11, odds: 15 },
                { from: 12, to: 30, odds: 40 },
            ],
        },
        {
            symbol: 1,
            payout: [
                { from: 8, to: 9, odds: 8 },
                { from: 10, to: 11, odds: 18 },
                { from: 12, to: 30, odds: 80 },
            ],
        },
        {
            symbol: 2,
            payout: [
                { from: 8, to: 9, odds: 10 },
                { from: 10, to: 11, odds: 20 },
                { from: 12, to: 30, odds: 100 },
            ],
        },
        {
            symbol: 3,
            payout: [
                { from: 8, to: 9, odds: 16 },
                { from: 10, to: 11, odds: 24 },
                { from: 12, to: 30, odds: 160 },
            ],
        },
        {
            symbol: 4,
            payout: [
                { from: 8, to: 9, odds: 20 },
                { from: 10, to: 11, odds: 30 },
                { from: 12, to: 30, odds: 200 },
            ],
        },
        {
            symbol: 5,
            payout: [
                { from: 8, to: 9, odds: 30 },
                { from: 10, to: 11, odds: 40 },
                { from: 12, to: 30, odds: 240 },
            ],
        },
        {
            symbol: 6,
            payout: [
                { from: 8, to: 9, odds: 40 },
                { from: 10, to: 11, odds: 100 },
                { from: 12, to: 30, odds: 300 },
            ],
        },
        {
            symbol: 7,
            payout: [
                { from: 8, to: 9, odds: 50 },
                { from: 10, to: 11, odds: 200 },
                { from: 12, to: 30, odds: 500 },
            ],
        },
        {
            symbol: 8,
            payout: [
                { from: 8, to: 9, odds: 200 },
                { from: 10, to: 11, odds: 500 },
                { from: 12, to: 30, odds: 1000 },
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
};
