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

            board.push(this.shuffle(reelSymbols));
        }

        return board;
    }

    shuffle(reel) {
        let shuffledReel = reel;

        for (let index = 0; index < this.definition.numberOfShuffles; index++) {
            shuffledReel = this.chance.shuffle(shuffledReel);
        }

        return shuffledReel;
    }

    randomSymbol() {
        return this.chance.integer({ min: 0, max: this.definition.numberOfSymbols - this.definition.specialSymbols.length - 1 });
    }

    explode(reel, winSymbols = []) {
        winSymbols.forEach((winSymbol) => {
            reel = reel.map((symbol) => (symbol === winSymbol ? this.NoSymbol : symbol));
        });

        return reel;
    }

    collapse(reel) {
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

    refill(reel) {
        return reel.map((symbol) => (symbol === this.NoSymbol ? this.randomSymbol() : symbol));
    }
}
