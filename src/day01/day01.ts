import { assert } from "console";
import * as fs from "fs";

// read data file into data structure
export function loadDataFrom(filePath: string): number[][] {
  const dataBuffer = fs.readFileSync(filePath, "utf-8");
  const dataLines = dataBuffer.split("\n");

  const allElvesInventories: number[][] = [];
  let currentElfInventory: number[] = [];
  dataLines.forEach((value: string) => {
    // blank line is separator
    // write current elf inventory to full set and reset
    const isNewElf = value.length === 0;
    if (isNewElf) {
      if (currentElfInventory.length > 0) {
        allElvesInventories.push(currentElfInventory);
      }
      currentElfInventory = [];
      return;
    }

    // Not a blank line, so parse integer and store
    const calories = Number.parseInt(value);
    currentElfInventory.push(calories);
  });

  return allElvesInventories;
}

// go through data file and find elf with most calories
export function findElfCarryingMostCalories(
  allElvesCalorieCounts: number[][]
): {
  calorieCount: number;
  elfNumber: number;
} {
  const fullCalorieCountPerElf = sumCaloriesHeldByEachElf(
    allElvesCalorieCounts
  );

  let highestValue = 0;
  let highestValueIndex = -1;
  fullCalorieCountPerElf.forEach((elfCaloriesCarried, index) => {
    if (elfCaloriesCarried > highestValue) {
      highestValue = elfCaloriesCarried;
      highestValueIndex = index;
    }
  });

  return { calorieCount: highestValue, elfNumber: highestValueIndex + 1 };
}

function sumCaloriesHeldByEachElf(allElvesCalorieCounts: number[][]) {
  return allElvesCalorieCounts.map((caloriesByItem: number[]) =>
    caloriesByItem.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    )
  );
}

export function calorieCountOfTopThreeElves(
  allElvesCalorieCounts: number[][]
): number {
  const fullCalorieCountPerElf = sumCaloriesHeldByEachElf(
    allElvesCalorieCounts
  );

  fullCalorieCountPerElf.sort((a, b) => b - a);

  assert(
    fullCalorieCountPerElf[0] >
      fullCalorieCountPerElf[fullCalorieCountPerElf.length - 1]
  );

  return (
    fullCalorieCountPerElf[0] +
    fullCalorieCountPerElf[1] +
    fullCalorieCountPerElf[2]
  );
}
