import runStatistic from "./statistic-runner";
import { writeFileSync } from "fs";
import defaultDefinition from "../default-definition";
import { mean, __ } from "ramda";
import { Difficulty } from "../difficulties";
import { getPercents, getValues, variance } from "./statistic-calculator";

const numberOfRounds = 1000;

const getStatistics = (definition: any, times: number) => {
    const statistics = [];

    for (let i = 0; i < times; i++) {
        const { statistic } = runStatistic(definition, numberOfRounds);

        statistics.push(statistic);
    }

    return statistics;
};

const definition = Object.assign({}, defaultDefinition, { difficulty: Difficulty.Hard });
const statistics = getStatistics(definition, 1000);

const report = {
    rtp: mean(getValues(["rtp"], statistics)),
    rtpVariance: variance(getValues(["rtp"], statistics)),
    multipliers: mean(getPercents(["totalMultipliers"], statistics, numberOfRounds)),
    freeSpins: mean(getPercents(["winFreeSpins"], statistics, numberOfRounds)),
    win: mean(getPercents(["winingRounds"], statistics, numberOfRounds)),
};

writeFileSync(`./reports/statistics-${definition.difficulty}.json`, JSON.stringify(statistics, null, 2));

console.log(report);

/**
Rounds: 10K
 * HARD
{
  rtp: 0.934137,
  rtpVariance: 0.008750213980999993,
  multipliers: 0.044399999999999995,
  freeSpins: 0.0047,
  win: 0.44210000000000005
}

 * MEDIUM
{
  rtp: 0.888067,
  rtpVariance: 0.002706068440999997,
  multipliers: 0.029900000000000003,
  freeSpins: 0.0034000000000000002,
  win: 0.4473
}

 * EASY
{
  rtp: 0.9500704000000004,
  rtpVariance: 0.0016402011966399992,
  multipliers: 0.047020000000000006,
  freeSpins: 0.00364,
  win: 0.44162
}

 * TRIAL
{
  rtp: 0.9863274000000004,
  rtpVariance: 0.002478963148840008,
  multipliers: 0.05636,
  freeSpins: 0.0032,
  win: 0.43474
}

 */
