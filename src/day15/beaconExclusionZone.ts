import { boolean } from "zod";

type Point = {
  x: number;
  y: number;
};

type SensorInfo = {
  location: Point;
  nearestBeacon: Point;
  nearestBeaconDistance: number;
};

export function parseInputData(inputData: string[]): SensorInfo[] {
  const allSensorInfo: SensorInfo[] = [];

  // Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  const sensorAndBeaconRegex = /x=([-\d]+), y=([-\d]+).*x=([-\d]+), y=([-\d]+)/;

  for (const inputLine of inputData) {
    const match = inputLine.match(sensorAndBeaconRegex);
    if (match) {
      const sensorX = parseInt(match[1]);
      const sensorY = parseInt(match[2]);
      const beaconX = parseInt(match[3]);
      const beaconY = parseInt(match[4]);

      const location = { x: sensorX, y: sensorY };
      const nearestBeacon = { x: beaconX, y: beaconY };
      allSensorInfo.push({
        location: location,
        nearestBeacon: nearestBeacon,
        nearestBeaconDistance: calcManhattanDistance(location, nearestBeacon),
      });
    }
  }

  return allSensorInfo;
}

export function rotateModel45(sensors: SensorInfo[]): SensorInfo[] {
  const beaconZone = findBeaconZone(sensors);
  const center: Point = {
    x: (beaconZone.topLeft.x + beaconZone.bottomRight.x) / 2,
    y: (beaconZone.topLeft.y + beaconZone.bottomRight.y) / 2,
  };

  const newModel = sensors.map((sensor) => {
    const newLocation = rotate45(sensor.location, center);
    const newBeaconLocation = rotate45(sensor.nearestBeacon, center);
    return {
      location: newLocation,
      nearestBeacon: newBeaconLocation,
      nearestBeaconDistance: sensor.nearestBeaconDistance,
    } as SensorInfo;
  });
  return newModel;
}

function rotate45(point: Point, center: Point): Point {
  const newX =
    Math.SQRT1_2 * (point.x - center.x) -
    Math.SQRT1_2 * (point.y - center.y) +
    center.x;
  const newY =
    Math.SQRT1_2 * (point.x - center.x) +
    Math.SQRT1_2 * (point.y - center.y) +
    center.y;
  return { x: newX, y: newY };
}

export function canBeaconExistAt(
  possibleBeaconLocation: Point,
  forSensor: SensorInfo
): boolean {
  // Work out 'manhatten distance' for the possible beacon location,
  // and the known nearest beacon for the sensor.
  const possibleBeaconDistance = calcManhattanDistance(
    forSensor.location,
    possibleBeaconLocation
  );

  // If the distance of the possible beacon location is greater than the known
  // nearest beacon distance, then it could exist there.
  const couldBeaconExistAtLocation =
    possibleBeaconDistance > forSensor.nearestBeaconDistance;
  return couldBeaconExistAtLocation;
}

/**
 * The Manhattan distance as the sum of absolute differences between two points.
 */
export function calcManhattanDistance(a: Point, b: Point): number {
  const manhattanDistance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  return manhattanDistance;
}

function findMaxNearestBeaconDistance(sensors: SensorInfo[]): number {
  let maxDistance = -1;
  sensors.forEach(
    (sensor) =>
      (maxDistance = Math.max(maxDistance, sensor.nearestBeaconDistance))
  );

  return maxDistance;
}

type SearchZone = {
  topLeft: Point;
  bottomRight: Point;
};

export function findSensorZone(sensors: SensorInfo[]): SearchZone {
  const maxDistance = findMaxNearestBeaconDistance(sensors);
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  for (const sensor of sensors) {
    minX = Math.min(minX, sensor.location.x - maxDistance);
    minY = Math.min(minY, sensor.location.y - maxDistance);
    maxX = Math.max(maxX, sensor.location.x + maxDistance);
    maxY = Math.max(maxY, sensor.location.y + maxDistance);
  }

  return { topLeft: { x: minX, y: minY }, bottomRight: { x: maxX, y: maxY } };
}

export function findBeaconZone(sensors: SensorInfo[]): SearchZone {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  for (const sensor of sensors) {
    minX = Math.min(minX, sensor.nearestBeacon.x);
    minY = Math.min(minY, sensor.nearestBeacon.y);
    maxX = Math.max(maxX, sensor.nearestBeacon.x);
    maxY = Math.max(maxY, sensor.nearestBeacon.y);
  }

  return { topLeft: { x: minX, y: minY }, bottomRight: { x: maxX, y: maxY } };
}

export function buildArrayOfUnknownPossibleBeaconLocations(
  sensors: SensorInfo[],
  rowIndex: number
): Point[] {
  const possibleLocations: Point[] = [];
  const { topLeft, bottomRight } = findSensorZone(sensors);
  for (
    let columnIndex = topLeft.x;
    columnIndex <= bottomRight.x;
    columnIndex++
  ) {
    possibleLocations.push({ x: columnIndex, y: rowIndex });
  }

  return possibleLocations;
}

export function countOfKnownLocationsBeaconIsNotAt(
  sensors: SensorInfo[],
  rowIndex: number
): number {
  const sensorsInRange = findSensorsInRange(sensors, rowIndex);
  const unknownPossibleBeaconLocations =
    buildArrayOfUnknownPossibleBeaconLocations(sensorsInRange, rowIndex);

  const knownLocationsBeaconsNotPresent = unknownPossibleBeaconLocations.filter(
    (possibleLocation) => {
      const sensorThatProvesBeaconCanNotBePresent = sensors.find(
        (sensor) =>
          !canBeaconExistAt(possibleLocation, sensor) &&
          !isBeaconLocation(possibleLocation, sensor)
      );
      return sensorThatProvesBeaconCanNotBePresent !== undefined;
    }
  );

  return knownLocationsBeaconsNotPresent.length;
}

export function countOfKnownLocationsBeaconIsNotAt2(
  sensors: SensorInfo[],
  rowIndex: number
): number {
  const knownRanges = sensors
    .map((sensor) => findRangeBeaconLocationKnown(sensor, rowIndex))
    .filter((range) => range.isValid);
  knownRanges.sort((a, b) => a.startX - b.startX);
  const mergedRanges: RowRange[] = [];
  for (const range of knownRanges) {
    const rangeToExtend = mergedRanges.find((existingRange) =>
      doRangesOverlap(range, existingRange)
    );
    if (rangeToExtend) {
      // Found an overlapping range. Make it bigger.
      rangeToExtend.startX = Math.min(rangeToExtend.startX, range.startX);
      rangeToExtend.endX = Math.max(rangeToExtend.endX, range.endX);
    } else {
      // No overlapping range found. Add this range.
      mergedRanges.push(range);
    }
  }

  const rangeLengths = mergedRanges.map(
    (range) => range.endX - range.startX + 1
  );

  const totalKnownLocations = rangeLengths.reduce((a, b) => a + b);

  const allBeaconXPositionsInThisRow = sensors
    .filter((sensor) => sensor.nearestBeacon.y === rowIndex)
    .map((sensor) => sensor.nearestBeacon.x);
  const uniqueBeaconXPositions = new Set(allBeaconXPositionsInThisRow);

  const numberOfBeaconsInRow = uniqueBeaconXPositions.size;

  const knownLocationsWithoutBeacons =
    totalKnownLocations - numberOfBeaconsInRow;

  return knownLocationsWithoutBeacons;
}

function doRangesOverlap(a: RowRange, b: RowRange): boolean {
  const startsInRange = a.startX >= b.startX && a.startX <= b.endX;
  const endsInRange = a.endX >= b.startX && a.endX <= b.endX;

  return startsInRange || endsInRange;
}

type RowRange = {
  startX: number;
  endX: number;
  isValid: boolean;
};

function findRangeBeaconLocationKnown(
  sensor: SensorInfo,
  rowIndex: number
): RowRange {
  const sensorBeaconDistance = calcManhattanDistance(
    sensor.location,
    sensor.nearestBeacon
  );
  const yDistance = Math.abs(rowIndex - sensor.location.y);
  const maxPossibleXDistance = sensorBeaconDistance - yDistance;

  return {
    startX: sensor.location.x - maxPossibleXDistance,
    endX: sensor.location.x + maxPossibleXDistance,
    isValid: maxPossibleXDistance >= 0,
  };
}

function findSensorsInRange(sensors: SensorInfo[], rowIndex: number) {
  const sensorsInRange: SensorInfo[] = [];
  for (const sensor of sensors) {
    if (sensor.location.y === rowIndex) {
      sensorsInRange.push(sensor);
    } else {
      const nearestLocationOnThisRow: Point = {
        x: sensor.location.x,
        y: rowIndex,
      };
      const canSensorSayAnythingAboutThisRow =
        calcManhattanDistance(sensor.location, nearestLocationOnThisRow) >=
        sensor.nearestBeaconDistance;
      if (canSensorSayAnythingAboutThisRow) {
        sensorsInRange.push(sensor);
      }
    }
  }
  return sensorsInRange;
}

function isBeaconLocation(
  possibleBeaconLocation: Point,
  forSensor: SensorInfo
) {
  return (
    possibleBeaconLocation.x === forSensor.nearestBeacon.x &&
    possibleBeaconLocation.y === forSensor.nearestBeacon.y
  );
}

export function findPossibleBeaconLocation(
  sensors: SensorInfo[],
  minBounds = Number.MIN_SAFE_INTEGER,
  maxBounds = Number.MAX_SAFE_INTEGER
): Point | undefined {
  const beaconZone = findBeaconZone(sensors);

  for (const sensor of sensors) {
    // Walk sensor perimeter + 1 and test if no sensors can see it
    const sensorRange = sensor.nearestBeaconDistance;

    for (let index = 0; index < sensorRange + 1; index++) {
      const opposite = sensorRange + 1 - index;
      const possibleBeaconLocationTR: Point = {
        x: sensor.location.x + index,
        y: sensor.location.y - opposite,
      };
      const possibleBeaconLocationTL: Point = {
        x: sensor.location.x - index,
        y: sensor.location.y - opposite,
      };
      const possibleBeaconLocationBR: Point = {
        x: sensor.location.x + opposite,
        y: sensor.location.y + index,
      };
      const possibleBeaconLocationBL: Point = {
        x: sensor.location.x - opposite,
        y: sensor.location.y + index,
      };
      const locationsInBeaconZone = [
        possibleBeaconLocationTR,
        possibleBeaconLocationTL,
        possibleBeaconLocationBR,
        possibleBeaconLocationBL,
      ].filter(
        (location) =>
          location.x > beaconZone.topLeft.x &&
          location.x < beaconZone.bottomRight.x &&
          location.y > beaconZone.topLeft.y &&
          location.y < beaconZone.bottomRight.y &&
          location.x >= minBounds &&
          location.y >= minBounds &&
          location.x <= maxBounds &&
          location.y <= maxBounds
      );
      for (const possibleBeaconLocation of locationsInBeaconZone) {
        const isPossibleBeaconLocation = sensors.every((sensor) =>
          canBeaconExistAt(possibleBeaconLocation, sensor)
        );
        if (isPossibleBeaconLocation) {
          return possibleBeaconLocation;
        }
      }
    }
  }

  return undefined;
}
