import RoundCalculator from "sc-cascading-slot-base/src/board/round-calculator";
import TumbleCalculator from "sc-cascading-slot-base/src/board/tumble-calculator";
import { prop } from "ramda";
import BoardGenerator from "../board-generator";
import { calculateStatistic, Round, Statistic } from "./statistic-calculator";

export default function start(definition: any, numberOfRounds = 1000, debug = false): { statistic: Statistic; rounds: Round[] } {
    const generator = new BoardGenerator(definition);

    generator.setDifficulty(definition.difficulty);

    const calculator = new RoundCalculator({
        boardGenerator: generator,
        tumbleCalculator: new TumbleCalculator(),
    });
    const odds = {
        oddsByCounts: Object.assign({}, definition.normalSymbols.map(prop("payout"))),
        freeSpins: definition.freeSpins,
    };

    const rounds = [];
    const statistic: Statistic = {
        rtp: 0,
        totalRounds: 0,
        winingRounds: 0,
        totalBetAmount: 0,
        totalPayout: 0,
        totalPayoutForFreeSpins: 0,
        winFreeSpins: 0,
        totalFreeSpins: 0,
        totalAdditionFreeSpins: 0,
        totalMultipliers: 0,
        round: {
            maximumTumbles: 0,
            maximumPayout: 0,
            maximumFreeSpins: 0,
            maximumMultiplier: 0,
            maximumTumblePayout: 0,
        },
        multipliers: {},
        symbols: {
            counts: {},
        },
        cache: {
            freeSpins: {},
        },
    };

    const executeFreeSpins = (round: Round, cache: { totalMultiplierInFreeSpins: number; freeSpins: number }) => {
        let additionFreeSpins = 0;

        for (let j = 0; j < cache.freeSpins; j++) {
            debug && console.log(`#${round.id}/${numberOfRounds - 1} Running free spins ${j}/${cache.freeSpins - 1}`);

            const freeSpinRound: Round = {
                id: round.id,
                freeSpinId: j,
                coinValue: 0.1,
                betLevel: 5,
                betMultiplier: 20,
                totalAmount: 0,
                odds,
                freeSpin: true,
            };

            calculator.processSpinning(freeSpinRound, cache.totalMultiplierInFreeSpins);

            if (freeSpinRound.betwin) {
                cache.totalMultiplierInFreeSpins += freeSpinRound.multiplier;
            }

            calculateStatistic(freeSpinRound)(statistic);
            delete freeSpinRound.odds;
            rounds.push(freeSpinRound);

            additionFreeSpins += freeSpinRound.settlementResult.freeSpins.odds;
        }

        additionFreeSpins && debug && console.log(`You won addition free spins: ${additionFreeSpins}`);

        cache.freeSpins = additionFreeSpins;
    };

    for (let i = 0; i < numberOfRounds; i++) {
        debug && console.log(`Running ${i}/${numberOfRounds - 1}`);

        const round: Round = {
            id: i,
            coinValue: 0.1,
            betLevel: 5,
            betMultiplier: 20,
            totalAmount: 0.1 * 5 * 20,
            odds,
        };

        calculator.processSpinning(round);

        calculateStatistic(round)(statistic);

        delete round.odds;
        rounds.push(round);

        const freeSpins = round.settlementResult.freeSpins.odds;

        freeSpins && debug && console.log(`You won free spins: ${freeSpins}`);

        const cache = {
            totalMultiplierInFreeSpins: 0,
            freeSpins,
        };

        while (cache.freeSpins != 0) {
            executeFreeSpins(round, cache);
        }
    }

    delete statistic.cache;

    return { statistic, rounds };
}

export const getStatistics = (definition: any, times: number, batchSize: number) => {
    const statistics: Statistic[] = [];
    const allRounds: Round[][] = [];

    for (let i = 0; i < times; i++) {
        const { statistic, rounds } = start(definition, batchSize);

        statistics.push(statistic);
        allRounds.push(rounds);
    }

    return { statistics, rounds: allRounds };
};
