type CaveModel = {
  x: number;
  y: number;
  width: number;
  height: number;
  visualization: string[][];
};

type Point = {
  x: number;
  y: number;
};
const nodeRegex = /(\d+),(\d+)/;

export function parseLines(inputData: string[]) {
  const lines: Point[][] = [];
  for (const inputLine of inputData) {
    const lineNodes: Point[] = [];
    const coordinatePairs = inputLine.split(" -> ");
    for (const coordinatePair of coordinatePairs) {
      const match = coordinatePair.match(nodeRegex);
      if (match) {
        const x = parseInt(match[1]);
        const y = parseInt(match[2]);
        lineNodes.push({ x, y });
      }
    }
    lines.push(lineNodes);
  }

  return lines;
}

export function generateCaveModelWithFloor(lines: Point[][]): CaveModel {
  return generateCaveModel(lines, true);
}

export function generateCaveModel(
  lines: Point[][],
  addFloor = false
): CaveModel {
  let minX = 500;
  let maxX = 500;
  let minY = 0;
  let maxY = 0;
  for (const line of lines) {
    for (const node of line) {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x);
      maxY = Math.max(maxY, node.y);
    }
  }

  if (addFloor) {
    maxY += 2;
    minX = Math.min(minX, 500 - maxY);
    maxX = Math.max(maxX, 500 + maxY);
  }

  // Initialise diagram cell with "."
  const diagramWidth = maxX - minX + 1;
  const diagramHeight = maxY - minY + 1;
  const diagramCells: string[][] = [];
  for (let index = 0; index < diagramHeight; index++) {
    const rowCells = new Array<string>(diagramWidth).fill(".");
    diagramCells.push(rowCells);
  }

  // Add the sand start point
  diagramCells[0][500 - minX] = "+";

  // Draw the lines
  for (const line of lines) {
    for (let nodeIndex = 0; nodeIndex < line.length - 1; nodeIndex++) {
      const startX = line[nodeIndex].x - minX;
      const startY = line[nodeIndex].y - minY;
      const endX = line[nodeIndex + 1].x - minX;
      const endY = line[nodeIndex + 1].y - minY;
      for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
        diagramCells[startY][x] = "#";
      }
      for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y++) {
        diagramCells[y][startX] = "#";
      }
    }
  }

  if (addFloor) {
    diagramCells[diagramCells.length - 1].fill("#");
  }

  // const diagram = diagramCells.map((rowCells) => rowCells.join("")).join("\n");

  return {
    x: minX,
    y: minY,
    width: diagramWidth,
    height: diagramHeight,
    visualization: diagramCells,
  };
}

/**
 * Repeatedly inject grains of sand and model the grains until they come to
 * rest, fall into the abyss, or block they injection point.
 *
 * @returns Number of grains of sand that came to rest.
 */
export function simulateSand(caveModel: CaveModel): number {
  const currentDiagram = caveModel.visualization;
  const initialSandXPosition = currentDiagram[0].indexOf("+");
  let hasFallenIntoTheAbyss = false;
  let sandYPosition = 0;
  let sandXPosition = initialSandXPosition;
  let numGrainsOfSand = 0;
  // We don't need to model every position of every grain of sand,
  // just the positions where we haven't exhausted our options. Tracking
  // these decision points allow us to skip pointless checks.
  const decisionPoints: Point[] = [{ x: initialSandXPosition, y: 0 }];
  do {
    const startingPoint = decisionPoints.pop();
    sandXPosition = startingPoint?.x ?? initialSandXPosition;
    sandYPosition = startingPoint?.y ?? 0;

    let hasSandStopped = false;
    while (!hasSandStopped && !hasFallenIntoTheAbyss) {
      const nextSandYPos = sandYPosition + 1;

      if (nextSandYPos >= caveModel.height) {
        hasFallenIntoTheAbyss = true;
        break;
      }

      const possibleNextXPositions = [
        sandXPosition,
        sandXPosition - 1,
        sandXPosition + 1,
      ];

      const validPossibleNextXPositions = possibleNextXPositions.filter(
        (xPosition) =>
          xPosition >= 0 &&
          xPosition < caveModel.width &&
          currentDiagram[nextSandYPos][sandXPosition] === "."
      );
      if (validPossibleNextXPositions.length > 1) {
        decisionPoints.push({ x: sandXPosition, y: sandYPosition });
      }

      let nextSandXPos = -1;
      hasSandStopped = true;
      for (const xPosition of possibleNextXPositions) {
        if (xPosition < 0 || xPosition >= caveModel.width) {
          hasSandStopped = false;
          hasFallenIntoTheAbyss = true;
          break;
        } else {
          const isAvailableLocation =
            currentDiagram[nextSandYPos][xPosition] === ".";
          if (isAvailableLocation) {
            nextSandXPos = xPosition;
            hasSandStopped = false;
            break;
          }
        }
      }
      if (!hasFallenIntoTheAbyss && !hasSandStopped) {
        sandXPosition = nextSandXPos;
        sandYPosition = nextSandYPos;
      }
    }

    if (!hasFallenIntoTheAbyss) {
      currentDiagram[sandYPosition][sandXPosition] = "o";
      numGrainsOfSand += 1;
    }
  } while (!hasFallenIntoTheAbyss && sandYPosition !== 0);

  return numGrainsOfSand;
}
