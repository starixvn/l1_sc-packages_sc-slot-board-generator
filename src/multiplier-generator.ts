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
    private readonly multiplierWeights = {};

    constructor(config: MultiplierConfig, definition: any, volatility: Volatility, isFreeSpin: boolean) {
        this.config = config;
        this.multiplierWeights = isFreeSpin ? definition[volatility].freeSpin.multiplierWeights : definition[volatility].normalSpin.multiplierWeights;
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
