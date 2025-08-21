/**
 * Example: Updated Game Mechanics
 *
 * This example demonstrates the new game mechanics with:
 * - Count-based wins (8+ symbols) instead of cluster-based
 * - Zeus scatter symbols triggering free spins
 * - Multiplier orbs with accumulating effects
 * - Proper payout tiers for different symbol counts
 */

import { PayoutCalculator, ZEUS_SCATTER_SYMBOL, MULTIPLIER_ORB_SYMBOL, MIN_SYMBOL_WIN_COUNT } from "../src/payout-calculator";

function demonstrateNewMechanics() {
    console.log("🎰 New Game Mechanics Demonstration\n");

    const payoutCalculator = new PayoutCalculator();
    const betSize = 1;

    // Example 1: Regular symbol wins with different counts
    console.log("=== Example 1: Regular Symbol Wins ===");

    // Board with 8 Crown symbols (symbol 0) - should trigger 10x payout
    const board1 = [
        0,
        0,
        0,
        0,
        0, // 5 crowns in row 1
        0,
        0,
        0,
        1,
        2, // 3 more crowns + other symbols
        3,
        4,
        5,
        6,
        7, // Other symbols
        8,
        1,
        2,
        3,
        4, // Other symbols
        5,
        6,
        7,
        8,
        1, // Other symbols
        2,
        3,
        4,
        5,
        6, // Other symbols
    ];

    const result1 = payoutCalculator.calculatePayout(board1, [], betSize);
    console.log(`Board with 8 Crown symbols:`);
    console.log(`- Symbol wins: ${result1.symbolWins.length}`);
    if (result1.symbolWins.length > 0) {
        const crownWin = result1.symbolWins[0];
        console.log(`- Crown win: ${crownWin.count} symbols = ${crownWin.multipliedWin}x bet`);
    }
    console.log(`- Total win: ${result1.totalWin}x bet\n`);

    // Example 2: Board with 12+ Crown symbols - should trigger 50x payout
    console.log("=== Example 2: High Count Symbol Win ===");

    const board2 = [
        0,
        0,
        0,
        0,
        0, // 5 crowns
        0,
        0,
        0,
        0,
        0, // 5 more crowns
        0,
        0,
        1,
        2,
        3, // 2 more crowns (12 total) + others
        4,
        5,
        6,
        7,
        8, // Other symbols
        1,
        2,
        3,
        4,
        5, // Other symbols
        6,
        7,
        8,
        1,
        2, // Other symbols
    ];

    const result2 = payoutCalculator.calculatePayout(board2, [], betSize);
    console.log(`Board with 12+ Crown symbols:`);
    if (result2.symbolWins.length > 0) {
        const crownWin = result2.symbolWins[0];
        console.log(`- Crown win: ${crownWin.count} symbols = ${crownWin.multipliedWin}x bet`);
    }
    console.log(`- Total win: ${result2.totalWin}x bet\n`);

    // Example 3: Zeus scatter symbols triggering free spins
    console.log("=== Example 3: Zeus Scatter Free Spins ===");

    const board3 = [
        9,
        1,
        2,
        3,
        4, // 1 Zeus
        5,
        9,
        7,
        8,
        1, // 1 Zeus
        2,
        3,
        9,
        5,
        6, // 1 Zeus
        7,
        8,
        1,
        9,
        3, // 1 Zeus (4 total)
        4,
        5,
        6,
        7,
        8, // Other symbols
        1,
        2,
        3,
        4,
        5, // Other symbols
    ];

    const result3 = payoutCalculator.calculatePayout(board3, [], betSize);
    console.log(`Board with 4 Zeus scatter symbols:`);
    console.log(`- Triggers free spins: ${result3.triggersFreeSpin}`);
    console.log(`- Free spins awarded: ${result3.freeSpinsAwarded}`);
    if (result3.scatterWin) {
        console.log(`- Scatter payout: ${result3.scatterWin.baseWin}x bet`);
    }
    console.log(`- Total win: ${result3.totalWin}x bet\n`);

    // Example 4: Multiple symbol wins
    console.log("=== Example 4: Multiple Symbol Types ===");

    const board4 = [
        0,
        0,
        0,
        0,
        0, // 5 crowns
        0,
        0,
        0,
        1,
        1, // 3 more crowns + 2 hourglasses
        1,
        1,
        1,
        1,
        1, // 5 more hourglasses
        1,
        2,
        3,
        4,
        5, // 1 more hourglass + others
        6,
        7,
        8,
        1,
        2, // Other symbols
        3,
        4,
        5,
        6,
        7, // Other symbols
    ];

    const result4 = payoutCalculator.calculatePayout(board4, [], betSize);
    console.log(`Board with 8 Crowns and 8 Hourglasses:`);
    console.log(`- Number of symbol wins: ${result4.symbolWins.length}`);
    result4.symbolWins.forEach((win, index) => {
        console.log(`- Win ${index + 1}: ${win.count}x symbol ${win.symbol} = ${win.multipliedWin}x bet`);
    });
    console.log(`- Total win: ${result4.totalWin}x bet\n`);

    // Example 5: Multiplier orb with accumulated multiplier
    console.log("=== Example 5: Multiplier Orb Effect ===");

    const board5 = [
        0,
        0,
        0,
        0,
        0, // 5 crowns
        0,
        0,
        0,
        10,
        1, // 3 more crowns + multiplier orb
        2,
        3,
        4,
        5,
        6, // Other symbols
        7,
        8,
        1,
        2,
        3, // Other symbols
        4,
        5,
        6,
        7,
        8, // Other symbols
        1,
        2,
        3,
        4,
        5, // Other symbols
    ];

    const multipliers5 = [5]; // Multiplier orb has 5x value
    const accumulatedMultiplier = 3; // From previous free spins

    const result5 = payoutCalculator.calculatePayout(board5, multipliers5, betSize, accumulatedMultiplier);
    console.log(`Board with 8 Crowns + Multiplier Orb (5x) + Accumulated Multiplier (3x):`);
    console.log(`- Multiplier orb value: ${result5.multiplierOrbValue}x`);
    if (result5.symbolWins.length > 0) {
        const crownWin = result5.symbolWins[0];
        console.log(`- Base crown win: ${crownWin.baseWin}x bet`);
        console.log(`- With accumulated multiplier: ${crownWin.multipliedWin}x bet`);
    }
    console.log(`- Total win: ${result5.totalWin}x bet\n`);

    // Example 6: No wins (less than 8 symbols)
    console.log("=== Example 6: No Wins (Less than 8 symbols) ===");

    const board6 = [
        0,
        0,
        0,
        1,
        1, // Only 3 crowns, 2 hourglasses
        2,
        2,
        3,
        3,
        4, // Only 2 of each type
        4,
        5,
        5,
        6,
        6, // Only 2 of each type
        7,
        7,
        8,
        8,
        1, // Only 2 of each type
        2,
        3,
        4,
        5,
        6, // Mixed symbols
        7,
        8,
        1,
        2,
        3, // Mixed symbols
    ];

    const result6 = payoutCalculator.calculatePayout(board6, [], betSize);
    console.log(`Board with scattered symbols (no 8+ clusters):`);
    console.log(`- Symbol wins: ${result6.symbolWins.length}`);
    console.log(`- Total win: ${result6.totalWin}x bet`);
    console.log(`- No wins because no symbol appears 8+ times\n`);

    console.log("✅ New game mechanics demonstration completed!");

    // Show payout rules summary
    console.log("\n📊 Payout Rules Summary:");
    console.log("Regular Symbols (require 8+ symbols):");
    console.log("Crown (0):     8-9 = 10x,  10-11 = 25x,  12+ = 50x");
    console.log("Hourglass (1): 8-9 = 1.5x, 10-11 = 2x,   12+ = 12x");
    console.log("Ring (2):      8-9 = 2x,   10-11 = 5x,   12+ = 15x");
    console.log("...(other symbols with decreasing values)");
    console.log("\nZeus Scatter (9): 4 = 3x + 15 FS, 5 = 5x + 15 FS, 6+ = 100x + 15 FS");
    console.log("Multiplier Orb (10): Adds to accumulated multiplier in free spins");
}

// Run demonstration if this file is executed directly
if (require.main === module) {
    demonstrateNewMechanics();
}

export { demonstrateNewMechanics };
