type Direction = "<" | ">" | "^" | "v";

type Blizzard = {
  x: number;
  y: number;
  direction: Direction;
};

type BlizzardMap = {
  allBlizzards: Blizzard[];
  width: number;
  height: number;
};

export function parseInputData(inputLines: string[]): BlizzardMap {
  const width = inputLines[0].length - 2;
  const height = inputLines.length - 2;

  const allBlizzards: Blizzard[] = [];
  inputLines.forEach((inputLine, rowIndex) =>
    [...inputLine].forEach((cell, columnIndex) => {
      if (["<", ">", "^", "v"].includes(cell)) {
        allBlizzards.push({
          x: columnIndex,
          y: rowIndex,
          direction: cell as Direction,
        });
      }
    })
  );

  return { allBlizzards, width, height };
}

export function advanceBlizzards(blizzardMap: BlizzardMap): BlizzardMap {
  const nextPositions: Blizzard[] = blizzardMap.allBlizzards.map((blizzard) => {
    let nextPosition: Blizzard = {
      x: blizzard.x,
      y: blizzard.y,
      direction: blizzard.direction,
    };
    switch (blizzard.direction) {
      case "<":
        const nextX = ((blizzard.x - 2) % blizzardMap.width) + 1;
        nextPosition.x = nextX > 0 ? nextX : blizzardMap.width;
        break;
      case ">":
        nextPosition.x = (blizzard.x % blizzardMap.width) + 1;
        break;
      case "^":
        const nextY = ((blizzard.y - 2) % blizzardMap.height) + 1;
        nextPosition.y = nextY > 0 ? nextY : blizzardMap.height;
        break;
      case "v":
        nextPosition.y = (blizzard.y % blizzardMap.height) + 1;
        break;

      default:
        throw new Error("Argh! Shouldn't get here.");
    }
    return nextPosition;
  });

  return {
    allBlizzards: nextPositions,
    width: blizzardMap.width,
    height: blizzardMap.height,
  };
}

export function drawMap(blizzardMap: BlizzardMap): string {
  const cells: string[][] = [];
  for (let rowIndex = 0; rowIndex <= blizzardMap.height + 1; rowIndex++) {
    const isTopOrBottom = rowIndex == 0 || rowIndex == blizzardMap.height + 1;
    const fillCharacter = isTopOrBottom ? "#" : ".";
    cells.push(new Array<string>(blizzardMap.width + 2).fill(fillCharacter));
    cells[rowIndex][0] = "#";
    cells[rowIndex][blizzardMap.width + 1] = "#";
  }
  cells[0][1] = ".";
  cells[blizzardMap.height + 1][blizzardMap.width] = ".";

  blizzardMap.allBlizzards.forEach((blizzard) => {
    const currentCellContents = cells[blizzard.y][blizzard.x];
    if (currentCellContents != ".") {
      let currentNumber = parseInt(currentCellContents);
      currentNumber = Number.isNaN(currentNumber) ? 1 : currentNumber;
      cells[blizzard.y][blizzard.x] = (currentNumber + 1).toString();
      return;
    }
    cells[blizzard.y][blizzard.x] = blizzard.direction;
  });
  return cells.map((rowCells) => rowCells.join("")).join("\n");
}

type Location = { x: number; y: number };

export function findShortestRoute(
  blizzardMap: BlizzardMap,
  startLocation: Location = { x: 1, y: 0 },
  destinationLocation: Location = {
    x: blizzardMap.width,
    y: blizzardMap.height + 1,
  },
  progressRenderer: (
    currentBlizzardMap: BlizzardMap,
    time: number,
    possibleLocations: Location[]
  ) => void = () => {}
): number {
  let time = 0;

  const checkQueue: Location[] = [];
  const nextCheckSet = new Set<string>();
  nextCheckSet.add(JSON.stringify(startLocation));

  const destinationJson = JSON.stringify(destinationLocation);
  let haveReachedDestination = false;
  let currentBlizzardMap = blizzardMap;
  while (!haveReachedDestination) {
    if (nextCheckSet.size === 0) {
      throw new Error(`No places to move at time ${time}`);
    }
    const nextCheckQueue = [...nextCheckSet.values()].map(
      (locationJson) => JSON.parse(locationJson) as Location
    );
    checkQueue.push(...nextCheckQueue);
    nextCheckSet.clear();
    progressRenderer(currentBlizzardMap, time, checkQueue);
    const nextBlizzardMap = advanceBlizzards(currentBlizzardMap);
    time += 1;
    if (time > 10000) {
      throw new Error("Not found destination in 10000 steps.");
    }

    while (checkQueue.length > 0) {
      const { x, y } = checkQueue.pop()!;
      const possibleNextLocations = [
        { x, y },
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ];
      const nextLocations = possibleNextLocations.filter(({ x, y }) => {
        const isAtStart = x == startLocation.x && y == startLocation.y;
        const isAtEnd =
          x == destinationLocation.x && y == destinationLocation.y;
        const isValidLocation =
          isAtStart ||
          isAtEnd ||
          (x >= 1 &&
            y >= 1 &&
            x <= blizzardMap.width &&
            y <= blizzardMap.height);
        const isLocationClear = nextBlizzardMap.allBlizzards.every(
          (blizzard) => blizzard.x != x || blizzard.y != y
        );
        return isValidLocation && isLocationClear;
      });

      const nextLocationsAsJsonValues = nextLocations.map((location) =>
        JSON.stringify(location)
      );
      nextLocationsAsJsonValues.forEach((locationAsJson) =>
        nextCheckSet.add(locationAsJson)
      );

      haveReachedDestination =
        nextLocationsAsJsonValues.includes(destinationJson);
      if (haveReachedDestination) {
        break;
      }
    }
    currentBlizzardMap = nextBlizzardMap;
  }

  // Draw the last step of the winning route
  progressRenderer(currentBlizzardMap, time, [destinationLocation]);

  return time;
}

export function visualizeRouteFinding(
  currentBlizzardMap: BlizzardMap,
  time: number,
  possibleLocations: Location[]
): string {
  const mapCells: string[][] = drawMap(currentBlizzardMap)
    .split("\n")
    .map((line) => [...line]);
  possibleLocations.forEach(
    (location) => (mapCells[location.y][location.x] = "█")
  );
  const map = mapCells.map((rowCells) => rowCells.join("")).join("\n");
  return `Minute ${time}\n${map}`;
}
