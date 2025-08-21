/**
 * Example: How to use the Predefined Results System
 *
 * This example demonstrates how to generate a chain of 100-150 boards
 * with a target RTP of 97% for cascading slot games.
 */

import { generatePredefinedChain, generateDemoChain, createPredefinedGenerator, Difficulty } from "../src/index";

async function basicExample() {
    console.log("=== Basic Predefined Results Example ===\n");

    // Generate a demo chain (small, for quick testing)
    console.log("Generating demo chain (10 boards)...");
    const demoChain = await generateDemoChain();

    console.log(`Demo Results:`);
    console.log(`- Boards generated: ${demoChain.boards.length}`);
    console.log(`- Target RTP: ${(demoChain.config.targetRTP * 100).toFixed(1)}%`);
    console.log(`- Actual RTP: ${(demoChain.rtpResult.actualRTP * 100).toFixed(2)}%`);
    console.log(`- Total bets: ${demoChain.rtpResult.totalBets} coins`);
    console.log(`- Total wins: ${demoChain.rtpResult.totalWins.toFixed(2)} coins`);
    console.log(`- Hit frequency: ${(demoChain.rtpResult.hitFrequency * 100).toFixed(1)}%`);
    console.log(`- Generation time: ${demoChain.generationStats.duration}ms`);
    console.log(`- Attempts needed: ${demoChain.generationStats.attempts}\n`);

    return demoChain;
}

async function customConfigExample() {
    console.log("=== Custom Configuration Example ===\n");

    // Generate a chain with custom settings
    console.log("Generating custom chain (120 boards, 97% RTP)...");
    const customChain = await generatePredefinedChain({
        boardCount: 120,
        targetRTP: 0.97,
        betSize: 1,
        playerBudget: 100,
        difficulty: Difficulty.Medium,
        maxRetries: 10,
        tolerance: 0.01, // ±1%
    });

    console.log(`Custom Results:`);
    console.log(`- Boards generated: ${customChain.boards.length}`);
    console.log(`- Target RTP: ${(customChain.config.targetRTP * 100).toFixed(1)}%`);
    console.log(`- Actual RTP: ${(customChain.rtpResult.actualRTP * 100).toFixed(2)}%`);
    console.log(`- Meets target: ${customChain.rtpResult.meetsTarget ? "YES" : "NO"}`);
    console.log(`- Total bets: ${customChain.rtpResult.totalBets} coins`);
    console.log(`- Total wins: ${customChain.rtpResult.totalWins.toFixed(2)} coins`);
    console.log(`- Hit frequency: ${(customChain.rtpResult.hitFrequency * 100).toFixed(1)}%`);
    console.log(`- Average win: ${customChain.generationStats.averageWin.toFixed(3)} coins`);
    console.log(`- Max win: ${customChain.generationStats.maxWin.toFixed(2)} coins`);
    console.log(`- Generation time: ${customChain.generationStats.duration}ms`);
    console.log(`- Attempts needed: ${customChain.generationStats.attempts}\n`);

    return customChain;
}

async function analyzeIndividualBoards(chain: any) {
    console.log("=== Individual Board Analysis ===\n");

    console.log("First 5 boards breakdown:");
    for (let i = 0; i < Math.min(5, chain.boards.length); i++) {
        const board = chain.boards[i];
        console.log(`Board ${i + 1}:`);
        console.log(`  - Total win: ${board.totalCascadeWin.toFixed(3)} coins`);
        console.log(`  - Cascade count: ${board.cascadeCount}`);
        console.log(`  - Win clusters: ${board.payoutResult.winClusters.length}`);

        if (board.payoutResult.winClusters.length > 0) {
            board.payoutResult.winClusters.forEach((cluster: any, idx: number) => {
                console.log(`    Cluster ${idx + 1}: ${cluster.count}x symbol ${cluster.symbol} = ${cluster.multipliedWin.toFixed(3)} coins`);
            });
        }
        console.log();
    }
}

async function exportAndImportExample(chain: any) {
    console.log("=== Export/Import Example ===\n");

    const { generator } = createPredefinedGenerator();

    // Export chain to JSON
    console.log("Exporting chain to JSON...");
    const jsonData = generator.exportChainToJSON(chain);
    console.log(`JSON data size: ${jsonData.length} characters`);

    // Import chain from JSON
    console.log("Importing chain from JSON...");
    const importedChain = generator.loadChainFromJSON(jsonData);
    console.log(`Imported ${importedChain.boards.length} boards`);
    console.log(`Original RTP: ${(chain.rtpResult.actualRTP * 100).toFixed(2)}%`);
    console.log(`Imported RTP: ${(importedChain.rtpResult.actualRTP * 100).toFixed(2)}%`);
    console.log("Export/Import successful!\n");

    return jsonData;
}

async function simulateGameplay(chain: any) {
    console.log("=== Simulated Gameplay ===\n");

    const initialCoins = chain.config.playerBudget;
    let currentCoins = initialCoins;
    let round = 1;

    console.log(`Starting with ${initialCoins} coins`);
    console.log(`Bet per round: ${chain.config.betSize} coin(s)`);
    console.log(`Playing ${chain.boards.length} rounds...\n`);

    for (const board of chain.boards) {
        // Place bet
        currentCoins -= chain.config.betSize;

        // Add winnings
        currentCoins += board.totalCascadeWin;

        if (round <= 10 || round % 20 === 0) {
            console.log(
                `Round ${round}: Bet ${chain.config.betSize}, Won ${board.totalCascadeWin.toFixed(2)}, Balance: ${currentCoins.toFixed(2)} coins`
            );
        }

        round++;
    }

    console.log(`\nFinal Results:`);
    console.log(`- Started with: ${initialCoins} coins`);
    console.log(`- Ended with: ${currentCoins.toFixed(2)} coins`);
    console.log(`- Net result: ${(currentCoins - initialCoins).toFixed(2)} coins`);
    console.log(
        `- Actual RTP: ${(
            ((currentCoins + chain.boards.length * chain.config.betSize - initialCoins) / (chain.boards.length * chain.config.betSize)) *
            100
        ).toFixed(2)}%`
    );
}

async function runAllExamples() {
    try {
        console.log("🎰 Slot Board Generator - Predefined Results Demo\n");
        console.log("This demo shows how to generate board chains with specific RTP targets.\n");

        // Run basic example
        const demoChain = await basicExample();

        // Run custom configuration example
        const customChain = await customConfigExample();

        // Analyze individual boards
        await analyzeIndividualBoards(demoChain);

        // Export/Import example
        const jsonData = await exportAndImportExample(demoChain);

        // Simulate actual gameplay
        await simulateGameplay(demoChain);

        console.log("✅ All examples completed successfully!");
        console.log("\n📁 You can save the JSON data to use in your game:");
        console.log("const gameData = " + jsonData.substring(0, 100) + "...");
    } catch (error) {
        console.error("❌ Error running examples:", error);
    }
}

// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples();
}

export { basicExample, customConfigExample, analyzeIndividualBoards, exportAndImportExample, simulateGameplay, runAllExamples };
