import { match } from "assert";

type RopeModel = {
  knotLocations: Location[][];
  stateDiagram?: string;
};

type Location = {
  row: number;
  column: number;
};

export function buildRopeModel(
  inputData: string[],
  numKnots: number,
  includeStateDiagram: boolean = false
): RopeModel {
  //   const headLocations: Location[] = [{ row: 0, column: 0 }];
  //   const tailLocations: Location[] = [{ row: 0, column: 0 }];
  const knotLocations: Location[][] = new Array<Location[]>(numKnots);
  for (let index = 0; index < numKnots; index++) {
    knotLocations[index] = [];
    knotLocations[index].push({ row: 0, column: 0 });
  }

  const headLocations = knotLocations[0];
  const stateDiagrams: string[] = ["== Initial State =="];

  includeStateDiagram && stateDiagrams.push(drawState(knotLocations, 0));

  for (const moveText of inputData) {
    includeStateDiagram && stateDiagrams.push(`== ${moveText} ==`);
    let rowModifier = 0;
    let columnModifier = 0;
    const [direction, distanceText] = moveText.split(" ");
    switch (direction) {
      case "U":
        rowModifier = 1;
        break;
      case "D":
        rowModifier = -1;
        break;
      case "L":
        columnModifier = -1;
        break;
      case "R":
        columnModifier = 1;
        break;

      default:
        throw new Error("Arghh! " + "'moveText'");
    }
    const distance = Number.parseInt(distanceText);
    for (let index = 0; index < distance; index++) {
      const currentHeadLocation = headLocations[headLocations.length - 1];
      const newHeadLocation: Location = {
        row: currentHeadLocation.row + rowModifier,
        column: currentHeadLocation.column + columnModifier,
      };
      headLocations.push(newHeadLocation);

      for (let index = 1; index < numKnots; index++) {
        const headToThisKnotLocations = knotLocations[index - 1];
        const newHeadLocation =
          headToThisKnotLocations[headToThisKnotLocations.length - 1];
        const thisKnotLocations = knotLocations[index];
        const thisKnotLocation =
          thisKnotLocations[thisKnotLocations.length - 1];

        // Tail - if not touching and on same row, move one row closer
        // - if not touching and on same column, move one column closer
        // - if not touching and on different row and column, move diagonally one step closer
        const rowDifference = newHeadLocation.row - thisKnotLocation.row;
        const columnDifference =
          newHeadLocation.column - thisKnotLocation.column;

        const isDiagonalMove =
          rowDifference !== 0 &&
          columnDifference !== 0 &&
          (Math.abs(rowDifference) > 1 || Math.abs(columnDifference) > 1);
        const isRowMove =
          !isDiagonalMove &&
          columnDifference == 0 &&
          Math.abs(rowDifference) > 1;
        const isColumnMove =
          !isDiagonalMove &&
          rowDifference == 0 &&
          Math.abs(columnDifference) > 1;

        const rowDifferenceSign = Math.sign(rowDifference);
        const columnDifferenceSign = Math.sign(columnDifference);

        let newTailLocation = thisKnotLocation;
        if (isDiagonalMove) {
          newTailLocation = {
            row: thisKnotLocation.row + rowDifferenceSign,
            column: thisKnotLocation.column + columnDifferenceSign,
          };
        } else if (isRowMove) {
          newTailLocation = {
            row: thisKnotLocation.row + rowDifferenceSign,
            column: thisKnotLocation.column,
          };
        } else if (isColumnMove) {
          newTailLocation = {
            row: thisKnotLocation.row,
            column: thisKnotLocation.column + columnDifferenceSign,
          };
        }
        thisKnotLocations.push(newTailLocation);
      }
      includeStateDiagram &&
        stateDiagrams.push(drawState(knotLocations, headLocations.length - 1));
    }
  }
  const stateDiagram = stateDiagrams.join("\n\n");

  return { knotLocations, stateDiagram };
}

export function getUniqueLocationsVisited(locations: Location[]) {
  const locationsText = locations.map((location) => JSON.stringify(location));
  const uniqueLocations = new Set(locationsText);
  return uniqueLocations.size;
}

export function drawLocationsVisited(locations: Location[]): string {
  let minColumn = 0;
  let maxColumn = 0;
  let minRow = 0;
  let maxRow = 0;

  for (const location of locations) {
    minColumn = Math.min(minColumn, location.column);
    maxColumn = Math.max(maxColumn, location.column);
    minRow = Math.min(minRow, location.row);
    maxRow = Math.max(maxRow, location.row);
  }

  const textDiagram = new Array<string[]>(maxRow - minRow + 1);
  for (let index = 0; index < textDiagram.length; index++) {
    textDiagram[index] = new Array<string>(maxColumn - minColumn + 1).fill(".");
  }

  for (const location of locations) {
    textDiagram[location.row - minRow][location.column - minColumn] = "#";
  }
  textDiagram[0 - minRow][0 - minColumn] = "s";

  const diagramRows = textDiagram.map((columns) => columns.join("")).reverse();
  const diagram = diagramRows.join("\n");
  return diagram;
}

export function drawState(
  knotLocations: Location[][],
  positionIndex: number
): string {
  let minColumn = 0;
  let maxColumn = 0;
  let minRow = 0;
  let maxRow = 0;

  for (const location of knotLocations[0]) {
    minColumn = Math.min(minColumn, location.column);
    maxColumn = Math.max(maxColumn, location.column);
    minRow = Math.min(minRow, location.row);
    maxRow = Math.max(maxRow, location.row);
  }

  const textDiagram = new Array<string[]>(maxRow - minRow + 1);
  for (let index = 0; index < textDiagram.length; index++) {
    textDiagram[index] = new Array<string>(maxColumn - minColumn + 1).fill(".");
  }

  textDiagram[0 - minRow][0 - minColumn] = "s";
  for (let knotIndex = 0; knotIndex < knotLocations.length; knotIndex++) {
    const knotLocation = knotLocations[knotIndex][positionIndex];
    const knotText = knotIndex == 0 ? "H" : `${knotIndex}`;
    textDiagram[knotLocation.row - minRow][knotLocation.column - minColumn] =
      knotText;
  }

  const diagramRows = textDiagram.map((columns) => columns.join("")).reverse();
  const diagram = diagramRows.join("\n");
  return diagram;
}
