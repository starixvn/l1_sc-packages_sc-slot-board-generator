import { Chance } from "chance";
import { filter, flatten, map, max, pipe, range, repeat } from "ramda";
import { isMultiplierSymbol } from "./board-helper";

export default class MultiplierGenerator {
    private readonly chance: Chance.Chance;

    private min: number;
    private max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;

        this.chance = new Chance();
    }

    protected generateSetOfValues(min: number, max: number): number[] {
        const repeatValue = (value: number) => repeat(value, max - value + min);
        const generateSetOfValues = pipe<number[], number[], number[][], number[]>(range, map(repeatValue), flatten);

        return generateSetOfValues(min, max + 1);
    }

    randomValue(multipliers: number) {
        const maximumValue = max(Math.round(this.max / max(multipliers, 1)), this.min);
        const values = this.generateSetOfValues(this.min, maximumValue);
        const value = this.chance.pickone(values);

        return max(value, this.min);
    }

    generate(board: number[], numberOfMultipliers = 0): number[] {
        const getMultiplierSymbols = filter<number>(isMultiplierSymbol);
        const getRandomValue = () => this.randomValue(numberOfMultipliers);

        return pipe(getMultiplierSymbols, map(getRandomValue))(board);
    }

    update(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
}
