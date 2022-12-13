import {
  calorieCountOfTopThreeElves,
  findElfCarryingMostCalories,
  loadDataFrom,
} from "./day01";

test("example data", () => {
  const elfCalorieData = loadDataFrom("./src/day01/day01.exampledata.txt");
  const elfCarryingMostCalories = findElfCarryingMostCalories(elfCalorieData);
  expect(elfCarryingMostCalories.elfNumber).toBe(4);
  expect(elfCarryingMostCalories.calorieCount).toBe(24000);
});

test("real data", () => {
  const elfCalorieData = loadDataFrom("./src/day01/day01.data.txt");
  const elfCarryingMostCalories = findElfCarryingMostCalories(elfCalorieData);
  expect(elfCarryingMostCalories.elfNumber).not.toBe(0);
  expect(elfCarryingMostCalories.calorieCount).not.toBe(0);

  console.log(
    `Elf ${elfCarryingMostCalories.elfNumber} is carrying ${elfCarryingMostCalories.calorieCount} calories.`
  );
});

test("Part 2 - sum of calories held by top three elves", () => {
  const elfCalorieData = loadDataFrom("./src/day01/day01.data.txt");
  const caloriesHeldByTopThreeElves =
    calorieCountOfTopThreeElves(elfCalorieData);
  expect(caloriesHeldByTopThreeElves).not.toBe(0);

  console.log(
    `Top three elves are carrying ${caloriesHeldByTopThreeElves} calories.`
  );
});
