import { Chance } from "chance";

import * as defaultDefinition from "./default-definition";
import { Difficulty } from "./difficulties";
import MultiplierGenerator from "./multiplier-generator";
import Reel from "./reel";

interface IBoard {
    newBoard: number[];
    explodedSymbols?: number[];
    newSymbols?: number[];
    multipliers: number[];
}

export default class BoardGenerator {
    public readonly NoSymbol: number = -1;
    private difficulty: Difficulty;
    private readonly definition: any;
    private readonly chance: Chance.Chance;
    private readonly multiplierGenerator: MultiplierGenerator;

    constructor(boardDefinition: any) {
        this.definition = boardDefinition ?? defaultDefinition;
        this.difficulty = Difficulty.Medium;
        this.chance = new Chance();

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
        const board = [];

        for (let index = 0; index < this.definition.reels; index++) {
            const reel = new Reel(this.definition.symbolsOnReel);
            reel.shuffle();

            board.push(...reel.get());
        }

        return {
            newBoard: board,
            multipliers: this.multiplierGenerator.generate(board),
        };
    }

    explodeAndRefill(board: number[], winSymbols: number[]): IBoard {
        const newBoard = [];
        const exploded = [];
        const filled = [];
        const formattedBoard = this.formatBoard(board, this.definition.symbolsOnReel);

        for (const reel of formattedBoard) {
            const reelOfSymbols = new Reel(this.definition.symbolsOnReel, reel).explode(winSymbols).collapse().refill();

            newBoard.push(...reelOfSymbols.get());
            exploded.push(...reelOfSymbols.getExplodedItems());
            filled.push(...reelOfSymbols.getFilledItems());
        }

        return {
            newBoard: newBoard,
            explodedSymbols: exploded,
            newSymbols: filled,
            multipliers: this.multiplierGenerator.generate(newBoard),
        };
    }

    formatBoard(board: number[], symbolsOnReel: number): number[][] {
        const newBoard = [];
        const totalReels = board.length / symbolsOnReel;

        for (let i = 0; i < totalReels; i++) {
            const reel = [];
            for (let j = 0; j < symbolsOnReel; j++) {
                reel.push(board[i * symbolsOnReel + j]);
            }

            newBoard.push(reel);
        }

        return newBoard;
    }
}
