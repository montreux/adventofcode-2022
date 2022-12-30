const inputRegex =
  /Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./;
const blueprintNumberIndex = 1;
const orePerOreRobotIndex = 2;
const orePerClayRobotIndex = 3;
const orePerObsidianRobotIndex = 4;
const clayPerObsidianRobotIndex = 5;
const orePerGeodeRobotIndex = 6;
const obsidianPerGeodeRobotIndex = 7;

export type RobotType = "Ore" | "Clay" | "Obsidian" | "Geode";

type RobotBOM = {
  ore: number;
  clay: number;
  obsidian: number;
};

type Blueprint = {
  blueprintNumber: number;
  oreRobotBOM: RobotBOM;
  clayRobotBOM: RobotBOM;
  obsidianRobotBOM: RobotBOM;
  geodeRobotBOM: RobotBOM;
};

export function parseInputData(inputLines: string[]): Blueprint[] {
  const blueprints: Blueprint[] = inputLines.map((inputLine) => {
    const matches = inputLine.match(inputRegex)!;
    const blueprintNumber = parseInt(matches[blueprintNumberIndex]);
    const orePerOreRobot = parseInt(matches[orePerOreRobotIndex]);
    const orePerClayRobot = parseInt(matches[orePerClayRobotIndex]);
    const orePerObsidianRobot = parseInt(matches[orePerObsidianRobotIndex]);
    const clayPerObsidianRobot = parseInt(matches[clayPerObsidianRobotIndex]);
    const orePerGeodeRobot = parseInt(matches[orePerGeodeRobotIndex]);
    const obsidianPerGeodeRobot = parseInt(matches[obsidianPerGeodeRobotIndex]);
    return {
      blueprintNumber,
      oreRobotBOM: { ore: orePerOreRobot, clay: 0, obsidian: 0 },
      clayRobotBOM: { ore: orePerClayRobot, clay: 0, obsidian: 0 },
      obsidianRobotBOM: {
        ore: orePerObsidianRobot,
        clay: clayPerObsidianRobot,
        obsidian: 0,
      },
      geodeRobotBOM: {
        ore: orePerGeodeRobot,
        clay: 0,
        obsidian: obsidianPerGeodeRobot,
      },
    };
  });

  return blueprints;
}

export function calcGeodesOpened(
  blueprint: Blueprint,
  robotConstructionOrder: RobotType[],
  time: number,
  shouldLog = false
): number {
  let oreRobotCount = 1;
  let clayRobotCount = 0;
  let obsidianRobotCount = 0;
  let geodeRobotCount = 0;

  let currentOreCount = 0;
  let currentClayCount = 0;
  let currentObsidianCount = 0;
  let currentGeodeCount = 0;

  if (!robotConstructionOrder) {
    throw new Error(
      `No robot constrction order for blueprint ${blueprint.blueprintNumber}`
    );
  }
  let workingRobotConstructionOrder = [...robotConstructionOrder];
  let nextRobotToBuild = workingRobotConstructionOrder.shift()!;
  let {
    ore: oreRequiredForNextRobot,
    clay: clayRequiredForNextRobot,
    obsidian: obsidianRequiredForNextRobot,
  } = commoditiesToBuildRobot(blueprint, nextRobotToBuild);

  const buildLog: string[][] = [[]];

  for (let currentTime = 1; currentTime <= time; currentTime++) {
    const minuteLog: string[] = [];
    if (shouldLog) {
      minuteLog.push(`== Minute ${currentTime} ==`);
    }
    // Build the next robot if possible

    let builtRobot = "";

    let nextOreRobotCount = oreRobotCount;
    let nextClayRobotCount = clayRobotCount;
    let nextObsidianRobotCount = obsidianRobotCount;
    let nextGeodeRobotCount = geodeRobotCount;

    const haveResourcesToBuildNextRobot =
      currentOreCount >= oreRequiredForNextRobot &&
      currentClayCount >= clayRequiredForNextRobot &&
      currentObsidianCount >= obsidianRequiredForNextRobot;

    if (haveResourcesToBuildNextRobot) {
      switch (nextRobotToBuild) {
        case "Ore":
          nextOreRobotCount = oreRobotCount + 1;
          break;
        case "Clay":
          nextClayRobotCount = clayRobotCount + 1;
          break;
        case "Obsidian":
          nextObsidianRobotCount = obsidianRobotCount + 1;
          break;
        case "Geode":
          nextGeodeRobotCount = geodeRobotCount + 1;
          break;
      }
      builtRobot = nextRobotToBuild;
      currentOreCount -= oreRequiredForNextRobot;
      currentClayCount -= clayRequiredForNextRobot;
      currentObsidianCount -= obsidianRequiredForNextRobot;

      if (shouldLog) {
        const robotDescription =
          builtRobot == "Geode"
            ? "geode-cracking"
            : `${builtRobot.toLowerCase()}-collecting`;
        const resourceCostDescription =
          builtRobot == "Geode"
            ? ` and ${obsidianRequiredForNextRobot} obsidian`
            : builtRobot == "Obsidian"
            ? ` and ${clayRequiredForNextRobot} clay`
            : "";
        const aOrAn = builtRobot == "Obsidian" ? "an" : "a";
        minuteLog.push(
          `**Spend ${oreRequiredForNextRobot} ore${resourceCostDescription} to start building ${aOrAn} ${robotDescription} robot.**`
        );
      }

      nextRobotToBuild = workingRobotConstructionOrder.shift()!;
      ({
        ore: oreRequiredForNextRobot,
        clay: clayRequiredForNextRobot,
        obsidian: obsidianRequiredForNextRobot,
      } = commoditiesToBuildRobot(blueprint, nextRobotToBuild));
    }

    // Have the existing robots build resources
    currentOreCount += oreRobotCount;
    currentClayCount += clayRobotCount;
    currentObsidianCount += obsidianRobotCount;
    currentGeodeCount += geodeRobotCount;

    if (shouldLog) {
      if (oreRobotCount > 0) {
        const plural = oreRobotCount > 1 ? "s" : "";
        const inversePlural = oreRobotCount > 1 ? "" : "s";
        minuteLog.push(
          `${oreRobotCount} ore-collecting robot${plural} collect${inversePlural} ${oreRobotCount} ore; you now have ${currentOreCount} ore.`
        );
      }
      if (clayRobotCount > 0) {
        const plural = clayRobotCount > 1 ? "s" : "";
        const inversePlural = clayRobotCount > 1 ? "" : "s";
        minuteLog.push(
          `${clayRobotCount} clay-collecting robot${plural} collect${inversePlural} ${clayRobotCount} clay; you now have ${currentClayCount} clay.`
        );
      }
      if (obsidianRobotCount > 0) {
        const plural = obsidianRobotCount > 1 ? "s" : "";
        const inversePlural = obsidianRobotCount > 1 ? "" : "s";
        minuteLog.push(
          `${obsidianRobotCount} obsidian-collecting robot${plural} collect${inversePlural} ${obsidianRobotCount} obsidian; you now have ${currentObsidianCount} obsidian.`
        );
      }
      if (geodeRobotCount > 0) {
        const plural = geodeRobotCount > 1 ? "s" : "";
        const inversePlural = geodeRobotCount > 1 ? "" : "s";
        const geodePlural = currentGeodeCount > 1 ? "s" : "";
        minuteLog.push(
          `${geodeRobotCount} geode-cracking robot${plural} crack${inversePlural} ${geodeRobotCount} geode${plural}; you now have ${currentGeodeCount} open geode${geodePlural}.`
        );
      }
    }
    // Increment the number of robots if any built
    oreRobotCount = nextOreRobotCount;
    clayRobotCount = nextClayRobotCount;
    obsidianRobotCount = nextObsidianRobotCount;
    geodeRobotCount = nextGeodeRobotCount;

    if (shouldLog && builtRobot.length > 0) {
      const robotDescription =
        builtRobot == "Geode"
          ? "geode-cracking"
          : `${builtRobot.toLowerCase()}-collecting`;
      const robotQuantity =
        builtRobot == "Geode"
          ? geodeRobotCount
          : builtRobot == "Obsidian"
          ? obsidianRobotCount
          : builtRobot == "Clay"
          ? clayRobotCount
          : oreRobotCount;
      // The new geode-cracking robot is ready; you now have 1 of them.
      minuteLog.push(
        `The new ${robotDescription} robot is ready; you now have ${robotQuantity} of them.`
      );
    }
    buildLog.push(minuteLog);
  }
  if (shouldLog) {
    console.log(buildLog.map((minuteLog) => minuteLog.join("\n")).join("\n\n"));
  }

  return currentGeodeCount;
}

function commoditiesToBuildRobot(
  blueprint: Blueprint,
  nextRobotToBuild: RobotType
): RobotBOM {
  if (nextRobotToBuild == undefined) {
    return {
      ore: Number.MAX_SAFE_INTEGER,
      clay: Number.MAX_SAFE_INTEGER,
      obsidian: Number.MAX_SAFE_INTEGER,
    };
  }
  switch (nextRobotToBuild) {
    case "Ore":
      return blueprint.oreRobotBOM;
    case "Clay":
      return blueprint.clayRobotBOM;
    case "Obsidian":
      return blueprint.obsidianRobotBOM;
    case "Geode":
      return blueprint.geodeRobotBOM;
  }
}

export type MiningState = {
  time: number;
  oreRobotCount: number;
  clayRobotCount: number;
  obsidianRobotCount: number;
  geodeRobotCount: number;

  currentOreCount: number;
  currentClayCount: number;
  currentObsidianCount: number;
  currentGeodeCount: number;

  robotBuildOrder: RobotType[];
};

const theoreticalMaxExtraGeodesWithXTimeRemaining = [
  0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171,
  190, 210, 231, 253, 276, 300, 325, 351, 378, 406, 435, 465, 496, 528, 561,
  595, 630, 666,
];

export function calcRobotBuildPlan(
  blueprint: Blueprint,
  time = 24
): RobotType[] {
  const unvisitedStates: MiningState[] = [];
  const robotBuildOrdersToTry = new Set<string>();

  let maxGeodesCount = Number.MIN_SAFE_INTEGER;
  let maxGeodesRobotBuildOrder: RobotType[] = [];

  const initialState = {
    time: 1,
    oreRobotCount: 1,
    clayRobotCount: 0,
    obsidianRobotCount: 0,
    geodeRobotCount: 0,
    currentOreCount: 0,
    currentClayCount: 0,
    currentObsidianCount: 0,
    currentGeodeCount: 0,
    robotBuildOrder: [],
  };
  unvisitedStates.push(initialState);

  const maxOreRobots = Math.max(
    blueprint.clayRobotBOM.ore,
    blueprint.obsidianRobotBOM.ore,
    blueprint.geodeRobotBOM.ore
  );
  const maxClayRobots = blueprint.obsidianRobotBOM.clay;
  const maxObsidianRobots = blueprint.geodeRobotBOM.obsidian;

  let bestScoreSoFar = 0;

  while (unvisitedStates.length > 0) {
    const currentState = unvisitedStates.pop()!;

    // What could we build next?
    let possibleRobotTypes: RobotType[] = [];
    if (currentState.oreRobotCount < maxOreRobots) {
      possibleRobotTypes.push("Ore");
    }
    if (currentState.clayRobotCount < maxClayRobots) {
      possibleRobotTypes.push("Clay");
    }
    if (
      currentState.clayRobotCount > 0 &&
      currentState.obsidianRobotCount < maxObsidianRobots
    ) {
      possibleRobotTypes.push("Obsidian");
    }
    if (currentState.obsidianRobotCount > 0) {
      possibleRobotTypes.push("Geode");
    }
    // const canBuildGeodeRobot =
    //   currentState.currentObsidianCount >= blueprint.geodeRobotBOM.obsidian &&
    //   currentState.currentOreCount >= blueprint.geodeRobotBOM.ore;
    // if (canBuildGeodeRobot) {
    //   possibleRobotTypes = ["Geode"];
    // }
    for (const robotType of possibleRobotTypes) {
      const nextState: MiningState = nextStateIfBuildRobot(
        robotType,
        blueprint,
        currentState
      );

      if (nextState.time <= time) {
        const valuableTimeRemainingAtNextState = time - nextState.time + 1;
        const theoreticalMaxGeodeScore =
          nextState.currentGeodeCount +
          nextState.geodeRobotCount * valuableTimeRemainingAtNextState +
          theoreticalMaxExtraGeodesWithXTimeRemaining[
            valuableTimeRemainingAtNextState
          ];

        if (theoreticalMaxGeodeScore > bestScoreSoFar) {
          const minFinalGeodeScore =
            nextState.currentGeodeCount +
            nextState.geodeRobotCount * valuableTimeRemainingAtNextState;
          bestScoreSoFar = Math.max(minFinalGeodeScore, bestScoreSoFar);
          unvisitedStates.push(nextState);
        }
      } else {
        // Trim any robot builds that don't end with 'Geode'
        const indexOfLastGeodeBuild =
          currentState.robotBuildOrder.lastIndexOf("Geode");
        if (indexOfLastGeodeBuild !== -1) {
          const trimmedRobotBuildOrder = currentState.robotBuildOrder.slice(
            0,
            indexOfLastGeodeBuild + 1
          );
          robotBuildOrdersToTry.add(JSON.stringify(trimmedRobotBuildOrder));
          const finalGeodeCount = calcGeodesOpened(
            blueprint,
            trimmedRobotBuildOrder,
            time
          );
          if (finalGeodeCount > maxGeodesCount) {
            maxGeodesCount = finalGeodeCount;
            maxGeodesRobotBuildOrder = trimmedRobotBuildOrder;
          }
        }
      }
    }
  }

  const robotBuildOrders: RobotType[][] = [
    ...robotBuildOrdersToTry.values(),
  ].map<RobotType[]>((buildOrderJson) => JSON.parse(buildOrderJson));

  robotBuildOrders.sort((a, b) => {
    const aGeodesOpened = calcGeodesOpened(blueprint, [...a], time);
    const bGeodesOpened = calcGeodesOpened(blueprint, [...b], time);
    return bGeodesOpened - aGeodesOpened;
    // const aGeodeRobots = a.filter((robotType) => robotType === "Geode").length;
    // const bGeodeRobots = b.filter((robotType) => robotType === "Geode").length;
    // return bGeodeRobots - aGeodeRobots;
  });
  //   return robotBuildOrders;

  // const geodesOpenedPerPlan = robotBuildOrders.map((buildOrder) =>
  //   calcGeodesOpened(blueprint, buildOrder, time)
  // );
  return robotBuildOrders.length > 0 ? robotBuildOrders[0] : [];
}

/**
 * The state at the minute after the robot is built.
 * @param robotType
 * @param blueprint
 * @param currentState
 * @returns
 */
export function nextStateIfBuildRobot(
  robotType: RobotType,
  blueprint: Blueprint,
  currentState: MiningState
) {
  const robotBom =
    robotType == "Ore"
      ? blueprint.oreRobotBOM
      : robotType == "Clay"
      ? blueprint.clayRobotBOM
      : robotType == "Obsidian"
      ? blueprint.obsidianRobotBOM
      : blueprint.geodeRobotBOM;
  const timeToHaveEnoughOreForRobot =
    (robotBom.ore - currentState.currentOreCount) / currentState.oreRobotCount;
  let timeToHaveEnoughClayForRobot = -1;
  if (currentState.clayRobotCount > 0) {
    timeToHaveEnoughClayForRobot =
      (robotBom.clay - currentState.currentClayCount) /
      currentState.clayRobotCount;
  }

  let timeToHaveEnoughObsidianForRobot = -1;
  if (currentState.obsidianRobotCount > 0) {
    timeToHaveEnoughObsidianForRobot =
      (robotBom.obsidian - currentState.currentObsidianCount) /
      currentState.obsidianRobotCount;
  }

  const timeUntilRobotBuildStarts = Math.ceil(
    Math.max(
      timeToHaveEnoughOreForRobot,
      timeToHaveEnoughClayForRobot,
      timeToHaveEnoughObsidianForRobot
    )
  );
  const timeUntilRobotBuilt = timeUntilRobotBuildStarts + 1;

  const nextState: MiningState = {
    robotBuildOrder: [...currentState.robotBuildOrder, robotType],
    time: currentState.time + timeUntilRobotBuilt,
    oreRobotCount: currentState.oreRobotCount + (robotType == "Ore" ? 1 : 0),
    clayRobotCount: currentState.clayRobotCount + (robotType == "Clay" ? 1 : 0),
    obsidianRobotCount:
      currentState.obsidianRobotCount + (robotType == "Obsidian" ? 1 : 0),
    geodeRobotCount:
      currentState.geodeRobotCount + (robotType == "Geode" ? 1 : 0),
    currentOreCount:
      currentState.currentOreCount -
      robotBom.ore +
      currentState.oreRobotCount * timeUntilRobotBuilt,
    currentClayCount:
      currentState.currentClayCount -
      robotBom.clay +
      currentState.clayRobotCount * timeUntilRobotBuilt,
    currentObsidianCount:
      currentState.currentObsidianCount -
      robotBom.obsidian +
      currentState.obsidianRobotCount * timeUntilRobotBuilt,
    currentGeodeCount:
      currentState.currentGeodeCount +
      currentState.geodeRobotCount * timeUntilRobotBuilt,
  };
  return nextState;
}

export function scoreBluePrints(
  blueprints: Blueprint[],
  time: number,
  shouldDebug = false
): number {
  const debugLines: string[] = [];

  let totalScore = 0;
  blueprints.forEach((blueprint) => {
    const buildPlan = calcRobotBuildPlan(blueprint);
    const geodesOpened = calcGeodesOpened(blueprint, buildPlan, time);
    if (shouldDebug) {
      debugLines.push(
        `${
          blueprint.blueprintNumber
        }: ${geodesOpened} geodes opened with plan: ${JSON.stringify(
          buildPlan
        )}`
      );
    }
    totalScore += blueprint.blueprintNumber * geodesOpened;
  });

  if (shouldDebug) {
    console.log(debugLines.join("\n"));
  }

  return totalScore;
}
