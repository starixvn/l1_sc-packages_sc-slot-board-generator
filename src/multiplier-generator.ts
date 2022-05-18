import { Chance } from "chance";
import { max, range, repeat } from "ramda";

export default class MultiplierGenerator {
    private readonly chance: Chance.Chance;
    private readonly min: number;
    private readonly max: number;
    private readonly multiplierSymbol: number;

    constructor(multiplierSymbol: number, min: number, max: number) {
        this.multiplierSymbol = multiplierSymbol;
        this.min = min;
        this.max = max;

        this.chance = new Chance();
    }

    randomValue(multipliers: number) {
        const maximumValue = max(Math.round(this.max / (multipliers + this.min)), this.min);
        const values = range(this.min, maximumValue).flatMap((value) => repeat(value, maximumValue - value + this.min));

        return this.chance.pickone(values);
    }

    generate(board: number[], oldMultipliers: number[] = []): number[] {
        const multipliers: number[] = [];

        board.forEach((symbol) => {
            if (symbol === this.multiplierSymbol) {
                multipliers.push(this.randomValue(oldMultipliers?.length || 0));
            }
        });

        return multipliers;
    }
}
