import {
  Action,
  bestActions,
  bestNextValveToOpen,
  bestSubRoute,
  calcRouteValue,
  calcScoringRouteValue,
  CaveAction,
  findAllScoringRoutes,
  findBestRoute,
  generateActionsToOpenValve,
  parseInputData,
  plotRoute,
} from "./elephantsInAVolcano";
import { loadDataFrom } from "../textFileReader";

test("Parse example data", () => {
  const inputData = loadDataFrom(
    "./src/day16/elephantsInAVolcano.exampledata.txt"
  );
  const valves = parseInputData(inputData);
  expect(valves.size).toBe(10);
  expect(JSON.stringify(valves.get("AA"))).toBe(
    '{"id":"AA","flowRate":0,"connectedValveIds":["DD","II","BB"]}'
  );
  expect(JSON.stringify(valves.get("JJ"))).toBe(
    '{"id":"JJ","flowRate":21,"connectedValveIds":["II"]}'
  );
});

test("Value for example route", () => {
  const inputData = loadDataFrom(
    "./src/day16/elephantsInAVolcano.exampledata.txt"
  );
  const valves = parseInputData(inputData);

  const actions: CaveAction[] = [
    [Action.MOVE, "DD"],
    [Action.OPEN, true],
    [Action.MOVE, "CC"],
    [Action.MOVE, "BB"],
    [Action.OPEN, true],
    [Action.MOVE, "AA"],
    [Action.MOVE, "II"],
    [Action.MOVE, "JJ"],
    [Action.OPEN, true],
    [Action.MOVE, "II"],
    [Action.MOVE, "AA"],
    [Action.MOVE, "DD"],
    [Action.MOVE, "EE"],
    [Action.MOVE, "FF"],
    [Action.MOVE, "GG"],
    [Action.MOVE, "HH"],
    [Action.OPEN, true],
    [Action.MOVE, "GG"],
    [Action.MOVE, "FF"],
    [Action.MOVE, "EE"],
    [Action.OPEN, true],
    [Action.MOVE, "DD"],
    [Action.MOVE, "CC"],
    [Action.OPEN, true],
    [Action.NOOP, ""],
    [Action.NOOP, ""],
    [Action.NOOP, ""],
    [Action.NOOP, ""],
    [Action.NOOP, ""],
    [Action.NOOP, ""],
  ];

  const actualRouteValue = calcRouteValue(valves, "AA", actions);
  expect(actualRouteValue).toBe(1651);
});

test("plotRoute - example data JJ to HH", () => {
  const inputData = loadDataFrom(
    "./src/day16/elephantsInAVolcano.exampledata.txt"
  );
  const valves = parseInputData(inputData);

  const actualRoute = plotRoute(valves, "JJ", "HH");
  expect(actualRoute).toStrictEqual([
    "JJ",
    "II",
    "AA",
    "DD",
    "EE",
    "FF",
    "GG",
    "HH",
  ]);
});

test("generateActionsToOpenValve", () => {
  const inputData = loadDataFrom(
    "./src/day16/elephantsInAVolcano.exampledata.txt"
  );
  const valves = parseInputData(inputData);
  const actualActions = generateActionsToOpenValve(valves, "JJ", "HH");
  const expectedActions = [
    [Action.MOVE, "II"],
    [Action.MOVE, "AA"],
    [Action.MOVE, "DD"],
    [Action.MOVE, "EE"],
    [Action.MOVE, "FF"],
    [Action.MOVE, "GG"],
    [Action.MOVE, "HH"],
    [Action.OPEN, true],
  ];
  expect(actualActions).toStrictEqual(expectedActions);
});

xtest("findBestRoute - input data - slow but working", () => {
  const inputData = loadDataFrom("./src/day16/elephantsInAVolcano.data.txt");
  const valves = parseInputData(inputData);

  const bestRoute = findAllScoringRoutes(valves, "AA", 30)[0];
  // ["AA","OQ","PD","TN","KX"]
  const score = calcScoringRouteValue(valves, bestRoute);
  expect(score).not.toBe(1651);
  expect(score).toBe(1796);
});

xtest("findBestRoute - input data - faster but not working", () => {
  const inputData = loadDataFrom("./src/day16/elephantsInAVolcano.data.txt");
  const valves = parseInputData(inputData);

  const [route, _score] = findBestRoute(valves, "AA", 30);
  const score = calcScoringRouteValue(valves, route);
  expect(route).toStrictEqual(["AA", "BC", "OF", "OQ", "BV", "TN", "HR", "PD"]);
  // expect(bestRoute).toStrictEqual(route);
  // console.log(JSON.stringify(bestRoute));
  // ["AA","OQ","PD","TN","KX"]
  expect(score).not.toBe(1651);
  expect(score).toBe(1796);
});

test("findBestRoute - example data", () => {
  const inputData = loadDataFrom(
    "./src/day16/elephantsInAVolcano.exampledata.txt"
  );
  const valves = parseInputData(inputData);
  const [route, _score] = findBestRoute(valves, "AA", 30);
  expect(route).toStrictEqual(["AA", "DD", "BB", "JJ", "HH", "EE", "CC"]);
  const score = calcScoringRouteValue(valves, route);
  expect(score).toBe(1651);
});

test("findBestRoute - bug hunt - example data", () => {
  const inputData = loadDataFrom(
    "./src/day16/elephantsInAVolcano.exampledata.txt"
  );
  const valves = parseInputData(inputData);
  const [route, score] = bestSubRoute(valves, "JJ", ["HH", "CC", "EE"], 30);
  expect(route).toStrictEqual(["JJ", "HH", "EE", "CC"]);
});
