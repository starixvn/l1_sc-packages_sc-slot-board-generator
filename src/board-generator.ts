import {
    both,
    clone,
    complement,
    concat,
    count,
    equals,
    flatten,
    head,
    includes,
    isNil,
    last,
    map,
    pipe,
    reject,
    repeat,
    splitAt,
    splitEvery,
    tail,
    __,
} from "ramda";

import defaultDefinition from "./default-definition";
import { Difficulty } from "./difficulties";
import MultiplierGenerator from "./multiplier-generator";
import Reel from "./reel";
import SymbolsGenerator from "./symbols-generator";
import { replace, replaceEach } from "./utils";

export interface IBoard {
    newBoard: number[];
    explodedSymbols?: number[];
    newSymbols?: number[];
    multipliers: number[];
}

export default class BoardGenerator {
    public readonly NoSymbol: number = -1;
    private difficulty: Difficulty;
    private readonly definition: any;
    private readonly multiplierGenerator: MultiplierGenerator;
    private refillSymbols: number[];
    private refillMultipliers: number[];

    constructor(boardDefinition: any = null) {
        this.definition = boardDefinition ?? defaultDefinition;
        this.difficulty = Difficulty.Medium;

        this.multiplierGenerator = new MultiplierGenerator(
            this.definition.multiplier.symbol,
            this.definition.multiplier.min,
            this.definition.multiplier.max
        );
    }

    setDifficulty(difficulty: Difficulty): void {
        this.difficulty = difficulty;
    }

    getDifficulty(): Difficulty {
        return this.difficulty;
    }

    generate(): IBoard {
        const generator = this.getSymbolGenerator();
        const board = generator.randomSymbols(this.definition.reels * this.definition.symbolsOnReel);

        return {
            newBoard: board,
            multipliers: this.multiplierGenerator.generate(board),
        };
    }

    explodeAndRefill(board: number[], winSymbols: number[], oldMultipliers: number[]): IBoard {
        const isWinningSymbol = includes(__, winSymbols);
        const isNoSymbol = equals(Reel.NoSymbol);
        const specialSymbol = -2;
        const isSpecialSymbol = equals(specialSymbol);

        const numberOfSymbols = count(isWinningSymbol, board);
        const newSymbols = this.getRefillSymbols(numberOfSymbols);

        const exploded = replace(complement(isWinningSymbol), Reel.NoSymbol, board);
        const remained = replace(isWinningSymbol, Reel.NoSymbol, board);
        const collapsed = this.collapse(remained);
        const filled = pipe(
            replace(complement(isNoSymbol), specialSymbol),
            replaceEach(isNoSymbol, newSymbols),
            replace(isSpecialSymbol, Reel.NoSymbol)
        )(collapsed);

        const oldMultiplierValueBoard = this.convertToMultiplierValueBoard(collapsed, oldMultipliers);

        const newMultipliers = this.multiplierGenerator.generate(newSymbols);
        const newMultiplierValueBoard = this.convertToMultiplierValueBoard(newSymbols, newMultipliers);

        const mergedMultiplierValueBoard = replaceEach(isNoSymbol, newMultiplierValueBoard, oldMultiplierValueBoard);
        const multipliers = reject(isSpecialSymbol, mergedMultiplierValueBoard);

        const newBoard = replaceEach(isNoSymbol, newSymbols, collapsed);

        return {
            newBoard: newBoard,
            explodedSymbols: exploded,
            newSymbols: filled as any as number[],
            multipliers: multipliers as number[],
        };
    }

    getSymbolGenerator(): SymbolsGenerator {
        return new SymbolsGenerator(this.definition.numberOfSymbolsByDifficulty[this.difficulty], this.definition.numberOfShuffles);
    }

    collapse(board: number[]): number[] {
        const symbolsOnReel = this.definition.symbolsOnReel;
        const emptyReel = repeat(Reel.NoSymbol, symbolsOnReel);

        const getReels = splitEvery(symbolsOnReel);
        const removeNoSymbolInList = reject(equals(Reel.NoSymbol)) as (a: any[]) => any;
        const prependNoSymbolToList = concat(emptyReel) as (a: any[]) => any;
        const splitSymbols = (list: number[]) => splitAt(list.length - symbolsOnReel, list);
        const collapseReel = pipe(removeNoSymbolInList, prependNoSymbolToList, splitSymbols, last);
        const collapseBoard = pipe(getReels, map(collapseReel), flatten) as <T>(a: T[]) => T[];

        return collapseBoard(board);
    }

    convertToMultiplierValueBoard(board: number[], multiplierValues: number[]): number[] {
        const isMultiplierSymbol = equals(defaultDefinition.multiplier.symbol);
        const isNoSymbol = equals(Reel.NoSymbol);

        const specialSymbol = -2;

        return pipe(
            replace(both(complement(isMultiplierSymbol), complement(isNoSymbol)), specialSymbol),
            replaceEach(isMultiplierSymbol, multiplierValues)
        )(board) as any as number[];
    }

    setRefillSymbols(symbols: number[], multipliers: number[]) {
        !isNil(symbols) && (this.refillSymbols = symbols);
        !isNil(multipliers) && (this.refillMultipliers = symbols);
    }

    getRefillSymbols(size: number): number[] {
        if (isNil(this.refillSymbols)) {
            return this.getSymbolGenerator().randomSymbols(size);
        } else {
            const symbols = clone(this.refillSymbols);

            this.refillSymbols = [];

            return symbols;
        }
    }
}
