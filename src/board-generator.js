import Chance from "chance";

import defaultDefinition from "./default-definition";
import difficulties from "./difficulties";

export default class BoardGenerator {
    NoSymbol = -1;

    constructor(boardDefinition) {
        this.chance = new Chance();
        this.definition = boardDefinition ?? defaultDefinition;
        this.difficulty = difficulties.medium;
    }

    updateDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    generate() {
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

    randomSymbol() {
        return this.chance.integer({ min: 0, max: this.definition.numberOfSymbols - this.definition.specialSymbols.length - 1 });
    }

    explodeAndRefill(board, winSymbols = []) {
        const newBoard = [];

        for (let i = 0; i < board.length; i++) {
            const reel = this.explodeReel(board[i], winSymbols);
            const collapse = this.collapseReel(reel);
            newBoard.push(this.refillReel(collapse));
        }

        return newBoard;
    }

    shuffleReel(reel) {
        let shuffledReel = reel;

        for (let index = 0; index < this.definition.numberOfShuffles; index++) {
            shuffledReel = this.chance.shuffle(shuffledReel);
        }

        return shuffledReel;
    }

    explodeReel(reel, winSymbols = []) {
        winSymbols.forEach((winSymbol) => {
            reel = reel.map((symbol) => (symbol === winSymbol ? this.NoSymbol : symbol));
        });

        return reel;
    }

    collapseReel(reel) {
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

    refillReel(reel) {
        return reel.map((symbol) => (symbol === this.NoSymbol ? this.randomSymbol() : symbol));
    }
}
