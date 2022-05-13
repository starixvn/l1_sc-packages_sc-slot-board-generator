import { Chance } from "chance";
import { range, repeat } from "ramda";

export default class MultiplierGenerator {
    private readonly chance: Chance.Chance;
    private readonly min: number;
    private readonly max: number;
    private readonly multiplierSymbol: number;
    private readonly values: number[];

    constructor(multiplierSymbol: number, min: number, max: number) {
        this.multiplierSymbol = multiplierSymbol;
        this.min = min;
        this.max = max;

        this.chance = new Chance();

        this.values = range(this.min, this.max).flatMap((value) => repeat(value, this.max - value + this.min));
    }

    randomValue() {
        return this.chance.pickone(this.values);
    }

    generate(board: number[]): number[] {
        const multipliers: number[] = [];

        board.forEach((symbol) => {
            if (symbol === this.multiplierSymbol) {
                multipliers.push(this.randomValue());
            }
        });

        return multipliers;
    }
}
