import { Chance } from "chance";
import { concat, reduce, repeat } from "ramda";
import { shuffleN } from "./utils";

export interface SymbolPayout {
    from: number;
    to: number;
    odds: number;
}

export interface Symbol {
    symbol: number;
    payout: SymbolPayout[];
}

export default class SymbolsGenerator {
    public static readonly DefaultNormalSymbols: number = 1000;
    public static readonly TotalItemPerReel: number = 200;

    private readonly chance: Chance.Chance;

    private readonly symbolWeights: Record<number, number> = {
        0: 0.17,
        1: 0.15,
        2: 0.147,
        3: 0.123,
        4: 0.11,
        5: 0.09,
        6: 0.07,
        7: 0.06,
        8: 0.05,
        9: 0.02,
        10: 0.01,
    };

    constructor(symbolWeights: Record<number, number>) {
        this.chance = new Chance();
        this.symbolWeights = symbolWeights;
    }

    randomSymbols(size: number): number[] {
        return new Array(size).fill(0).map(() => parseInt(this.chance.weighted(Object.keys(this.symbolWeights), Object.values(this.symbolWeights))));
    }
}
