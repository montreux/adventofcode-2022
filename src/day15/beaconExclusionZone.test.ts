import { loadDataFrom } from "../textFileReader";
import {
  calcManhattanDistance,
  canBeaconExistAt,
  countOfKnownLocationsBeaconIsNotAt,
  countOfKnownLocationsBeaconIsNotAt2,
  findPossibleBeaconLocation,
  parseInputData,
  rotateModel45,
} from "./beaconExclusionZone";

test("Parse example data", () => {
  const inputData = loadDataFrom(
    "./src/day15/beaconExclusionZone.exampledata.txt"
  );
  const sensorsInfo = parseInputData(inputData);
  expect(sensorsInfo).toHaveLength(14);
  expect(JSON.stringify(sensorsInfo[0])).toBe(
    '{"location":{"x":2,"y":18},"nearestBeacon":{"x":-2,"y":15},"nearestBeaconDistance":7}'
  );
  expect(JSON.stringify(sensorsInfo[13])).toBe(
    '{"location":{"x":20,"y":1},"nearestBeacon":{"x":15,"y":3},"nearestBeaconDistance":7}'
  );
});

test("canBeaconExistAt", () => {
  const sensorInfo = parseInputData([
    "Sensor at x=8, y=7: closest beacon is at x=2, y=10",
  ])[0];
  expect(canBeaconExistAt({ x: 8, y: -3 }, sensorInfo)).toBe(true);
  expect(canBeaconExistAt({ x: 7, y: -2 }, sensorInfo)).toBe(true);
  expect(canBeaconExistAt({ x: 8, y: -2 }, sensorInfo)).toBe(false);
  expect(canBeaconExistAt({ x: 9, y: -2 }, sensorInfo)).toBe(true);

  expect(canBeaconExistAt({ x: -2, y: 7 }, sensorInfo)).toBe(true);
  expect(canBeaconExistAt({ x: -1, y: 7 }, sensorInfo)).toBe(false);
  expect(canBeaconExistAt({ x: 17, y: 7 }, sensorInfo)).toBe(false);
  expect(canBeaconExistAt({ x: 18, y: 7 }, sensorInfo)).toBe(true);
});

test("Count of known beacon locations - example data row 10", () => {
  const inputData = loadDataFrom(
    "./src/day15/beaconExclusionZone.exampledata.txt"
  );
  const sensorsInfo = parseInputData(inputData);
  const actualKnownBeaconLocations = countOfKnownLocationsBeaconIsNotAt2(
    sensorsInfo,
    10
  );
  expect(actualKnownBeaconLocations).toBe(26);
});

test("Count of known beacon locations - input data row 2000000", () => {
  const inputData = loadDataFrom("./src/day15/beaconExclusionZone.data.txt");
  const sensorsInfo = parseInputData(inputData);
  const actualKnownBeaconLocations = countOfKnownLocationsBeaconIsNotAt2(
    sensorsInfo,
    2000000
  );
  expect(actualKnownBeaconLocations).toBe(5100463);
  //4207093
});

test("Find only possible beacon location - example data", () => {
  const inputData = loadDataFrom(
    "./src/day15/beaconExclusionZone.exampledata.txt"
  );
  const sensorsInfo = parseInputData(inputData);

  const expectedBeaconLocationX = 14;
  const expectedBeaconLocationY = 11;

  const beaconLocation = findPossibleBeaconLocation(sensorsInfo);

  expect(beaconLocation).not.toBeUndefined();
  expect(beaconLocation!.x).toBe(expectedBeaconLocationX);
  expect(beaconLocation!.y).toBe(expectedBeaconLocationY);
});

xtest("Find only possible beacon location - real data", () => {
  const inputData = loadDataFrom("./src/day15/beaconExclusionZone.data.txt");
  const sensorsInfo = parseInputData(inputData);

  // Your handheld device indicates that the distress signal is coming from a
  // beacon nearby. The distress beacon is not detected by any sensor, but the
  // distress beacon must have x and y coordinates each no lower than 0 and no
  // larger than 4000000.
  const beaconLocation = findPossibleBeaconLocation(sensorsInfo, 0, 4000000);

  expect(beaconLocation).not.toBeUndefined();
  expect(beaconLocation!.x).toBe(2889465);
  expect(beaconLocation!.y).toBe(3040754);

  // To isolate the distress beacon's signal, you need to determine its tuning
  // frequency, which can be found by multiplying its x coordinate by 4000000
  // and then adding its y coordinate.
  const tuningFrequency = beaconLocation!.x * 4000000 + beaconLocation!.y;
  expect(tuningFrequency).toBe(11557863040754);
});

// test("rotate model 45°", () => {
//   const inputData = loadDataFrom("./src/day15/beaconExclusionZone.data.txt");
//   const sensorsInfo = parseInputData(inputData);
//   const newSensors = rotateModel45(sensorsInfo);
//   for (const sensor of newSensors) {
//     expect(calcManhattanDistance(sensor.location, sensor.nearestBeacon)).toBe(
//       sensor.nearestBeaconDistance
//     );
//   }
//   expect(JSON.stringify(newSensors)).toBe("");
// });
