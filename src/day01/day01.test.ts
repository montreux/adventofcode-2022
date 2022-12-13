import { loadDataFrom } from "../textFileReader";
import {
  calorieCountOfTopThreeElves,
  findElfCarryingMostCalories,
  parseInputData,
} from "./day01";

test("example data", () => {
  const inputData = loadDataFrom("./src/day01/day01.exampledata.txt");
  const elfCalorieData = parseInputData(inputData);
  const elfCarryingMostCalories = findElfCarryingMostCalories(elfCalorieData);
  expect(elfCarryingMostCalories.elfNumber).toBe(4);
  expect(elfCarryingMostCalories.calorieCount).toBe(24000);
});

test("real data", () => {
  const inputData = loadDataFrom("./src/day01/day01.data.txt");
  const elfCalorieData = parseInputData(inputData);
  const elfCarryingMostCalories = findElfCarryingMostCalories(elfCalorieData);
  expect(elfCarryingMostCalories.elfNumber).toBe(7);
  expect(elfCarryingMostCalories.calorieCount).toBe(67633);
});

test("Part 2 - sum of calories held by top three elves", () => {
  const inputData = loadDataFrom("./src/day01/day01.data.txt");
  const elfCalorieData = parseInputData(inputData);
  const caloriesHeldByTopThreeElves =
    calorieCountOfTopThreeElves(elfCalorieData);
  expect(caloriesHeldByTopThreeElves).toBe(199628);
});
