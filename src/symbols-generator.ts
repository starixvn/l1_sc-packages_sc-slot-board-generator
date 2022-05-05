import { Chance } from "chance";

export default class SymbolsGenerator {
    public static readonly DefaultNormalSymbols: number = 1000;
    private static readonly Ratio: number = 14;
    private static readonly RatioOfFreeSpin: number = 40;
    public static readonly TotalItemPerReel: number = 200;

    private symbolPayouts: any = {};
    private freeSpin: any;
    private multiplier: any;
    private readonly chance: Chance.Chance;

    private board: number[] = [];

    constructor(symbolPayouts: any, freeSpin: any, multiplier: any) {
        symbolPayouts.forEach((symbolPayout: any) => {
            const last = symbolPayout.payout.length - 1;
            this.symbolPayouts[symbolPayout.symbol] = symbolPayout.payout[last].odds;
        });

        this.freeSpin = freeSpin;
        this.multiplier = multiplier;
        this.chance = new Chance();
    }

    load() {
        const keys = Object.keys(this.symbolPayouts);
        keys.forEach((key) => {
            const total = (SymbolsGenerator.DefaultNormalSymbols / this.symbolPayouts[key]) * SymbolsGenerator.Ratio;

            for (let index = 0; index < total; index++) {
                this.board.push(Number(key));
            }
        });

        const totalEmpty = SymbolsGenerator.DefaultNormalSymbols - this.board.length;
        const totalFreeSpin = Math.round((totalEmpty * SymbolsGenerator.RatioOfFreeSpin) / 100);

        for (let index = 0; index < totalFreeSpin; index++) {
            this.board.push(Number(this.freeSpin.symbol));
        }

        const totalMultiplier = SymbolsGenerator.DefaultNormalSymbols - this.board.length;
        for (let index = 0; index < totalMultiplier; index++) {
            this.board.push(Number(this.multiplier.symbol));
        }

        this.board = this.chance.shuffle(this.chance.shuffle(this.chance.shuffle(this.board)));
    }

    randomSymbol({ reelIndex = 0 }: { reelIndex?: number } = {}): number {
        const reel = this.getReel(reelIndex);

        return this.chance.pickone(reel);
    }

    getReel(reelIndex: number): number[] {
        const reel = [];
        const min = SymbolsGenerator.TotalItemPerReel * reelIndex;
        const max = SymbolsGenerator.TotalItemPerReel * (reelIndex + 1);

        for (let index = min; index < max; index++) {
            reel.push(this.board[index]);
        }

        return reel;
    }

    getBoard(): number[] {
        return this.board;
    }
}
