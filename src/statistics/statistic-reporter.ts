import { getStatistics } from "./statistic-runner";
import defaultDefinition from "../default-definition";
import { mean, range, __ } from "ramda";
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
        { difficulty: Difficulty.Medium },
        {
            numberOfSymbolsByDifficulty: {
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

const startGenerate = (maximumFactor: number, maximumMultiplierSymbols: number) => {
    const batchSize = 1000;
    const times = 2;
    const result = [];

    for (let multiplierSymbols = 1; multiplierSymbols <= maximumMultiplierSymbols; multiplierSymbols++) {
        for (let factor = 12; factor <= maximumFactor; factor++) {
            const definition = getDefinition(factor, multiplierSymbols);
            const { statistics } = getStatistics(definition, times, batchSize);
            const report = calculateReport(statistics, batchSize);
            const symbols = countSymbols(statistics);
            const configs = range(0, 11).map((symbol) => definition.numberOfSymbolsByDifficulty[Difficulty.Medium][symbol]);

            result.push({ report, symbols, configs });

            console.log(multiplierSymbols, factor, report.rtp, report.rtpDeviation);

            writeFileSync("reports/report.json", JSON.stringify(result, null, 2));
        }
    }

    return result;
};

startGenerate(40, 5);
