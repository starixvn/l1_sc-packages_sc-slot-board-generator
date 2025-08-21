import { BoardGenerator } from "./board-generator";
import { Difficulty } from "./difficulties";
import {
    PayoutCalculator,
    PayoutRule,
    SymbolWin,
    ScatterWin,
    PayoutResult,
    PayoutRulesConfig,
    SymbolPayoutConfig,
    ScatterPayoutConfig,
    MultiplierOrbConfig,
    PayoutTier,
} from "./payout-calculator";
import { RTPController, RTPConfiguration, RTPResult, BoardResult, WinDistribution } from "./rtp-controller";
import { PredefinedResultGenerator, PredefinedChainConfig, PredefinedChain, CascadeSequence } from "./predefined-result-generator";
import defaultDefinition from "./default-definition";

// Core board generation
export { BoardGenerator, Difficulty };

// Payout system
export {
    PayoutCalculator,
    PayoutRule,
    SymbolWin,
    ScatterWin,
    PayoutResult,
    PayoutRulesConfig,
    SymbolPayoutConfig,
    ScatterPayoutConfig,
    MultiplierOrbConfig,
    PayoutTier,
};

// RTP management
export { RTPController, RTPConfiguration, RTPResult, BoardResult, WinDistribution };

// Predefined results
export { PredefinedResultGenerator, PredefinedChainConfig, PredefinedChain, CascadeSequence };

/**
 * Convenience factory function to create a predefined result generator
 * with default settings
 */
export function createPredefinedGenerator(config?: Partial<PredefinedChainConfig>) {
    const generator = new PredefinedResultGenerator(defaultDefinition.boardSettings, defaultDefinition.multiplier, Difficulty.Medium);

    return {
        generator,
        config: {
            boardCount: 120,
            targetRTP: 0.97,
            betSize: 1,
            playerBudget: 100,
            difficulty: Difficulty.Medium,
            maxRetries: 10,
            tolerance: 0.01,
            ...config,
        } as PredefinedChainConfig,
    };
}

/**
 * Quick function to generate a predefined chain with default settings
 */
export async function generatePredefinedChain(config?: Partial<PredefinedChainConfig>): Promise<PredefinedChain> {
    const { generator, config: finalConfig } = createPredefinedGenerator(config);
    return generator.generateChain(finalConfig);
}

/**
 * Demo function that generates a small chain for testing
 */
export async function generateDemoChain(): Promise<PredefinedChain> {
    const { generator } = createPredefinedGenerator();
    return generator.generateDemoChain();
}
