import { Chance } from "chance";

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

    randomValue() {
        return this.chance.integer({ min: this.min, max: this.max });
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
