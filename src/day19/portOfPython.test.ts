import { calculateQualityLevel } from "./portOfPython";

test("part 1", () => {
  const pathToPuzzleInput =
    "/Users/johnholcroft/Repositories/adventofcode-2022/src/day19/notEnoughMinerals.puzzledata.txt";
  const qualityLevel = calculateQualityLevel(pathToPuzzleInput);
  expect(qualityLevel).toBe(1346);
});
