import { loadDataFrom } from "../textFileReader";
import {
  parseCratesTextIntoMoves,
  parseCratesTextIntoStacks,
  performMoves,
  performMovesWithCrateMover9001,
  topCrates,
} from "./crates";

test("parseCratesTextIntoStacks", () => {
  const testData = loadDataFrom("./src/day05/crates.exampledata.txt");
  const cratesAsStacks = parseCratesTextIntoStacks(testData);
  expect(cratesAsStacks).toHaveLength(3);
  expect(cratesAsStacks).toStrictEqual([["Z", "N"], ["M", "C", "D"], ["P"]]);
});

test("parseCratesTextIntoMoves", () => {
  const testData = loadDataFrom("./src/day05/crates.exampledata.txt");
  const moves = parseCratesTextIntoMoves(testData);
  expect(moves).toHaveLength(4);
  expect(moves).toStrictEqual([
    { numberOfCratesToMove: 1, fromStack: 2, toStack: 1 },
    { numberOfCratesToMove: 3, fromStack: 1, toStack: 3 },
    { numberOfCratesToMove: 2, fromStack: 2, toStack: 1 },
    { numberOfCratesToMove: 1, fromStack: 1, toStack: 2 },
  ]);
});

test("performMoves", () => {
  const testData = loadDataFrom("./src/day05/crates.exampledata.txt");
  const cratesAsStacks = parseCratesTextIntoStacks(testData);
  const moves = parseCratesTextIntoMoves(testData);
  const resultOfMoves = performMoves(cratesAsStacks, moves);
  expect(resultOfMoves).toStrictEqual([["C"], ["M"], ["P", "D", "N", "Z"]]);
});

test("topCrates", () => {
  const testData = loadDataFrom("./src/day05/crates.exampledata.txt");
  const cratesAsStacks = parseCratesTextIntoStacks(testData);
  const moves = parseCratesTextIntoMoves(testData);
  const resultOfMoves = performMoves(cratesAsStacks, moves);
  const topCrateValues = topCrates(resultOfMoves);
  expect(topCrateValues).toBe("CMZ");
});

test("topCrates - part 1", () => {
  const testData = loadDataFrom("./src/day05/crates.data.txt");
  const cratesAsStacks = parseCratesTextIntoStacks(testData);
  const moves = parseCratesTextIntoMoves(testData);
  const resultOfMoves = performMoves(cratesAsStacks, moves);
  const topCrateValues = topCrates(resultOfMoves);
  expect(topCrateValues).not.toBe("");

  console.log(`Top crates after move: ${topCrateValues}`);
});

test("topCrates - 9001", () => {
  const testData = loadDataFrom("./src/day05/crates.exampledata.txt");
  const cratesAsStacks = parseCratesTextIntoStacks(testData);
  const moves = parseCratesTextIntoMoves(testData);
  const resultOfMoves = performMovesWithCrateMover9001(cratesAsStacks, moves);
  const topCrateValues = topCrates(resultOfMoves);
  expect(topCrateValues).toBe("MCD");
});

test("topCrates - 9001 - part 2", () => {
  const testData = loadDataFrom("./src/day05/crates.data.txt");
  const cratesAsStacks = parseCratesTextIntoStacks(testData);
  const moves = parseCratesTextIntoMoves(testData);
  const resultOfMoves = performMovesWithCrateMover9001(cratesAsStacks, moves);
  const topCrateValues = topCrates(resultOfMoves);
  expect(topCrateValues).not.toBe("");

  console.log(`Top crates after 9001 move: ${topCrateValues}`);
});
