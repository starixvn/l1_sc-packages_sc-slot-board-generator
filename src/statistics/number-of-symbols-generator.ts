import runStatistic from "./statistic-runner";
import defaultDefinition from "../default-definition";
import { clone, map, mean, range, __ } from "ramda";
import { Difficulty } from "../difficulties";
import { getValues, variance } from "./statistic-calculator";

export const getStatistics = (definition: any, times: number, rounds: number) => {
    const statistics = [];

    for (let i = 0; i < times; i++) {
        const { statistic } = runStatistic(definition, rounds);

        statistics.push(statistic);
    }

    return statistics;
};

const startGenerate = (expectedRTP: number[]): Record<number, number>[] => {
    const symbolHeuristic = {
        0: 1,
        1: 2,
        2: 2.5,
        3: 3.125,
        4: 3.75,
        5: 4.6875,
        6: 5.625,
        7: 6.25,
        8: 7.5,
        9: 2 / 3,
    };

    const getNumberOfSymbols = (x: number) =>
        Object.assign(
            {},
            map((symbol) => Math.round(symbolHeuristic[symbol] * x), range(0, 10)),
            { 10: 1 }
        );

    const getDefinition = (x: number) =>
        Object.assign(
            {},
            defaultDefinition,
            { difficulty: Difficulty.Medium },
            {
                numberOfSymbolsByDifficulty: {
                    [Difficulty.Medium]: getNumberOfSymbols(x),
                },
            }
        );

    const result = [];
    let rtpIndex = 0;
    let factor = 12;

    while (expectedRTP.length !== rtpIndex) {
        const rounds = 1000;
        const definition = getDefinition(factor);
        const statistics = getStatistics(definition, 100, rounds);
        const rtpPercents = getValues(["rtp"], statistics);
        const rtp = mean(rtpPercents);
        const rtpVariance = variance(rtpPercents);
        const min = expectedRTP[rtpIndex] - rtpVariance;
        const max = expectedRTP[rtpIndex] + rtpVariance;

        console.log(rtp, rtpVariance, factor);
        if ((rtp >= min && rtp <= max) || rtp < expectedRTP[rtpIndex]) {
            result.push(clone(definition.numberOfSymbolsByDifficulty[Difficulty.Medium]));
            rtpIndex += 1;
            console.log(result);
        }

        factor += 1;
    }

    return result;
};

console.log(startGenerate([0.97, 0.95, 0.87, 0.8]));
