import { loadDataFrom } from "../textFileReader";
import {
  ElfLocation,
  findNumRoundsToSpaceOut,
  findProposedMove,
  parseInputData,
  performRound,
  performRounds,
  visualiseElfLocations,
} from "./unstableDiffusion";

test("find proposed location", () => {
  const inputData = [`.....`, `..##.`, `..#..`, `.....`, `..##.`, `.....`];
  const elfLocations = parseInputData(inputData);
  const mapOfElfLocations = new Map<string, ElfLocation>();
  elfLocations.forEach((elfLocation) =>
    mapOfElfLocations.set(JSON.stringify(elfLocation), elfLocation)
  );
  let proposedMove = findProposedMove(
    mapOfElfLocations,
    elfLocations[0],
    "NSWE"
  );
  expect(proposedMove.proposedLocation.x).toBe(elfLocations[0].x);
  expect(proposedMove.proposedLocation.y).toBe(elfLocations[0].y - 1);
  proposedMove = findProposedMove(mapOfElfLocations, elfLocations[1], "NSWE");
  expect(proposedMove.proposedLocation.x).toBe(elfLocations[1].x);
  expect(proposedMove.proposedLocation.y).toBe(elfLocations[1].y - 1);
  proposedMove = findProposedMove(mapOfElfLocations, elfLocations[2], "NSWE");
  expect(proposedMove.proposedLocation.x).toBe(elfLocations[2].x);
  expect(proposedMove.proposedLocation.y).toBe(elfLocations[2].y + 1);
  proposedMove = findProposedMove(mapOfElfLocations, elfLocations[3], "NSWE");
  expect(proposedMove.proposedLocation.x).toBe(elfLocations[3].x);
  expect(proposedMove.proposedLocation.y).toBe(elfLocations[3].y - 1);
  proposedMove = findProposedMove(mapOfElfLocations, elfLocations[4], "NSWE");
  expect(proposedMove.proposedLocation.x).toBe(elfLocations[4].x);
  expect(proposedMove.proposedLocation.y).toBe(elfLocations[4].y - 1);
});

test("VisualiseElfLocations", () => {
  const inputData = loadDataFrom(
    "./src/day23/unstableDiffusion.exampledata.txt"
  );
  const elfLocations = parseInputData(inputData);
  const textMap = visualiseElfLocations(elfLocations);
  expect(textMap.split("\n")).toStrictEqual(inputData);
});

test("Perform round - example data", () => {
  const inputData = loadDataFrom(
    "./src/day23/unstableDiffusion.exampledata.txt"
  );
  const elfLocations = parseInputData(inputData);
  const textMap = visualiseElfLocations(elfLocations);
  expect(textMap.split("\n")).toStrictEqual([
    "....#..",
    "..###.#",
    "#...#.#",
    ".#...##",
    "#.###..",
    "##.#.##",
    ".#..#..",
  ]);
  const elfLocations2 = performRound(elfLocations, "NSWE");
  const textMap2 = visualiseElfLocations(elfLocations2);
  expect(textMap2.split("\n")).toStrictEqual([
    ".....#...",
    "...#...#.",
    ".#..#.#..",
    ".....#..#",
    "..#.#.##.",
    "#..#.#...",
    "#.#.#.##.",
    ".........",
    "..#..#...",
  ]);

  const elfLocations3 = performRound(elfLocations2, "SWEN");
  const textMap3 = visualiseElfLocations(elfLocations3);
  expect(textMap3.split("\n")).toStrictEqual([
    "......#....",
    "...#.....#.",
    "..#..#.#...",
    "......#...#",
    "..#..#.#...",
    "#...#.#.#..",
    "...........",
    ".#.#.#.##..",
    "...#..#....",
  ]);
});

test("Perform 10 rounds - example data", () => {
  const inputData = loadDataFrom(
    "./src/day23/unstableDiffusion.exampledata.txt"
  );
  const elfLocations = parseInputData(inputData);
  const textMap = visualiseElfLocations(elfLocations);
  expect(textMap.split("\n")).toStrictEqual([
    "....#..",
    "..###.#",
    "#...#.#",
    ".#...##",
    "#.###..",
    "##.#.##",
    ".#..#..",
  ]);
  const elfLocations10 = performRounds(elfLocations, 10);
  const textMap10 = visualiseElfLocations(elfLocations10);
  expect(textMap10.split("\n")).toStrictEqual([
    "......#.....",
    "..........#.",
    ".#.#..#.....",
    ".....#......",
    "..#.....#..#",
    "#......##...",
    "....##......",
    ".#........#.",
    "...#.#..#...",
    "............",
    "...#..#..#..",
  ]);

  const countOfEmptySpaces = [...textMap10].filter(
    (value) => value == "."
  ).length;
  expect(countOfEmptySpaces).toBe(110);
});

test("Perform 10 rounds - puzzle data", () => {
  const inputData = loadDataFrom(
    "./src/day23/unstableDiffusion.puzzledata.txt"
  );
  const elfLocations = parseInputData(inputData);

  const elfLocations10 = performRounds(elfLocations, 10);
  const textMap10 = visualiseElfLocations(elfLocations10);

  const countOfEmptySpaces = [...textMap10].filter(
    (value) => value == "."
  ).length;
  expect(countOfEmptySpaces).toBe(4091);
});

// findNumRoundsToSpaceOut

test("Number of rounds to space out - example data", () => {
  const inputData = loadDataFrom(
    "./src/day23/unstableDiffusion.exampledata.txt"
  );
  const elfLocations = parseInputData(inputData);

  const numRoundsToSpaceOut = findNumRoundsToSpaceOut(elfLocations);

  expect(numRoundsToSpaceOut).toBe(20);
});

test("Number of rounds to space out - puzzle data", () => {
  const inputData = loadDataFrom(
    "./src/day23/unstableDiffusion.puzzledata.txt"
  );
  const elfLocations = parseInputData(inputData);

  const numRoundsToSpaceOut = findNumRoundsToSpaceOut(elfLocations);

  expect(numRoundsToSpaceOut).toBe(1036);
});
