import { loadDataFrom } from "../textFileReader";
import {
  TerrainMap,
  parseTerrainMap,
  routeFromRouteMap,
  dijkstrasAlgorithm,
  buildRouteMap,
} from "./hillClimbing";

test("Parsing example data", () => {
  const inputData = loadDataFrom("./src/day12/hillClimbing.exampledata.txt");
  const terrainMap: TerrainMap = parseTerrainMap(inputData);

  expect(terrainMap.start).toStrictEqual([0, 0]);
  expect(terrainMap.end).toStrictEqual([2, 5]);
  expect(JSON.stringify(terrainMap.map)).toBe(
    `[[-1,0,1,16,15,14,13,12],[0,1,2,17,24,23,23,11],[0,2,2,18,25,-2,23,10],[0,2,2,19,20,21,22,9],[0,1,3,4,5,6,7,8]]`
  );

  const solutionRouteMapData = loadDataFrom(
    "./src/day12/hillClimbing.exampleRouteMap.txt"
  );
  const solutionRouteMap = routeFromRouteMap(solutionRouteMapData, [0, 0]);
  const expectedRouteMap =
    "[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[3,7],[2,7],[1,7],[0,7],[0,6],[0,5],[0,4],[0,3],[1,3],[2,3],[3,3],[3,4],[3,5],[3,6],[2,6],[1,6],[1,5],[1,4],[2,4]]";
  expect(JSON.stringify(solutionRouteMap)).toBe(expectedRouteMap);
  expect(solutionRouteMap.length).toBe(31);

  const routeMapPicture: string = buildRouteMap(solutionRouteMap, terrainMap);
  const expectedRouteMapPicture = `v..v<<<<
>v.vv<<^
.>vv>E^^
..v>>>^^
..>>>>>^`;
  expect(routeMapPicture).toBe(expectedRouteMapPicture);
  //   const shortestRoute: [number, number][] = findShortestRoute(terrainMap);
  //   const lengthOfShortestRoute = shortestRoute.length;

  //   expect(lengthOfShortestRoute).toBe(31);
});

test("Test shortest route algorithm - example data", () => {
  const inputData = loadDataFrom("./src/day12/hillClimbing.exampledata.txt");
  const terrainMap: TerrainMap = parseTerrainMap(inputData);

  const shortestRoute: [number, number][] = dijkstrasAlgorithm(terrainMap);
  const lengthOfShortestRoute = shortestRoute.length;

  expect(lengthOfShortestRoute).toBe(31);

  //   const routeMapPicture: string = buildRouteMap(shortestRoute, terrainMap);
  //   const expectedRouteMapPicture = `v..v<<<<
  // >v.vv<<^
  // .>vv>E^^
  // ..v>>>^^
  // ..>>>>>^`;
  //   expect(routeMapPicture).toBe(expectedRouteMapPicture);
});

test("Test shortest route algorithm - input data", () => {
  const inputData = loadDataFrom("./src/day12/hillClimbing.data.txt");
  const terrainMap: TerrainMap = parseTerrainMap(inputData);

  const shortestRoute: [number, number][] = dijkstrasAlgorithm(terrainMap);
  const lengthOfShortestRoute = shortestRoute.length;

  expect(lengthOfShortestRoute).toBe(380);

  //   const routeMapPicture: string = buildRouteMap(shortestRoute, terrainMap);
  //   const expectedRouteMapPicture = `v..v<<<<
  // >v.vv<<^
  // .>vv>E^^
  // ..v>>>^^
  // ..>>>>>^`;
  //   expect(routeMapPicture).toBe(expectedRouteMapPicture);
});

test("Best start location - example data", () => {
  const inputData = loadDataFrom("./src/day12/hillClimbing.exampledata.txt");
  const terrainMap: TerrainMap = parseTerrainMap(inputData);

  // Find all positions of height zero adjacent to the start point.
  const [startRow, startColumn] = terrainMap.start;

  let shortestPath = Number.MAX_SAFE_INTEGER;
  terrainMap.map[terrainMap.start[0]][terrainMap.start[1]] = 0;
  for (let rowIndex = 0; rowIndex < terrainMap.map.length; rowIndex++) {
    const terrainMapToTest: TerrainMap = {
      start: [rowIndex, terrainMap.start[1]],
      end: terrainMap.end,
      map: terrainMap.map,
    };

    const shortestRoute: [number, number][] =
      dijkstrasAlgorithm(terrainMapToTest);
    shortestPath = Math.min(shortestPath, shortestRoute.length);
  }

  expect(shortestPath).toBe(29);
});

// test("Best start location - input data", () => {
//   const inputData = loadDataFrom("./src/day12/hillClimbing.data.txt");
//   const terrainMap: TerrainMap = parseTerrainMap(inputData);

//   // Find all positions of height zero adjacent to the start point.
//   const [startRow, startColumn] = terrainMap.start;

//   let shortestPath = Number.MAX_SAFE_INTEGER;
//   terrainMap.map[terrainMap.start[0]][terrainMap.start[1]] = 0;
//   for (let rowIndex = 0; rowIndex < terrainMap.map.length; rowIndex++) {
//     const terrainMapToTest: TerrainMap = {
//       start: [rowIndex, terrainMap.start[1]],
//       end: terrainMap.end,
//       map: terrainMap.map,
//     };

//     const shortestRoute: [number, number][] =
//       dijkstrasAlgorithm(terrainMapToTest);
//     shortestPath = Math.min(shortestPath, shortestRoute.length);
//   }

//   expect(shortestPath).toBe(375);
// });
