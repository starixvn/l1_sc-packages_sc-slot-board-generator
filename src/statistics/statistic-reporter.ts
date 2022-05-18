import { getStatistics } from "./statistic-runner";
import defaultDefinition from "../default-definition";
import defaultOdds from "./default-odds";
import boardDefinition from "../board-definition";
import { map, mean, range, __ } from "ramda";
import { Difficulty } from "../difficulties";
import { writeFileSync } from "fs";
import { getPercents, getValues, Statistic, variance } from "./statistic-calculator";

const calculateReport = (statistics: Statistic[], rounds: number) => ({
    rtp: mean(getValues(["rtp"], statistics)),
    rtpDeviation: Math.sqrt(variance(getValues(["rtp"], statistics))),
    multiplierRatio: mean(getPercents(["totalMultipliers"], statistics, rounds)),
    freeSpinsRatio: mean(getPercents(["winFreeSpins"], statistics, rounds)),
    tumbleWinRatio: mean(getPercents(["winingRounds"], statistics, rounds)),
});

const getNumberOfSymbols = (factor: number, multiplierSymbols: number) => {
    const symbolHeuristic = {
        0: 1.2,
        1: 10 / 9,
        2: 1.2,
        3: 1.25,
        4: 1.2,
        5: 1.25,
        6: 1.25,
        7: 2,
        8: 1,
        9: 2 / 3,
        10: multiplierSymbols,
    };

    const multiplier = { 10: symbolHeuristic[10] };
    const scatter = { 9: Math.round(factor * symbolHeuristic[9]) };
    const normalSymbols = range(0, 9)
        .reverse()
        .reduce((result, symbol) => {
            if (symbol === 8) {
                result[symbol] = factor * symbolHeuristic[symbol];
            } else {
                result[symbol] = Math.round(symbolHeuristic[symbol] * result[symbol + 1]);
            }

            return result;
        }, {} as Record<number, number>);

    return Object.assign({}, normalSymbols, scatter, multiplier);
};

const getDefinition = (x: number, multiplierSymbols: number) =>
    Object.assign(
        {},
        defaultDefinition,
        defaultOdds,
        { boardDefinition: boardDefinition },
        { difficulty: Difficulty.Medium },
        {
            mode: {
                [Difficulty.Medium]: getNumberOfSymbols(x, multiplierSymbols),
            },
        }
    );

const countSymbols = (statistics: Statistic[]): Record<number, Record<number, number>> => {
    const result: Record<number, number[]> = {};

    range(0, 11).forEach((symbol) => {
        range(1, 31).forEach((numberOfSymbols) => {
            statistics.forEach((statistic) => {
                if (!result[symbol]) {
                    result[symbol] = range(1, 31).map(() => 0);
                }

                result[symbol][numberOfSymbols - 1] += statistic.symbols.counts[symbol][numberOfSymbols] || 0;
            });
        });
    });

    return result;
};

const countMultipliers = (statistics: Statistic[]): Record<number, number> => {
    const result: Record<number, number> = {};
    const maximumMultiplier = Math.max(
        ...map(
            parseInt,
            statistics.flatMap((s) => Object.keys(s.multipliers))
        )
    );

    range(0, maximumMultiplier + 1).forEach((value) => {
        statistics.forEach((statistic) => {
            if (!result[value]) {
                result[value] = statistic.multipliers[value] || 0;
            } else {
                result[value] += statistic.multipliers[value] || 0;
            }
        });
    });

    return result;
};

const startGenerate = (
    maximumFactor: number,
    multiplierSymbols: number,
    batchSize: number = 1000,
    times: number = 2,
    betCoins = [0.1],
    betLevels = [5],
    singleFactor: boolean = false
) => {
    console.log({ maximumFactor, multiplierSymbols, batchSize, times });
    const result = [];
    const executeSingleFactor = (factor: number) => {
        const definition = getDefinition(factor, multiplierSymbols);
        const { statistics } = getStatistics(definition, times, batchSize, betCoins, betLevels);
        const report = calculateReport(statistics, batchSize);
        const symbols = countSymbols(statistics);
        const configs = range(0, 11).map((symbol) => definition.mode[Difficulty.Medium][symbol]);
        const multipliers = countMultipliers(statistics);

        result.push({ report, symbols, configs, multipliers });

        console.log(multiplierSymbols, factor, report.rtp, report.rtpDeviation);

        writeFileSync(`reports/report-${batchSize}-${times}-${maximumFactor}-${multiplierSymbols}.json`, JSON.stringify(result, null, 2));
    };

    if (singleFactor) {
        executeSingleFactor(maximumFactor);
    } else {
        for (let factor = 12; factor <= maximumFactor; factor++) {
            executeSingleFactor(factor);
        }
    }

    return result;
};

const factor = Number(process.argv[2] || 40);
const multiplier = Number(process.argv[3] || 1);
const batchSize = Number(process.argv[4] || 1000);
const times = Number(process.argv[5] || 50);
const singleFactor = process.argv[6] === "true";
const betCoins = [0.01, 0.05, 0.1, 0.5];
const betLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

startGenerate(factor, multiplier, batchSize, times, betCoins, betLevels, singleFactor);
