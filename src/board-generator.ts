import { Chance } from "chance";

import * as defaultDefinition from "./default-definition";
import { Difficulty } from "./difficulties";

export default class BoardGenerator {
    public readonly NoSymbol: number = -1;
    private difficulty: Difficulty;
    private readonly definition: any;
    private readonly chance: Chance.Chance;

    constructor(boardDefinition: any) {
        this.definition = boardDefinition ?? defaultDefinition;
        this.difficulty = Difficulty.Medium;
        this.chance = new Chance();
    }

    updateDifficulty(difficulty: Difficulty): void {
        this.difficulty = difficulty;
    }

    generate(): number[][] {
        const board = [];

        for (let reel = 0; reel < this.definition.reels; reel++) {
            const reelSymbols = [];
            for (let index = 0; index < this.definition.symbolsOnReel; index++) {
                reelSymbols.push(this.randomSymbol());
            }

            board.push(this.shuffleReel(reelSymbols));
        }

        return board;
    }

    explodeAndRefill(board: number[][], winSymbols: number[]): number[][] {
        const newBoard = [];

        for (const reel of board) {
            const explodedReel = this.explodeReel(reel, winSymbols);
            const collapse = this.collapseReel(explodedReel);
            newBoard.push(this.refillReel(collapse));
        }

        return newBoard;
    }

    randomSymbol() {
        return this.chance.integer({ min: 0, max: this.definition.numberOfSymbols - this.definition.specialSymbols.length - 1 });
    }

    shuffleReel(reel: number[]): number[] {
        let shuffledReel = reel;

        for (let index = 0; index < this.definition.numberOfShuffles; index++) {
            shuffledReel = this.chance.shuffle(shuffledReel);
        }

        return shuffledReel;
    }

    explodeReel(reel: number[], winSymbols: number[] = []): number[] {
        winSymbols.forEach((winSymbol) => {
            reel = reel.map((symbol) => (symbol === winSymbol ? this.NoSymbol : symbol));
        });

        return reel;
    }

    collapseReel(reel: number[]): number[] {
        const symbols = reel.filter((sym) => sym !== this.NoSymbol);
        const totalCollapsedItems = reel.length - symbols.length;

        if (totalCollapsedItems === 0) {
            return reel;
        }

        const newReel = [];
        for (let index = 0; index < reel.length; index++) {
            const symbol = index < totalCollapsedItems ? this.NoSymbol : symbols[index - totalCollapsedItems];
            newReel.push(symbol);
        }

        return newReel;
    }

    refillReel(reel: number[]): number[] {
        return reel.map((symbol) => (symbol === this.NoSymbol ? this.randomSymbol() : symbol));
    }
}
