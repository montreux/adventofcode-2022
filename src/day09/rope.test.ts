import { notDeepEqual } from "assert";
import { loadDataFrom } from "../textFileReader";
import {
  buildRopeModel,
  drawLocationsVisited,
  getUniqueLocationsVisited,
} from "./rope";

// Visits 13 locations
test("locations visited - example data", () => {
  const testData = loadDataFrom("./src/day09/rope.exampleData.txt");
  const ropeModel = buildRopeModel(testData, 2, true);

  const tailLocationsVisited = getUniqueLocationsVisited(
    ropeModel.knotLocations[1]
  );
  expect(tailLocationsVisited).toBe(13);

  console.log(drawLocationsVisited(ropeModel.knotLocations[1]));
  console.log(ropeModel.stateDiagram);
});

test("locations visited - part one data", () => {
  const testData = loadDataFrom("./src/day09/rope.data.txt");
  const ropeModel = buildRopeModel(testData, 2);

  const tailLocationsVisited = getUniqueLocationsVisited(
    ropeModel.knotLocations[1]
  );
  expect(tailLocationsVisited).toBe(6498);

  //   console.log(drawLocationsVisited(ropeModel.tailLocations));
  console.log(`Rope tail visited ${tailLocationsVisited} unique locations`);
});

test("locations visited - part two", () => {
  const testData = loadDataFrom("./src/day09/rope.data.txt");
  const ropeModel = buildRopeModel(testData, 10);

  const tailLocationsVisited = getUniqueLocationsVisited(
    ropeModel.knotLocations[9]
  );
  expect(tailLocationsVisited).not.toBe(0);

  //   console.log(drawLocationsVisited(ropeModel.tailLocations));
  console.log(
    `10th rope tail visited ${tailLocationsVisited} unique locations`
  );
});
