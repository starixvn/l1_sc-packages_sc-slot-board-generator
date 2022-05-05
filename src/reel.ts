import { Chance } from "chance";
import { default as defaultDefinition } from "./default-definition";
import SymbolGenerator from "./symbols-generator";

interface SymbolOccurences {
    symbol: number;
    occurrences: number;
}

export default class Reel {
    public static NoSymbol = -1;
    private readonly defaultNumberOfShuffles: number = 3;

    private readonly size: number;
    private readonly chance: Chance.Chance;
    private readonly definition: any;

    private symbols: number[];
    private exploded: number[] = [];
    private filled: number[] = [];

    private readonly symbolsGenerator: SymbolGenerator;

    constructor(size: number, symbols?: number[], boardDefinition?: any) {
        this.size = size;
        this.chance = new Chance();
        this.definition = boardDefinition ?? { ...defaultDefinition };

        this.symbolsGenerator = new SymbolGenerator(this.definition.normalSymbols, this.definition.freeSpins, this.definition.multiplier);
        this.symbolsGenerator.load();

        this.symbols = symbols ?? this.generate(size);
    }

    generate(size: number): number[] {
        const reel = [];

        for (let index = 0; index < size; index++) {
            reel.push(this.symbolsGenerator.randomSymbol());
            this.exploded.push(Reel.NoSymbol);
            this.filled.push(Reel.NoSymbol);
        }

        return reel;
    }

    findOccurrences(): any {
        const counts: any = {};

        for (const num of this.symbols) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        return counts;
    }

    shuffle(numberOfShuffles?: number) {
        const totalShuffles = numberOfShuffles ?? this.defaultNumberOfShuffles;

        for (let index = 0; index < totalShuffles; index++) {
            this.symbols = this.chance.shuffle(this.symbols);
        }
    }

    explode(winSymbols: number[] = []): Reel {
        const newReel: number[] = [];
        this.exploded = [];

        this.symbols.forEach((symbol) => {
            if (winSymbols.indexOf(symbol) !== -1) {
                newReel.push(Reel.NoSymbol);
                this.exploded.push(symbol);
            } else {
                newReel.push(symbol);
                this.exploded.push(Reel.NoSymbol);
            }
        });

        this.symbols = newReel;

        return this;
    }

    collapse(): Reel {
        const reelSymbols = this.symbols.filter((sym) => sym !== Reel.NoSymbol);
        const totalCollapsedItems = this.size - reelSymbols.length;

        if (totalCollapsedItems > 0) {
            const newReel = [];

            for (let index = 0; index < this.size; index++) {
                const symbol = index < totalCollapsedItems ? Reel.NoSymbol : this.symbols[index - totalCollapsedItems];
                newReel.push(symbol);
            }

            this.symbols = newReel;
        }

        return this;
    }

    refill(): Reel {
        for (let index = 0; index < this.symbols.length; index++) {
            const sym = this.symbols[index];
            this.filled[index] = Reel.NoSymbol;

            if (sym === Reel.NoSymbol) {
                const newSymbol = this.symbolsGenerator.randomSymbol();
                this.filled[index] = newSymbol;
                this.symbols[index] = newSymbol;
            }
        }

        return this;
    }

    get(): number[] {
        return this.symbols;
    }

    getExplodedItems(): number[] {
        return this.exploded;
    }

    getFilledItems(): number[] {
        return this.filled;
    }
}
