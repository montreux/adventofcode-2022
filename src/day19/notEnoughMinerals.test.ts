import { loadDataFrom } from "../textFileReader";
import {
  calcGeodesOpened,
  calcRobotBuildPlan,
  MiningState,
  nextStateIfBuildRobot,
  parseInputData,
  RobotType,
  scoreBluePrints,
} from "./notEnoughMinerals";

test("parseInputData", () => {
  const inputLines = loadDataFrom(
    "./src/day19/notEnoughMinerals.exampledata.txt"
  );
  const blueprints = parseInputData(inputLines);
  expect(blueprints).toHaveLength(2);
  expect(JSON.stringify(blueprints)).toBe(
    '[{"blueprintNumber":1,' +
      '"oreRobotBOM":{"ore":4,"clay":0,"obsidian":0},' +
      '"clayRobotBOM":{"ore":2,"clay":0,"obsidian":0},' +
      '"obsidianRobotBOM":{"ore":3,"clay":14,"obsidian":0},' +
      '"geodeRobotBOM":{"ore":2,"clay":0,"obsidian":7}},' +
      '{"blueprintNumber":2,' +
      '"oreRobotBOM":{"ore":2,"clay":0,"obsidian":0},' +
      '"clayRobotBOM":{"ore":3,"clay":0,"obsidian":0},' +
      '"obsidianRobotBOM":{"ore":3,"clay":8,"obsidian":0},' +
      '"geodeRobotBOM":{"ore":3,"clay":0,"obsidian":12}}]'
  );
});

test("calcGeodesOpened - example data", () => {
  const inputLines = loadDataFrom(
    "./src/day19/notEnoughMinerals.exampledata.txt"
  );
  const blueprints = parseInputData(inputLines);
  const robotConstructionOrder: RobotType[] = [
    "Clay",
    "Clay",
    "Clay",
    "Obsidian",
    "Clay",
    "Obsidian",
    "Geode",
    "Geode",
  ];
  const geodesOpened = calcGeodesOpened(
    blueprints[0],
    robotConstructionOrder,
    24
  );
  expect(geodesOpened).toBe(9);
});

test("calcRobotBuildPlan", () => {
  const inputLines = loadDataFrom(
    "./src/day19/notEnoughMinerals.exampledata.txt"
  );
  const blueprints = parseInputData(inputLines);

  const actualPlan1 = calcRobotBuildPlan(blueprints[0]);
  const geodesOpened1 = calcGeodesOpened(blueprints[0], actualPlan1, 24, true);
  expect(geodesOpened1).toBe(9);
  const expectedRobotConstructionOrder: RobotType[] = [
    "Clay",
    "Clay",
    "Clay",
    "Obsidian",
    "Clay",
    "Obsidian",
    "Geode",
    "Geode",
  ];
  expect(actualPlan1).toStrictEqual(expectedRobotConstructionOrder);

  const actualPlan2 = calcRobotBuildPlan(blueprints[1]);
  const geodesOpened2 = calcGeodesOpened(blueprints[1], actualPlan2, 24);

  /*
  [
  "Ore",
  "Ore",
  "Clay",
  "Clay",
  "Clay",
  "Clay",
  "Clay",
  "Obsidian",
  "Obsidian",
  "Obsidian",
  "Obsidian",
  "Obsidian",
  "Geode",
  "Obsidian",
  "Geode",
  "Geode",
]
  */
  expect(geodesOpened2).toBe(12);
});

test("Score - example data", () => {
  const inputLines = loadDataFrom(
    "./src/day19/notEnoughMinerals.exampledata.txt"
  );
  const blueprints = parseInputData(inputLines);
  const score = scoreBluePrints(blueprints, 24);
  expect(score).toBe(33);
});

test("Score - puzzle data", () => {
  const inputLines = loadDataFrom(
    "./src/day19/notEnoughMinerals.puzzledata.txt"
  );
  const blueprints = parseInputData(inputLines);
  const score = scoreBluePrints(blueprints, 24, true);
  expect(score).toBe(1346);
});

test("Part 2 - puzzle data", () => {
  const inputLines = loadDataFrom(
    "./src/day19/notEnoughMinerals.puzzledata.txt"
  );
  const blueprints = parseInputData(inputLines);
  const buildPlan1 = calcRobotBuildPlan(blueprints[0], 32);
  const geodesOpened1 = calcGeodesOpened(blueprints[0], buildPlan1, 32);
  const buildPlan2 = calcRobotBuildPlan(blueprints[1], 32);
  const geodesOpened2 = calcGeodesOpened(blueprints[1], buildPlan2, 32);
  const buildPlan3 = calcRobotBuildPlan(blueprints[2], 32);
  const geodesOpened3 = calcGeodesOpened(blueprints[2], buildPlan3, 32);
  const score = geodesOpened1 * geodesOpened2 * geodesOpened3;
  expect(score).not.toBe(0);
  expect(score).toBe(7644);
});

test("Bug hunt", () => {
  const inputLines = loadDataFrom(
    "./src/day19/notEnoughMinerals.puzzledata.txt"
  );
  const blueprints = parseInputData(inputLines);
  const expectedPlan: RobotType[] = [
    "Ore",
    "Clay",
    "Clay",
    "Clay",
    "Clay",
    "Clay",
    "Clay",
    "Clay",
    "Obsidian",
    "Clay",
    "Obsidian",
    "Clay",
    "Obsidian",
    "Obsidian",
    "Geode",
    "Obsidian",
    "Geode",
    "Geode",
  ];
  expect(calcGeodesOpened(blueprints[23], expectedPlan, 24)).toBe(9);

  const plan = calcRobotBuildPlan(blueprints[23]);
  expect(plan).toStrictEqual(expectedPlan);
  const geodesOpened = calcGeodesOpened(blueprints[23], plan, 24);
  expect(geodesOpened).toBe(9);
});

test("nextStateIfBuildRobot", () => {
  const inputLines = loadDataFrom(
    "./src/day19/notEnoughMinerals.puzzledata.txt"
  );
  const blueprints = parseInputData(inputLines);

  const initialState: MiningState = {
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
  let nextState = nextStateIfBuildRobot("Ore", blueprints[23], initialState);
  let expectedState: MiningState = {
    time: 4,
    oreRobotCount: 2,
    clayRobotCount: 0,
    obsidianRobotCount: 0,
    geodeRobotCount: 0,

    currentOreCount: 1,
    currentClayCount: 0,
    currentObsidianCount: 0,
    currentGeodeCount: 0,

    robotBuildOrder: ["Ore"],
  };
  expect(nextState).toStrictEqual<MiningState>(expectedState);
  nextState = nextStateIfBuildRobot("Clay", blueprints[23], nextState);
  expectedState = {
    time: 6,
    oreRobotCount: 2,
    clayRobotCount: 1,
    obsidianRobotCount: 0,
    geodeRobotCount: 0,

    currentOreCount: 3,
    currentClayCount: 0,
    currentObsidianCount: 0,
    currentGeodeCount: 0,

    robotBuildOrder: ["Ore", "Clay"],
  };
  expect(nextState).toStrictEqual<MiningState>(expectedState);
  nextState = nextStateIfBuildRobot("Clay", blueprints[23], nextState);
  expectedState = {
    time: 7,
    oreRobotCount: 2,
    clayRobotCount: 2,
    obsidianRobotCount: 0,
    geodeRobotCount: 0,

    currentOreCount: 3,
    currentClayCount: 1,
    currentObsidianCount: 0,
    currentGeodeCount: 0,

    robotBuildOrder: ["Ore", "Clay", "Clay"],
  };
  expect(nextState).toStrictEqual<MiningState>(expectedState);
  nextState = nextStateIfBuildRobot("Clay", blueprints[23], nextState);
  expectedState = {
    time: 8,
    oreRobotCount: 2,
    clayRobotCount: 3,
    obsidianRobotCount: 0,
    geodeRobotCount: 0,

    currentOreCount: 3,
    currentClayCount: 3,
    currentObsidianCount: 0,
    currentGeodeCount: 0,

    robotBuildOrder: ["Ore", "Clay", "Clay", "Clay"],
  };
  expect(nextState).toStrictEqual<MiningState>(expectedState);

  const minute12State: MiningState = {
    time: 12,
    oreRobotCount: 2,
    clayRobotCount: 7,
    obsidianRobotCount: 0,
    geodeRobotCount: 0,

    currentOreCount: 3,
    currentClayCount: 21,
    currentObsidianCount: 0,
    currentGeodeCount: 0,

    robotBuildOrder: [],
  };
  nextState = nextStateIfBuildRobot("Obsidian", blueprints[23], minute12State);
  expectedState = {
    time: 13,
    oreRobotCount: 2,
    clayRobotCount: 7,
    obsidianRobotCount: 1,
    geodeRobotCount: 0,

    currentOreCount: 3,
    currentClayCount: 11,
    currentObsidianCount: 0,
    currentGeodeCount: 0,

    robotBuildOrder: ["Obsidian"],
  };
  expect(nextState).toStrictEqual<MiningState>(expectedState);

  /*
== Minute 20 ==
**Spend 2 ore and 17 clay to start building an obsidian-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 5 ore.
9 clay-collecting robots collect 9 clay; you now have 11 clay.
4 obsidian-collecting robots collect 4 obsidian; you now have 10 obsidian.
1 geode-cracking robot cracks 1 geode; you now have 1 open geode.
The new obsidian-collecting robot is ready; you now have 5 of them.

== Minute 22 ==
2 ore-collecting robots collect 2 ore; you now have 7 ore.
9 clay-collecting robots collect 9 clay; you now have 29 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 10 obsidian.
2 geode-cracking robots crack 2 geodes; you now have 4 open geodes.

== Minute 23 ==
**Spend 2 ore and 10 obsidian to start building a geode-cracking robot.**
2 ore-collecting robots collect 2 ore; you now have 7 ore.
9 clay-collecting robots collect 9 clay; you now have 38 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 5 obsidian.
2 geode-cracking robots crack 2 geodes; you now have 6 open geodes.
The new geode-cracking robot is ready; you now have 3 of them.
  */
  const minute21State: MiningState = {
    time: 21,
    oreRobotCount: 2,
    clayRobotCount: 9,
    obsidianRobotCount: 5,
    geodeRobotCount: 1,

    currentOreCount: 5,
    currentClayCount: 11,
    currentObsidianCount: 10,
    currentGeodeCount: 1,

    robotBuildOrder: [],
  };
  nextState = nextStateIfBuildRobot("Geode", blueprints[23], minute21State);
  nextState = nextStateIfBuildRobot("Geode", blueprints[23], nextState);
  expectedState = {
    time: 24,
    oreRobotCount: 2,
    clayRobotCount: 9,
    obsidianRobotCount: 5,
    geodeRobotCount: 3,

    currentOreCount: 7,
    currentClayCount: 38,
    currentObsidianCount: 5,
    currentGeodeCount: 6,

    robotBuildOrder: ["Geode", "Geode"],
  };
  expect(nextState).toStrictEqual<MiningState>(expectedState);

  /*
  == Minute 1 ==
1 ore-collecting robot collects 1 ore; you now have 1 ore.

== Minute 2 ==
1 ore-collecting robot collects 1 ore; you now have 2 ore.

== Minute 3 ==
**Spend 2 ore to start building a ore-collecting robot.**
1 ore-collecting robot collects 1 ore; you now have 1 ore.
The new ore-collecting robot is ready; you now have 2 of them.

== Minute 4 ==
2 ore-collecting robots collect 2 ore; you now have 3 ore.

== Minute 5 ==
**Spend 2 ore to start building a clay-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
The new clay-collecting robot is ready; you now have 1 of them.

== Minute 6 ==
**Spend 2 ore to start building a clay-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
1 clay-collecting robot collects 1 clay; you now have 1 clay.
The new clay-collecting robot is ready; you now have 2 of them.

== Minute 7 ==
**Spend 2 ore to start building a clay-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
2 clay-collecting robots collect 2 clay; you now have 3 clay.
The new clay-collecting robot is ready; you now have 3 of them.

== Minute 8 ==
**Spend 2 ore to start building a clay-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
3 clay-collecting robots collect 3 clay; you now have 6 clay.
The new clay-collecting robot is ready; you now have 4 of them.

== Minute 9 ==
**Spend 2 ore to start building a clay-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
4 clay-collecting robots collect 4 clay; you now have 10 clay.
The new clay-collecting robot is ready; you now have 5 of them.

== Minute 10 ==
**Spend 2 ore to start building a clay-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
5 clay-collecting robots collect 5 clay; you now have 15 clay.
The new clay-collecting robot is ready; you now have 6 of them.

== Minute 11 ==
**Spend 2 ore to start building a clay-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
6 clay-collecting robots collect 6 clay; you now have 21 clay.
The new clay-collecting robot is ready; you now have 7 of them.

== Minute 12 ==
**Spend 2 ore and 17 clay to start building an obsidian-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
7 clay-collecting robots collect 7 clay; you now have 11 clay.
The new obsidian-collecting robot is ready; you now have 1 of them.

== Minute 13 ==
**Spend 2 ore to start building a clay-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
7 clay-collecting robots collect 7 clay; you now have 18 clay.
1 obsidian-collecting robot collects 1 obsidian; you now have 1 obsidian.
The new clay-collecting robot is ready; you now have 8 of them.

== Minute 14 ==
**Spend 2 ore and 17 clay to start building an obsidian-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
8 clay-collecting robots collect 8 clay; you now have 9 clay.
1 obsidian-collecting robot collects 1 obsidian; you now have 2 obsidian.
The new obsidian-collecting robot is ready; you now have 2 of them.

== Minute 15 ==
**Spend 2 ore to start building a clay-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
8 clay-collecting robots collect 8 clay; you now have 17 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 4 obsidian.
The new clay-collecting robot is ready; you now have 9 of them.

== Minute 16 ==
**Spend 2 ore and 17 clay to start building an obsidian-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 3 ore.
9 clay-collecting robots collect 9 clay; you now have 9 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 6 obsidian.
The new obsidian-collecting robot is ready; you now have 3 of them.

== Minute 17 ==
2 ore-collecting robots collect 2 ore; you now have 5 ore.
9 clay-collecting robots collect 9 clay; you now have 18 clay.
3 obsidian-collecting robots collect 3 obsidian; you now have 9 obsidian.

== Minute 18 ==
**Spend 2 ore and 17 clay to start building an obsidian-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 5 ore.
9 clay-collecting robots collect 9 clay; you now have 10 clay.
3 obsidian-collecting robots collect 3 obsidian; you now have 12 obsidian.
The new obsidian-collecting robot is ready; you now have 4 of them.

== Minute 19 ==
**Spend 2 ore and 10 obsidian to start building a geode-cracking robot.**
2 ore-collecting robots collect 2 ore; you now have 5 ore.
9 clay-collecting robots collect 9 clay; you now have 19 clay.
4 obsidian-collecting robots collect 4 obsidian; you now have 6 obsidian.
The new geode-cracking robot is ready; you now have 1 of them.

== Minute 20 ==
**Spend 2 ore and 17 clay to start building an obsidian-collecting robot.**
2 ore-collecting robots collect 2 ore; you now have 5 ore.
9 clay-collecting robots collect 9 clay; you now have 11 clay.
4 obsidian-collecting robots collect 4 obsidian; you now have 10 obsidian.
1 geode-cracking robot cracks 1 geode; you now have 1 open geode.
The new obsidian-collecting robot is ready; you now have 5 of them.

== Minute 21 ==
**Spend 2 ore and 10 obsidian to start building a geode-cracking robot.**
2 ore-collecting robots collect 2 ore; you now have 5 ore.
9 clay-collecting robots collect 9 clay; you now have 20 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 5 obsidian.
1 geode-cracking robot cracks 1 geode; you now have 2 open geodes.
The new geode-cracking robot is ready; you now have 2 of them.

== Minute 22 ==
2 ore-collecting robots collect 2 ore; you now have 7 ore.
9 clay-collecting robots collect 9 clay; you now have 29 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 10 obsidian.
2 geode-cracking robots crack 2 geodes; you now have 4 open geodes.

== Minute 23 ==
**Spend 2 ore and 10 obsidian to start building a geode-cracking robot.**
2 ore-collecting robots collect 2 ore; you now have 7 ore.
9 clay-collecting robots collect 9 clay; you now have 38 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 5 obsidian.
2 geode-cracking robots crack 2 geodes; you now have 6 open geodes.
The new geode-cracking robot is ready; you now have 3 of them.

== Minute 24 ==
2 ore-collecting robots collect 2 ore; you now have 9 ore.
9 clay-collecting robots collect 9 clay; you now have 47 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 10 obsidian.
3 geode-cracking robots crack 3 geodes; you now have 9 open geodes.

  */
});
