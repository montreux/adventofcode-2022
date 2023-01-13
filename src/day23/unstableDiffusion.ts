export type ElfLocation = {
  x: number;
  y: number;
};

type ElfMove = {
  currentLocation: ElfLocation;
  proposedLocation: ElfLocation;
};

export function parseInputData(inputLines: string[]): ElfLocation[] {
  const elfLocations: ElfLocation[] = [];
  inputLines.forEach((line, yIndex) => {
    [...line].forEach((value, xIndex) => {
      if (value === "#") {
        elfLocations.push({ x: xIndex, y: yIndex });
      }
    });
  });

  return elfLocations;
}

export function findNumRoundsToSpaceOut(
  allElfLocations: ElfLocation[]
): number {
  let roundCount = 0;
  let previousElfLocations = allElfLocations;
  let nextElfLocations = [];
  do {
    const searchOrder = ["NSWE", "SWEN", "WENS", "ENSW"][
      roundCount % 4
    ] as SearchOrder;
    roundCount += 1;
    // for part 2 performRound takes 16s and areElfLocationsEqual 1.7s
    nextElfLocations = performRound(previousElfLocations, searchOrder);
    if (areElfLocationsEqual(nextElfLocations, previousElfLocations)) {
      return roundCount;
    }
    previousElfLocations = nextElfLocations;
  } while (true);
}

function areElfLocationsEqual(
  elfLocationsA: ElfLocation[],
  elfLocationsB: ElfLocation[]
): boolean {
  if (elfLocationsA.length !== elfLocationsB.length) {
    return false;
  }
  const elfLocationComparator = (a: ElfLocation, b: ElfLocation): number =>
    a.y - b.y == 0 ? a.x - b.x : a.y - b.y;
  const sortedA = [...elfLocationsA].sort(elfLocationComparator);
  const sortedB = [...elfLocationsB].sort(elfLocationComparator);
  return sortedA.every(
    (elfLocationA, index) =>
      elfLocationA.x == sortedB[index].x && elfLocationA.y == sortedB[index].y
  );
}

type SearchOrder = "NSWE" | "SWEN" | "WENS" | "ENSW";

export function performRounds(
  allElfLocations: ElfLocation[],
  numRounds: number
): ElfLocation[] {
  let elfLocations = allElfLocations;
  for (let index = 0; index < numRounds; index++) {
    const searchOrder = ["NSWE", "SWEN", "WENS", "ENSW"][
      index % 4
    ] as SearchOrder;
    elfLocations = performRound(elfLocations, searchOrder);
  }
  return elfLocations;
}

export function performRound(
  allElfLocations: ElfLocation[],
  searchOrder: "NSWE" | "SWEN" | "WENS" | "ENSW"
): ElfLocation[] {
  const mapOfElfLocations = new Map<string, ElfLocation>();
  allElfLocations.forEach((elfLocation) =>
    mapOfElfLocations.set(JSON.stringify(elfLocation), elfLocation)
  );

  const allProposedLocations = allElfLocations.map((elfLocation) =>
    findProposedMove(mapOfElfLocations, elfLocation, searchOrder)
  );

  const mapOfProposedElfMoves = new Map<string, ElfMove[]>();
  allProposedLocations.forEach((elfMove) => {
    const locationKey = JSON.stringify(elfMove.proposedLocation);
    const arrayOfLocations = mapOfProposedElfMoves.get(locationKey) ?? [];
    arrayOfLocations.push(elfMove);
    mapOfProposedElfMoves.set(locationKey, arrayOfLocations);
  });

  // Perform all moves where only one elf is moving to a location
  [...mapOfProposedElfMoves.values()].forEach((elfMoveArray) => {
    if (elfMoveArray.length == 1) {
      mapOfElfLocations.delete(JSON.stringify(elfMoveArray[0].currentLocation));
      mapOfElfLocations.set(
        JSON.stringify(elfMoveArray[0].proposedLocation),
        elfMoveArray[0].proposedLocation
      );
    }
  });

  return [...mapOfElfLocations.values()];
}

export function findProposedMove(
  allElfLocations: Map<string, ElfLocation>,
  currentLocation: ElfLocation,
  searchOrder: "NSWE" | "SWEN" | "WENS" | "ENSW"
): ElfMove {
  const adjacentLocations: ElfLocation[] = [
    { x: currentLocation.x - 1, y: currentLocation.y - 1 },
    { x: currentLocation.x, y: currentLocation.y - 1 },
    { x: currentLocation.x + 1, y: currentLocation.y - 1 },
    { x: currentLocation.x - 1, y: currentLocation.y },
    { x: currentLocation.x + 1, y: currentLocation.y },
    { x: currentLocation.x - 1, y: currentLocation.y + 1 },
    { x: currentLocation.x, y: currentLocation.y + 1 },
    { x: currentLocation.x + 1, y: currentLocation.y + 1 },
  ];

  const indicesOfAdjacentLocations = adjacentLocations.map((elfLocation) =>
    JSON.stringify(elfLocation)
  );

  const isAlone = indicesOfAdjacentLocations.every(
    (index) => !allElfLocations.has(index)
  );
  if (isAlone) {
    return { currentLocation, proposedLocation: currentLocation };
  }

  for (const searchDirection of [...searchOrder]) {
    const isNorth = searchDirection == "N";
    const isSouth = searchDirection == "S";
    const isWest = searchDirection == "W";
    const isEast = searchDirection == "E";
    const isVerticalChange = isNorth || isSouth;
    const isHorizontalChange = isWest || isEast;
    const proposedXLocationOffset = isHorizontalChange ? (isWest ? -1 : +1) : 0;
    const proposedYLocationOffset = isVerticalChange ? (isNorth ? -1 : +1) : 0;
    // North
    let proposedLocation: ElfLocation = {
      x: currentLocation.x + proposedXLocationOffset,
      y: currentLocation.y + proposedYLocationOffset,
    };
    let locationsToCheck: ElfLocation[] = isVerticalChange
      ? [
          {
            x: currentLocation.x - 1,
            y: currentLocation.y + proposedYLocationOffset,
          },
          {
            x: currentLocation.x,
            y: currentLocation.y + proposedYLocationOffset,
          },
          {
            x: currentLocation.x + 1,
            y: currentLocation.y + proposedYLocationOffset,
          },
        ]
      : [
          {
            x: currentLocation.x + proposedXLocationOffset,
            y: currentLocation.y - 1,
          },
          {
            x: currentLocation.x + proposedXLocationOffset,
            y: currentLocation.y,
          },
          {
            x: currentLocation.x + proposedXLocationOffset,
            y: currentLocation.y + 1,
          },
        ];

    const isDirectionClear = locationsToCheck.every(
      (elfLocation) => !allElfLocations.has(JSON.stringify(elfLocation))
    );

    if (isDirectionClear) {
      return { currentLocation, proposedLocation };
    }
  }

  // No locations clear, stay where in the same place.
  return { currentLocation, proposedLocation: currentLocation };
}

export function visualiseElfLocations(elfLocations: ElfLocation[]): string {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  elfLocations.forEach((elfLocation) => {
    minX = Math.min(elfLocation.x, minX);
    maxX = Math.max(elfLocation.x, maxX);
    minY = Math.min(elfLocation.y, minY);
    maxY = Math.max(elfLocation.y, maxY);
  });

  const cells: string[][] = [];
  for (let rowIndex = minY; rowIndex <= maxY; rowIndex++) {
    cells.push(new Array<string>(maxX - minX + 1).fill("."));
  }

  elfLocations.forEach(
    (elfLocation) => (cells[elfLocation.y - minY][elfLocation.x - minX] = "#")
  );

  const mapText = cells.map((rowCells) => rowCells.join("")).join("\n");
  return mapText;
}
