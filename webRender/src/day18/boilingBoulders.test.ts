import { loadDataFrom } from "../textFileReader";
import type { CubeLocation } from "./boilingBoulders";
import {
  calcSurfaceAreaOfShape as calcSurfaceAreaOfShape,
  calcExternalSurfaceAreaOfShape,
  parseInputData,
} from "./boilingBoulders";

let exampleCubes: CubeLocation[] = [];
let puzzleCubes: CubeLocation[] = [];

beforeEach(() => {
  exampleCubes = parseInputData(
    loadDataFrom("./src/day18/boilingBoulders.exampledata.txt")
  );
  puzzleCubes = parseInputData(
    loadDataFrom("./src/day18/boilingBoulders.puzzledata.txt")
  );
});

test("Shape surface area - example data", () => {
  const surfaceArea = calcSurfaceAreaOfShape(exampleCubes);
  expect(surfaceArea).toBe(64);
});

test("Shape surface area - puzzle data", () => {
  const surfaceArea = calcSurfaceAreaOfShape(puzzleCubes);
  expect(surfaceArea).toBe(3496);
});

test("Shape surface area minus voids - example data", () => {
  const surfaceArea = calcExternalSurfaceAreaOfShape(exampleCubes);

  expect(surfaceArea).toBe(58);
});

test("Shape surface area minus voids - puzzle data", () => {
  const surfaceArea = calcExternalSurfaceAreaOfShape(puzzleCubes);
  expect(surfaceArea).not.toBe(3496);
  expect(surfaceArea).toBeGreaterThan(2000);
  expect(surfaceArea).toBe(2064);
});
