// # Adapted from code by Boojum
// # Github: https://topaz.github.io/paste/#XQAAAQBbBgAAAAAAAAA0m0pnuFI8c9WAoVc3IiG2klervCAxeT2BgGKyD1MWpAnQBJqyCSMRI+beWWpduYnykvqnNoUuksfnFmLCeXGuEImHGEMmlF0aCsp7Q90Fsoe/SueNlGc5JUDFgaQ4QFpF3TK9+uV5t8F/oOTtbCv7N5nShLckuP9tmIHyyeQdXCjSCOQqQpxb+oK1qpSU9Yu8o3BECc0KIAYVhQIrPHyck+2Qf8g9qKTFHGGYh3LmqGnAHzseBwo/T8Ui6UxLfvW5BzRll+RFyj8sGJJ5qVF1bjsR8JfIgXYRrUIA+jw3n6ZyGHQAZqrJ8+SiTUNvr53JsbQkKlGdMkA0L5LWfzFIjKVaPhwlLZW2ulsrE9Uf5bS/2xNpoWfBtqPSdUJ8pcMG+A/RZ2/eB90wU2CpOJMehKLZLHumgNN3o3EWpTHwa8YnJPQfwue47LJjJSW82wfwfKJQomHe9sAB8wwizN8Kc7TcaEpT2m57n/5UM/rz3tHUa0zYQx6XcB4cyG8ZaLL+UgesiNYH57cCS4z81dwIsKmLoE/WG/gzK+gxOG0KKa2YrIHmu4qmdAvgvnYmNdRgFNMa1dU26rU0tvP9w8KocJW2KnJuoM5HRiUfXfHQm2Ya3HvSj7TiUkARq5lsflStfsGxi8SjJC1eZI/b4E7v0EoxxVzPYRCVAprtpMLB/16CvHbCx4Rn3HtWkYHQ0fUIdDYWnVx/mjEVixzOY+nU//sF/Jg=
// # Reddit: https://www.reddit.com/r/adventofcode/comments/zpihwi/comment/j0tls7a/?utm_source=share&utm_medium=web2x&context=3

import { loadDataFrom } from "../textFileReader";

export function calculateQualityLevel(pathToPuzzleInput: string): number {
  const [ORE, CLAY, OBSIDIAN, GEODE] = [0, 1, 2, 3];

  let qualityLevel = 0;
  // const maxExtraGeodesWithRemainingTime = [(t - 1) * t // 2 for t in range(24 + 1)]
  const maxExtraGeodesWithRemainingTime = [
    0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171,
    190, 210, 231, 253, 276, 300, 325, 351, 378, 406, 435, 465, 496, 528, 561,
    595, 630, 666,
  ];
  type Blueprint = {
    blueprintNumber: number;
    oreRobotOreCost: number;
    clayRobotOreCost: number;
    obsidianRobotOreCost: number;
    obsidianRobotClayCost: number;
    geodeRobotOreCost: number;
    geodeRobotObsidianCost: number;
  };

  const inputRegex =
    /Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./;
  const blueprintNumberIndex = 1;
  const orePerOreRobotIndex = 2;
  const orePerClayRobotIndex = 3;
  const orePerObsidianRobotIndex = 4;
  const clayPerObsidianRobotIndex = 5;
  const orePerGeodeRobotIndex = 6;
  const obsidianPerGeodeRobotIndex = 7;

  function parseInputData(inputLines: string[]): Blueprint[] {
    const blueprints: Blueprint[] = inputLines.map((inputLine) => {
      const matches = inputLine.match(inputRegex)!;
      const blueprintNumber = parseInt(matches[blueprintNumberIndex]);
      const orePerOreRobot = parseInt(matches[orePerOreRobotIndex]);
      const orePerClayRobot = parseInt(matches[orePerClayRobotIndex]);
      const orePerObsidianRobot = parseInt(matches[orePerObsidianRobotIndex]);
      const clayPerObsidianRobot = parseInt(matches[clayPerObsidianRobotIndex]);
      const orePerGeodeRobot = parseInt(matches[orePerGeodeRobotIndex]);
      const obsidianPerGeodeRobot = parseInt(
        matches[obsidianPerGeodeRobotIndex]
      );
      return {
        blueprintNumber,
        oreRobotOreCost: orePerOreRobot,
        clayRobotOreCost: orePerClayRobot,
        obsidianRobotOreCost: orePerObsidianRobot,
        obsidianRobotClayCost: clayPerObsidianRobot,
        geodeRobotOreCost: orePerGeodeRobot,
        geodeRobotObsidianCost: obsidianPerGeodeRobot,
      };
    });

    return blueprints;
  }

  const inputLines = loadDataFrom(pathToPuzzleInput);
  const blueprints = parseInputData(inputLines);

  // blueprintParameters = [list(map(int, re.findall("-?\d+", inputLine)))
  //                        for inputLine in fileinput.input(pathToPuzzleInput)]
  for (const {
    blueprintNumber,
    oreRobotOreCost,
    clayRobotOreCost,
    obsidianRobotOreCost,
    obsidianRobotClayCost,
    geodeRobotOreCost,
    geodeRobotObsidianCost,
  } of blueprints) {
    let bestGeodeCount = 0;
    const [maxOreRobots, maxClayRobots, maxObsidianRobots] = [
      Math.max(
        oreRobotOreCost,
        clayRobotOreCost,
        obsidianRobotOreCost,
        geodeRobotOreCost
      ),
      obsidianRobotClayCost,
      geodeRobotObsidianCost,
    ];

    function dfs(
      timeRemaining: number,
      goalRobotType: number,
      oreRobotCount: number,
      clayRobotCount: number,
      obsidianRobotCount: number,
      geodeRobotCount: number,
      oreCount: number,
      clayCount: number,
      obsidianCount: number,
      geodeCount: number
    ) {
      if (
        (goalRobotType == ORE && oreRobotCount >= maxOreRobots) ||
        (goalRobotType == CLAY && clayRobotCount >= maxClayRobots) ||
        (goalRobotType == OBSIDIAN &&
          (obsidianRobotCount >= maxObsidianRobots || clayRobotCount == 0)) ||
        (goalRobotType == GEODE && obsidianRobotCount == 0) ||
        geodeCount +
          geodeRobotCount * timeRemaining +
          maxExtraGeodesWithRemainingTime[timeRemaining] <=
          bestGeodeCount
      ) {
        return;
      }
      while (timeRemaining) {
        if (goalRobotType == ORE && oreCount >= oreRobotOreCost) {
          for (const goalRobotType of [ORE, CLAY, OBSIDIAN, GEODE])
            dfs(
              timeRemaining - 1,
              goalRobotType,
              oreRobotCount + 1,
              clayRobotCount,
              obsidianRobotCount,
              geodeRobotCount,
              oreCount - oreRobotOreCost + oreRobotCount,
              clayCount + clayRobotCount,
              obsidianCount + obsidianRobotCount,
              geodeCount + geodeRobotCount
            );
          return;
        } else if (goalRobotType == CLAY && oreCount >= clayRobotOreCost) {
          for (const goalRobotType of [ORE, CLAY, OBSIDIAN, GEODE])
            dfs(
              timeRemaining - 1,
              goalRobotType,
              oreRobotCount,
              clayRobotCount + 1,
              obsidianRobotCount,
              geodeRobotCount,
              oreCount - clayRobotOreCost + oreRobotCount,
              clayCount + clayRobotCount,
              obsidianCount + obsidianRobotCount,
              geodeCount + geodeRobotCount
            );
          return;
        } else if (
          goalRobotType == OBSIDIAN &&
          oreCount >= obsidianRobotOreCost &&
          clayCount >= obsidianRobotClayCost
        ) {
          for (const goalRobotType of [ORE, CLAY, OBSIDIAN, GEODE])
            dfs(
              timeRemaining - 1,
              goalRobotType,
              oreRobotCount,
              clayRobotCount,
              obsidianRobotCount + 1,
              geodeRobotCount,
              oreCount - obsidianRobotOreCost + oreRobotCount,
              clayCount - obsidianRobotClayCost + clayRobotCount,
              obsidianCount + obsidianRobotCount,
              geodeCount + geodeRobotCount
            );
          return;
        } else if (
          goalRobotType == GEODE &&
          oreCount >= geodeRobotOreCost &&
          obsidianCount >= geodeRobotObsidianCost
        ) {
          for (const goalRobotType of [ORE, CLAY, OBSIDIAN, GEODE])
            dfs(
              timeRemaining - 1,
              goalRobotType,
              oreRobotCount,
              clayRobotCount,
              obsidianRobotCount,
              geodeRobotCount + 1,
              oreCount - geodeRobotOreCost + oreRobotCount,
              clayCount + clayRobotCount,
              obsidianCount - geodeRobotObsidianCost + obsidianRobotCount,
              geodeCount + geodeRobotCount
            );
          return;
        }
        [timeRemaining, oreCount, clayCount, obsidianCount, geodeCount] = [
          timeRemaining - 1,
          oreCount + oreRobotCount,
          clayCount + clayRobotCount,
          obsidianCount + obsidianRobotCount,
          geodeCount + geodeRobotCount,
        ];
      }
      bestGeodeCount = Math.max(bestGeodeCount, geodeCount);
    }
    for (const goalRobot of [ORE, CLAY, OBSIDIAN, GEODE]) {
      dfs(24, goalRobot, 1, 0, 0, 0, 0, 0, 0, 0);
    }
    qualityLevel += bestGeodeCount * blueprintNumber;
  }
  return qualityLevel;
}
