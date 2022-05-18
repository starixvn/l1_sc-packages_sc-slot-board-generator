import {
    both,
    clone,
    complement,
    concat,
    count,
    equals,
    flatten,
    includes,
    isEmpty,
    isNil,
    last,
    map,
    pipe,
    reject,
    repeat,
    splitAt,
    splitEvery,
    __,
} from "ramda";

import defaultDefinition from "./default-definition";
import boardDefinition from "./board-definition";
import { Difficulty } from "./difficulties";
import MultiplierGenerator from "./multiplier-generator";
import SymbolsGenerator from "./symbols-generator";
import { replace, replaceEach } from "./utils";

export interface IBoard {
    newBoard: number[];
    explodedSymbols?: number[];
    newSymbols?: number[];
    multipliers: number[];
}

export interface BoardSettings {
    reels: number;
    symbolsOnReel: number;
    numberOfSymbols: number;
    numberOfShuffles: number;
}

export interface MultiplierConfig {
    symbol: number;
    min: number;
    max: number;
}

export class BoardGenerator {
    public readonly NoSymbol: number = -1;
    public readonly SpecialSymbol: number = -2;
    private readonly settings: BoardSettings;
    private readonly definition: any;
    private readonly multiplierGenerator: MultiplierGenerator;

    private difficulty: Difficulty;

    private refillSymbols: number[];
    private refillMultipliers: number[];

    constructor(settings: BoardSettings, multiplierConfig: MultiplierConfig, definition: any = null) {
        this.definition = definition ?? boardDefinition;
        this.difficulty = Difficulty.Medium;
        this.settings = settings;

        this.multiplierGenerator = new MultiplierGenerator(multiplierConfig.symbol, multiplierConfig.min, multiplierConfig.max);
    }

    setDifficulty(difficulty: Difficulty): void {
        this.difficulty = difficulty;
    }

    getDifficulty(): Difficulty {
        return this.difficulty;
    }

    updateMultiplierConfig(min: number, max: number): void {
        this.multiplierGenerator.update(min, max);
    }

    generate(): IBoard {
        const generator = this.getSymbolGenerator();
        const board = generator.randomSymbols(this.settings.reels * this.settings.symbolsOnReel);

        return {
            newBoard: board,
            multipliers: this.multiplierGenerator.generate(board),
        };
    }

    explodeAndRefill(board: number[], winSymbols: number[], oldMultipliers: number[]): IBoard {
        const isWinningSymbol = includes(__, winSymbols);
        const isNoSymbol = equals(this.NoSymbol);
        const isSpecialSymbol = equals(this.SpecialSymbol);

        const numberOfSymbols = count(isWinningSymbol, board);
        const newSymbols = this.getRefillSymbols(numberOfSymbols);

        const exploded = replace(complement(isWinningSymbol), this.NoSymbol, board);
        const remained = replace(isWinningSymbol, this.NoSymbol, board);
        const collapsed = this.collapse(remained);
        const filled = pipe(
            replace(complement(isNoSymbol), this.SpecialSymbol),
            replaceEach(isNoSymbol, newSymbols),
            replace(isSpecialSymbol, this.NoSymbol)
        )(collapsed);

        const oldMultiplierValueBoard = this.convertToMultiplierValueBoard(collapsed, oldMultipliers);

        const newMultipliers = this.getMultiplierValues(newSymbols, oldMultipliers);
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
        return new SymbolsGenerator(this.definition.mode[this.difficulty], this.settings.numberOfShuffles);
    }

    collapse(board: number[]): number[] {
        const symbolsOnReel = this.settings.symbolsOnReel;
        const emptyReel = repeat(this.NoSymbol, symbolsOnReel);

        const getReels = splitEvery(symbolsOnReel);
        const removeNoSymbolInList = reject(equals(this.NoSymbol)) as (a: any[]) => any;
        const prependNoSymbolToList = concat(emptyReel) as (a: any[]) => any;
        const splitSymbols = (list: number[]) => splitAt(list.length - symbolsOnReel, list);
        const collapseReel = pipe(removeNoSymbolInList, prependNoSymbolToList, splitSymbols, last);
        const collapseBoard = pipe(getReels, map(collapseReel), flatten) as <T>(a: T[]) => T[];

        return collapseBoard(board);
    }

    convertToMultiplierValueBoard(board: number[], multiplierValues: number[]): number[] {
        const isMultiplierSymbol = equals(defaultDefinition.multiplier.symbol);
        const isNoSymbol = equals(this.NoSymbol);

        return pipe(
            replace(both(complement(isMultiplierSymbol), complement(isNoSymbol)), this.SpecialSymbol),
            replaceEach(isMultiplierSymbol, multiplierValues)
        )(board) as any as number[];
    }

    setRefillSymbols(symbols: number[], multipliers: number[]) {
        !isEmpty(symbols) && (this.refillSymbols = symbols);
        !isEmpty(multipliers) && (this.refillMultipliers = multipliers);
    }

    getMultiplierValues(board: number[], oldMultipliers: number[]) {
        if (isNil(this.refillMultipliers) || isEmpty(this.refillMultipliers)) {
            return this.multiplierGenerator.generate(board, oldMultipliers);
        } else {
            const multipliers = clone(this.refillMultipliers);

            this.refillMultipliers = [];

            return multipliers;
        }
    }

    getRefillSymbols(size: number): number[] {
        if (isNil(this.refillSymbols) || isEmpty(this.refillSymbols)) {
            return this.getSymbolGenerator().randomSymbols(size);
        } else {
            const symbols = clone(this.refillSymbols);

            this.refillSymbols = [];

            return symbols;
        }
    }
}
