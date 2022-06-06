import { Chance } from "chance";
import { max, range, repeat } from "ramda";

export default class MultiplierGenerator {
    private readonly chance: Chance.Chance;
    private readonly multiplierSymbol: number;

    private min: number;
    private max: number;

    constructor(multiplierSymbol: number, min: number, max: number) {
        this.multiplierSymbol = multiplierSymbol;
        this.min = min;
        this.max = max;

        this.chance = new Chance();
    }

    randomValue(multipliers: number) {
        const maximumValue = max(Math.round(this.max / max(multipliers, 1)), this.min);
        const values = range(this.min, maximumValue).flatMap((value) => repeat(value, maximumValue - value + this.min));
        const value = this.chance.pickone(values);

        return Math.max(value, this.min);
    }

    generate(board: number[], oldMultipliers: number[] = []): number[] {
        const multipliers: number[] = [];

        board.forEach((symbol) => {
            if (symbol === this.multiplierSymbol) {
                multipliers.push(this.randomValue(oldMultipliers.length));
            }
        });

        return multipliers;
    }

    update(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
}
