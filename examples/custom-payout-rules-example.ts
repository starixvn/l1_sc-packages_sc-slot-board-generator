/**
 * Example: Using Custom Payout Rules
 *
 * This example demonstrates how to:
 * - Load payout rules from JSON files
 * - Create custom payout configurations
 * - Use different payout rules for testing
 * - Compare results with different rule sets
 */

import { PayoutCalculator, PayoutRulesConfig, generateDemoChain, createPredefinedGenerator } from "../src/index";
import * as fs from "fs";
import * as path from "path";

async function basicCustomRulesExample() {
    console.log("=== Basic Custom Payout Rules Example ===\n");

    // 1. Use default rules (loaded from JSON)
    console.log("1. Default PayoutCalculator (loads from payout-rules.json):");
    const defaultCalculator = new PayoutCalculator();
    const defaultConfig = defaultCalculator.getRulesConfig();
    console.log(`- Game Type: ${defaultConfig.gameType}`);
    console.log(`- Version: ${defaultConfig.version}`);
    console.log(`- Symbol Count: ${defaultConfig.symbolPayouts.length}`);

    // Test with some crown symbols
    const testBoard = [
        0,
        0,
        0,
        0,
        0, // 5 crowns
        0,
        0,
        0,
        1,
        2, // 3 more crowns = 8 total
        3,
        4,
        5,
        6,
        7, // Other symbols
        8,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        1,
        2,
        3,
        4,
        5,
        6,
    ];

    const defaultResult = defaultCalculator.calculatePayout(testBoard, [], 1);
    console.log(`- Crown win with default rules: ${defaultResult.totalWin}x bet\n`);

    return { defaultCalculator, defaultConfig };
}

async function customRulesFromScratchExample() {
    console.log("=== Custom Rules from Scratch ===\n");

    // Create custom rules with higher payouts
    const customRules: PayoutRulesConfig = {
        version: "2.0",
        gameType: "High Payout Zeus Slots",
        description: "Custom high-payout configuration for testing",
        symbolPayouts: [
            {
                symbol: 0,
                name: "Crown",
                type: "premium",
                payouts: [
                    { count: 8, multiplier: 20, description: "8-9 symbols (doubled!)" },
                    { count: 10, multiplier: 50, description: "10-11 symbols (doubled!)" },
                    { count: 12, multiplier: 100, description: "12+ symbols (doubled!)" },
                ],
            },
            {
                symbol: 1,
                name: "Hourglass",
                type: "high",
                payouts: [
                    { count: 8, multiplier: 3, description: "8-9 symbols (doubled!)" },
                    { count: 10, multiplier: 4, description: "10-11 symbols (doubled!)" },
                    { count: 12, multiplier: 24, description: "12+ symbols (doubled!)" },
                ],
            },
            // Add other symbols with increased payouts
            {
                symbol: 2,
                name: "Ring",
                type: "high",
                payouts: [
                    { count: 8, multiplier: 4, description: "8-9 symbols" },
                    { count: 10, multiplier: 10, description: "10-11 symbols" },
                    { count: 12, multiplier: 30, description: "12+ symbols" },
                ],
            },
            {
                symbol: 3,
                name: "Goblet",
                type: "high",
                payouts: [
                    { count: 8, multiplier: 3, description: "8-9 symbols" },
                    { count: 10, multiplier: 4, description: "10-11 symbols" },
                    { count: 12, multiplier: 24, description: "12+ symbols" },
                ],
            },
            {
                symbol: 4,
                name: "Red Gem",
                type: "medium",
                payouts: [
                    { count: 8, multiplier: 2, description: "8-9 symbols" },
                    { count: 10, multiplier: 3, description: "10-11 symbols" },
                    { count: 12, multiplier: 20, description: "12+ symbols" },
                ],
            },
            {
                symbol: 5,
                name: "Purple Gem",
                type: "medium",
                payouts: [
                    { count: 8, multiplier: 1.6, description: "8-9 symbols" },
                    { count: 10, multiplier: 2.4, description: "10-11 symbols" },
                    { count: 12, multiplier: 16, description: "12+ symbols" },
                ],
            },
            {
                symbol: 6,
                name: "Yellow Gem",
                type: "low",
                payouts: [
                    { count: 8, multiplier: 1, description: "8-9 symbols" },
                    { count: 10, multiplier: 2, description: "10-11 symbols" },
                    { count: 12, multiplier: 10, description: "12+ symbols" },
                ],
            },
            {
                symbol: 7,
                name: "Green Gem",
                type: "low",
                payouts: [
                    { count: 8, multiplier: 0.8, description: "8-9 symbols" },
                    { count: 10, multiplier: 1.8, description: "10-11 symbols" },
                    { count: 12, multiplier: 8, description: "12+ symbols" },
                ],
            },
            {
                symbol: 8,
                name: "Blue Gem",
                type: "low",
                payouts: [
                    { count: 8, multiplier: 0.5, description: "8-9 symbols" },
                    { count: 10, multiplier: 1.5, description: "10-11 symbols" },
                    { count: 12, multiplier: 4, description: "12+ symbols" },
                ],
            },
        ],
        specialSymbols: {
            zeus: {
                symbol: 9,
                name: "Zeus Scatter",
                type: "scatter",
                description: "Triggers free spins with higher payouts",
                payouts: [
                    { count: 4, multiplier: 5, freeSpins: 15, description: "4 scatters (increased)" },
                    { count: 5, multiplier: 10, freeSpins: 20, description: "5 scatters (increased)" },
                    { count: 6, multiplier: 200, freeSpins: 25, description: "6+ scatters (doubled!)" },
                ],
            },
            multiplierOrb: {
                symbol: 10,
                name: "Multiplier Orb",
                type: "multiplier",
                description: "Higher multiplier values",
                valueRange: {
                    min: 3,
                    max: 50,
                },
            },
        },
        gameRules: {
            minSymbolWinCount: 8,
            description: "Minimum symbols required for any win",
            winDetection: "count-based",
            cascading: true,
            freeSpins: {
                triggeredBy: "zeus",
                retriggerRules: {
                    count: 3,
                    additionalSpins: 10,
                    description: "3+ Zeus during free spins awards 10 more spins",
                },
            },
        },
    };

    console.log("2. Custom PayoutCalculator with higher payouts:");
    const customCalculator = new PayoutCalculator(1, customRules);
    console.log(`- Game Type: ${customRules.gameType}`);
    console.log(`- Version: ${customRules.version}`);

    // Test with same board as before
    const testBoard = [
        0,
        0,
        0,
        0,
        0, // 5 crowns
        0,
        0,
        0,
        1,
        2, // 3 more crowns = 8 total
        3,
        4,
        5,
        6,
        7, // Other symbols
        8,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        1,
        2,
        3,
        4,
        5,
        6,
    ];

    const customResult = customCalculator.calculatePayout(testBoard, [], 1);
    console.log(`- Crown win with custom rules: ${customResult.totalWin}x bet\n`);

    return { customCalculator, customRules };
}

async function compareRulesExample() {
    console.log("=== Comparing Different Rule Sets ===\n");

    const testBoard = [
        0,
        0,
        0,
        0,
        0, // 5 crowns
        0,
        0,
        0,
        1,
        2, // 3 more crowns = 8 total
        3,
        4,
        5,
        6,
        7, // Other symbols
        8,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        1,
        2,
        3,
        4,
        5,
        6,
    ];

    // Test different configurations
    const configs = [
        { name: "Default Rules", calculator: new PayoutCalculator() },
        {
            name: "2x Multiplier",
            calculator: new PayoutCalculator(2), // Double base win multiplier
        },
    ];

    console.log("Board: 8 Crown symbols");
    for (const config of configs) {
        const result = config.calculator.calculatePayout(testBoard, [], 1);
        console.log(`- ${config.name}: ${result.totalWin}x bet`);
    }
    console.log();
}

async function saveAndLoadCustomRulesExample() {
    console.log("=== Save and Load Custom Rules ===\n");

    // Create a low-payout configuration for testing
    const lowPayoutRules: PayoutRulesConfig = {
        version: "1.0-low",
        gameType: "Low Payout Test Configuration",
        description: "Conservative payout rules for testing",
        symbolPayouts: [
            {
                symbol: 0,
                name: "Crown",
                type: "premium",
                payouts: [
                    { count: 8, multiplier: 5, description: "8-9 symbols (halved)" },
                    { count: 10, multiplier: 12.5, description: "10-11 symbols (halved)" },
                    { count: 12, multiplier: 25, description: "12+ symbols (halved)" },
                ],
            },
            {
                symbol: 1,
                name: "Hourglass",
                type: "high",
                payouts: [
                    { count: 8, multiplier: 0.75, description: "8-9 symbols (halved)" },
                    { count: 10, multiplier: 1, description: "10-11 symbols (halved)" },
                    { count: 12, multiplier: 6, description: "12+ symbols (halved)" },
                ],
            },
            // Simplified - just include premium symbols
            {
                symbol: 2,
                name: "Ring",
                type: "high",
                payouts: [
                    { count: 8, multiplier: 1, description: "8-9 symbols" },
                    { count: 10, multiplier: 2.5, description: "10-11 symbols" },
                    { count: 12, multiplier: 7.5, description: "12+ symbols" },
                ],
            },
            {
                symbol: 3,
                name: "Goblet",
                type: "high",
                payouts: [
                    { count: 8, multiplier: 0.75, description: "8-9 symbols" },
                    { count: 10, multiplier: 1, description: "10-11 symbols" },
                    { count: 12, multiplier: 6, description: "12+ symbols" },
                ],
            },
            {
                symbol: 4,
                name: "Red Gem",
                type: "medium",
                payouts: [
                    { count: 8, multiplier: 0.5, description: "8-9 symbols" },
                    { count: 10, multiplier: 0.75, description: "10-11 symbols" },
                    { count: 12, multiplier: 5, description: "12+ symbols" },
                ],
            },
            {
                symbol: 5,
                name: "Purple Gem",
                type: "medium",
                payouts: [
                    { count: 8, multiplier: 0.4, description: "8-9 symbols" },
                    { count: 10, multiplier: 0.6, description: "10-11 symbols" },
                    { count: 12, multiplier: 4, description: "12+ symbols" },
                ],
            },
            {
                symbol: 6,
                name: "Yellow Gem",
                type: "low",
                payouts: [
                    { count: 8, multiplier: 0.25, description: "8-9 symbols" },
                    { count: 10, multiplier: 0.5, description: "10-11 symbols" },
                    { count: 12, multiplier: 2.5, description: "12+ symbols" },
                ],
            },
            {
                symbol: 7,
                name: "Green Gem",
                type: "low",
                payouts: [
                    { count: 8, multiplier: 0.2, description: "8-9 symbols" },
                    { count: 10, multiplier: 0.45, description: "10-11 symbols" },
                    { count: 12, multiplier: 2, description: "12+ symbols" },
                ],
            },
            {
                symbol: 8,
                name: "Blue Gem",
                type: "low",
                payouts: [
                    { count: 8, multiplier: 0.125, description: "8-9 symbols" },
                    { count: 10, multiplier: 0.375, description: "10-11 symbols" },
                    { count: 12, multiplier: 1, description: "12+ symbols" },
                ],
            },
        ],
        specialSymbols: {
            zeus: {
                symbol: 9,
                name: "Zeus Scatter",
                type: "scatter",
                description: "Conservative free spins",
                payouts: [
                    { count: 4, multiplier: 2, freeSpins: 10, description: "4 scatters (reduced)" },
                    { count: 5, multiplier: 3, freeSpins: 12, description: "5 scatters (reduced)" },
                    { count: 6, multiplier: 50, freeSpins: 15, description: "6+ scatters (halved)" },
                ],
            },
            multiplierOrb: {
                symbol: 10,
                name: "Multiplier Orb",
                type: "multiplier",
                description: "Conservative multiplier values",
                valueRange: {
                    min: 2,
                    max: 10,
                },
            },
        },
        gameRules: {
            minSymbolWinCount: 8,
            description: "Minimum symbols required for any win",
            winDetection: "count-based",
            cascading: true,
            freeSpins: {
                triggeredBy: "zeus",
                retriggerRules: {
                    count: 3,
                    additionalSpins: 3,
                    description: "3+ Zeus during free spins awards 3 more spins",
                },
            },
        },
    };

    // Save to file
    const customRulesPath = path.join(__dirname, "../examples/low-payout-rules.json");
    fs.writeFileSync(customRulesPath, JSON.stringify(lowPayoutRules, null, 2));
    console.log(`3. Saved custom rules to: ${customRulesPath}`);

    // Load from file
    try {
        const loadedCalculator = PayoutCalculator.createWithCustomRules(customRulesPath);
        const loadedConfig = loadedCalculator.getRulesConfig();
        console.log(`- Loaded game type: ${loadedConfig.gameType}`);
        console.log(`- Loaded version: ${loadedConfig.version}`);

        // Test the loaded rules
        const testBoard = [
            0,
            0,
            0,
            0,
            0, // 5 crowns
            0,
            0,
            0,
            1,
            2, // 3 more crowns = 8 total
            3,
            4,
            5,
            6,
            7, // Other symbols
            8,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            1,
            2,
            3,
            4,
            5,
            6,
        ];

        const result = loadedCalculator.calculatePayout(testBoard, [], 1);
        console.log(`- Crown win with loaded rules: ${result.totalWin}x bet`);

        // Clean up
        fs.unlinkSync(customRulesPath);
        console.log("- Cleaned up temporary file\n");
    } catch (error) {
        console.error("Error loading custom rules:", error);
    }
}

async function predefinedChainWithCustomRulesExample() {
    console.log("=== Predefined Chain with Custom Rules ===\n");

    // Create a custom PayoutCalculator with 1.5x multiplier
    const customCalculator = new PayoutCalculator(1.5);

    console.log("4. Generating demo chain with 1.5x payout multiplier...");

    // Note: To use custom rules in predefined generator, you'd need to modify
    // the PredefinedResultGenerator to accept a custom PayoutCalculator
    // For now, we'll just show how the custom calculator works

    const testBoard = [
        0,
        0,
        0,
        0,
        0, // 5 crowns
        0,
        0,
        0,
        1,
        2, // 3 more crowns = 8 total
        3,
        4,
        5,
        6,
        7, // Other symbols
        8,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        1,
        2,
        3,
        4,
        5,
        6,
    ];

    const result = customCalculator.calculatePayout(testBoard, [], 1);
    console.log(`- Crown win with 1.5x multiplier: ${result.totalWin}x bet`);
    console.log("- This would result in higher RTP for predefined chains\n");
}

async function runAllCustomRulesExamples() {
    try {
        console.log("🎰 Custom Payout Rules Examples\n");
        console.log("This demonstrates how to customize payout rules for different game variants.\n");

        // Run all examples
        const { defaultCalculator } = await basicCustomRulesExample();
        const { customCalculator } = await customRulesFromScratchExample();
        await compareRulesExample();
        await saveAndLoadCustomRulesExample();
        await predefinedChainWithCustomRulesExample();

        console.log("✅ All custom payout rules examples completed!");

        console.log("\n📊 Summary:");
        console.log("- Default rules loaded from JSON file");
        console.log("- Custom rules can be created programmatically");
        console.log("- Rules can be saved/loaded from files");
        console.log("- Multiple rule sets can be compared");
        console.log("- Custom multipliers can adjust overall RTP");
    } catch (error) {
        console.error("❌ Error running custom rules examples:", error);
    }
}

// Run examples if this file is executed directly
if (require.main === module) {
    runAllCustomRulesExamples();
}

export {
    basicCustomRulesExample,
    customRulesFromScratchExample,
    compareRulesExample,
    saveAndLoadCustomRulesExample,
    predefinedChainWithCustomRulesExample,
    runAllCustomRulesExamples,
};
