import { loadDataFrom } from "../textFileReader";
import {
  advanceBlizzards,
  drawMap,
  findShortestRoute,
  parseInputData,
  visualizeRouteFinding,
} from "./blizzardBasin";

test("parseInputData", () => {
  const inputData = loadDataFrom("./src/day24/blizzardBasin.exampledata.txt");
  const blizzardMap = parseInputData(inputData);

  expect(blizzardMap.width).toBe(6);
  expect(blizzardMap.height).toBe(4);
  expect(blizzardMap.allBlizzards.length).toBe(19);
  expect(blizzardMap.allBlizzards[0].direction).toBe(">");
  expect(blizzardMap.allBlizzards[0].x).toBe(1);
  expect(blizzardMap.allBlizzards[0].y).toBe(1);
  expect(blizzardMap.allBlizzards[17].direction).toBe("^");
  expect(blizzardMap.allBlizzards[17].x).toBe(5);
  expect(blizzardMap.allBlizzards[17].y).toBe(4);
});

test("drawMap", () => {
  const inputData = loadDataFrom("./src/day24/blizzardBasin.exampledata.txt");
  const blizzardMap = parseInputData(inputData);
  const drawnMap = drawMap(blizzardMap);
  expect(drawnMap).toBe(`#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`);
});

test("advanceBlizzards", () => {
  const inputData = loadDataFrom("./src/day24/blizzardBasin.exampledata.txt");
  const blizzardMap = parseInputData(inputData);
  const blizzardMap2 = advanceBlizzards(blizzardMap);
  const drawnMap = drawMap(blizzardMap2);
  expect(drawnMap).toBe(`#.######
#.>3.<.#
#<..<<.#
#>2.22.#
#>v..^<#
######.#`);
});

test("shortest route - example data", () => {
  const inputData = loadDataFrom("./src/day24/blizzardBasin.exampledata.txt");
  const blizzardMap = parseInputData(inputData);
  const routeLength = findShortestRoute(blizzardMap);
  expect(routeLength).toBe(18);
});

test("shortest route - puzzle data", () => {
  const inputData = loadDataFrom("./src/day24/blizzardBasin.puzzledata.txt");
  const blizzardMap = parseInputData(inputData);
  const routeLength = findShortestRoute(
    blizzardMap,
    { x: 1, y: 0 },
    {
      x: blizzardMap.width,
      y: blizzardMap.height + 1,
    },
    (currentBlizzardMap, time, possibleLocations) => {
      if (time % 10 == 0 || time == 294 || time == 295) {
        const map = visualizeRouteFinding(
          currentBlizzardMap,
          time,
          possibleLocations
        );
        console.log(map);
        console.log("\n");
      }
    }
  );
  expect(routeLength).toBe(295);
});

test("shortest route while going back for lost snacks - example data", () => {
  const inputData = loadDataFrom("./src/day24/blizzardBasin.exampledata.txt");
  const blizzardMap = parseInputData(inputData);
  let latestBlizzardMap = blizzardMap;
  let totalRouteLength = 0;

  // Out
  totalRouteLength += findShortestRoute(
    latestBlizzardMap,
    { x: 1, y: 0 },
    {
      x: blizzardMap.width,
      y: blizzardMap.height + 1,
    },
    (currentBlizzardMap, _time, _possibleLocations) =>
      (latestBlizzardMap = currentBlizzardMap)
  );

  // Forgot snacks - go back to the start
  totalRouteLength += findShortestRoute(
    latestBlizzardMap,
    {
      x: blizzardMap.width,
      y: blizzardMap.height + 1,
    },
    { x: 1, y: 0 },
    (currentBlizzardMap, _time, _possibleLocations) =>
      (latestBlizzardMap = currentBlizzardMap)
  );

  // Got snacks - back out again
  totalRouteLength += findShortestRoute(
    latestBlizzardMap,
    { x: 1, y: 0 },
    {
      x: blizzardMap.width,
      y: blizzardMap.height + 1,
    },
    (currentBlizzardMap, _time, _possibleLocations) =>
      (latestBlizzardMap = currentBlizzardMap)
  );

  expect(totalRouteLength).toBe(54);
});

test("shortest route while going back for lost snacks - puzzle data", () => {
  const inputData = loadDataFrom("./src/day24/blizzardBasin.puzzledata.txt");
  const blizzardMap = parseInputData(inputData);
  let latestBlizzardMap = blizzardMap;
  let totalRouteLength = 0;

  // Out
  totalRouteLength += findShortestRoute(
    latestBlizzardMap,
    { x: 1, y: 0 },
    {
      x: blizzardMap.width,
      y: blizzardMap.height + 1,
    },
    (currentBlizzardMap, time, possibleLocations) => {
      latestBlizzardMap = currentBlizzardMap;
      if (time % 10 == 0) {
        const map = visualizeRouteFinding(
          currentBlizzardMap,
          time,
          possibleLocations
        );
        console.log(map);
        console.log("\n");
      }
    }
  );

  // Forgot snacks - go back to the start
  totalRouteLength += findShortestRoute(
    latestBlizzardMap,
    {
      x: blizzardMap.width,
      y: blizzardMap.height + 1,
    },
    { x: 1, y: 0 },
    (currentBlizzardMap, time, possibleLocations) => {
      latestBlizzardMap = currentBlizzardMap;
      if (time % 10 == 0) {
        const map = visualizeRouteFinding(
          currentBlizzardMap,
          time,
          possibleLocations
        );
        console.log(map);
        console.log("\n");
      }
    }
  );

  // Got snacks - back out again
  totalRouteLength += findShortestRoute(
    latestBlizzardMap,
    { x: 1, y: 0 },
    {
      x: blizzardMap.width,
      y: blizzardMap.height + 1,
    },
    (currentBlizzardMap, time, possibleLocations) => {
      latestBlizzardMap = currentBlizzardMap;
      if (time % 10 == 0) {
        const map = visualizeRouteFinding(
          currentBlizzardMap,
          time,
          possibleLocations
        );
        console.log(map);
        console.log("\n");
      }
    }
  );

  expect(totalRouteLength).toBe(851);
});
