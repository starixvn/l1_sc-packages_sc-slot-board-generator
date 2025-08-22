import { Chance } from "chance";
import { filter, map } from "ramda";
import { isMultiplierSymbol } from "./board-helper";
import { Volatility } from "./volatility";

export interface MultiplierConfig {
    min: number;
    max: number;
}

export class MultiplierGenerator {
    private readonly chance: Chance.Chance;
    private readonly config: MultiplierConfig;
    private readonly multiplierWeights = {
        2: 0.24,
        3: 0.2,
        4: 0.15,
        5: 0.1,
        6: 0.08,
        8: 0.06,
        10: 0.05,
        12: 0.03,
        15: 0.02,
        20: 0.02,
        25: 0.01,
        50: 0.005,
        100: 0.003,
        250: 0.001,
        500: 0.0005,
    };

    constructor(config: MultiplierConfig, definition: any, volatility: Volatility) {
        this.config = config;
        this.multiplierWeights = definition[volatility].multiplierWeights;
        this.chance = new Chance();
    }

    randomValue(): number {
        const validMultipliers = Object.keys(this.multiplierWeights).filter((key) => +key >= this.config.min && +key <= this.config.max);

        return +this.chance.weighted(
            validMultipliers,
            validMultipliers.map((key) => this.multiplierWeights[key])
        );
    }

    generate(board: number[]): number[] {
        const randomValue = this.randomValue.bind(this);

        return map(randomValue, filter<number>(isMultiplierSymbol)(board));
    }

    update(min: number, max: number) {
        this.config.min = min;
        this.config.max = max;
    }

    getConfig(): MultiplierConfig {
        return this.config;
    }
}
