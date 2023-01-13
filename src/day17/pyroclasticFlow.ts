import { number } from "zod";

// const shapes = [
//   ["####"],
//   [".#.", "###", ".#."],
//   ["..#", "..#", "###"],
//   ["#", "#", "#", "#"],
//   ["##", "##"],
// ];

type Shape = {
  width: number;
  height: number;
  bitShape: number[];
};
const shapes: Shape[] = [
  { width: 4, height: 1, bitShape: [0b1111] },
  { width: 3, height: 3, bitShape: [0b010, 0b111, 0b010] },
  { width: 3, height: 3, bitShape: [0b001, 0b001, 0b111] },
  { width: 1, height: 4, bitShape: [1, 1, 1, 1] },
  { width: 2, height: 2, bitShape: [0b11, 0b11] },
];

export type ChamberState = {
  chamber: number[];
  jetPattern: number[];
  chamberHeightsPerDrop?: number[];
};

export function dropNShapes(
  numShapesToDrop: number,
  jetPatternText: string,
  stepLogger: (
    chamberState: ChamberState,
    shape: Shape,
    shapeX: number,
    shapeY: number
  ) => void = () => {}
): ChamberState {
  const jetPattern = [...jetPatternText].map((character) =>
    character == ">" ? +1 : -1
  );
  const chamberState: ChamberState = {
    chamber: [],
    jetPattern,
    chamberHeightsPerDrop: [0],
  };
  for (let index = 0; index < numShapesToDrop; index++) {
    const shaoeToDrop = shapes[index % shapes.length];
    dropShape(chamberState, shaoeToDrop, stepLogger);
    chamberState.chamberHeightsPerDrop?.push(chamberState.chamber.length);
  }

  return chamberState;
}

export function drawChamber(chamberState: ChamberState): string {
  const chamberLines: string[] = [];
  chamberState.chamber.forEach((chamberRow) => {
    const rowCharacters: string[] = [];
    for (let bitIndex = 0; bitIndex < chamberWidth; bitIndex++) {
      const bitValue = chamberRow & (1 << bitIndex);
      rowCharacters.unshift(bitValue == 0 ? "." : "#");
    }
    chamberLines.push(["|", ...rowCharacters, "|"].join(""));
  });
  chamberLines.reverse();
  chamberLines.push("+-------+");
  const drawnChamber = chamberLines.join("\n");
  return drawnChamber;
}

const chamberWidth = 7;

export function dropShape(
  chamberState: ChamberState,
  shape: Shape,
  stepLogger: (
    chamberState: ChamberState,
    shape: Shape,
    shapeX: number,
    shapeY: number
  ) => void = () => {}
) {
  let hasCollided = false;
  /**
   * The tall, vertical chamber is exactly seven units wide. Each rock appears
   * so that its left edge is two units away from the left wall and its bottom
   * edge is three units above the highest rock in the room (or the floor, if
   * there isn't one).
   */
  const entryPointX = 3;
  const entryPointY = 3 + shape.height;

  /**
   * After a rock appears, it alternates between being pushed by a jet of hot
   * gas one unit (in the direction indicated by the next symbol in the jet
   * pattern) and then falling one unit down. If any movement would cause any
   * part of the rock to move into the walls, floor, or a stopped rock, the
   * movement instead does not occur. If a downward movement would have caused
   * a falling rock to move into the floor or an already-fallen rock, the
   * falling rock stops where it is (having landed on something) and a new
   * rock immediately begins falling.
   */

  let shapeX = entryPointX;
  let shapeY = entryPointY;
  const shapeWidth = shape.width;
  stepLogger(chamberState, shape, shapeX, shapeY);
  while (!hasCollided) {
    // Move due to jet
    const xShift = chamberState.jetPattern.shift()!;
    chamberState.jetPattern.push(xShift);

    const newXStartsInChamber = shapeX + xShift > 0;
    const newXEndsInChamber = shapeX + shapeWidth + xShift - 1 <= chamberWidth;
    const wouldCollide = checkForCollision(
      chamberState.chamber,
      shape,
      shapeX + xShift,
      shapeY
    );
    if (newXStartsInChamber && newXEndsInChamber && !wouldCollide) {
      shapeX += xShift;
    }

    stepLogger(chamberState, shape, shapeX, shapeY);

    // Drop if doesn't cause a collision
    shapeY -= 1;
    hasCollided = checkForCollision(
      chamberState.chamber,
      shape,
      shapeX,
      shapeY
    );
    if (hasCollided) {
      shapeY += 1;
      placeShape(chamberState.chamber, shape, shapeX, shapeY);
    } else {
      stepLogger(chamberState, shape, shapeX, shapeY);
    }
  }

  return;
}

export function logStep(
  chamberState: ChamberState,
  shape?: Shape,
  shapeX: number = 0,
  shapeY: number = 0
) {
  const tempChamber = [...chamberState.chamber];
  if (shape) {
    placeShape(tempChamber, shape, shapeX, shapeY);
  }
  console.log(drawChamber({ chamber: tempChamber, jetPattern: [] }));
}

function checkForCollision(
  chamber: number[],
  shape: Shape,
  shapeX: number,
  shapeY: number
): boolean {
  const isAboveChamber = shapeY - shape.height + 1 > 0;
  if (isAboveChamber) {
    return false;
  }
  const isChamberEmpty = chamber.length == 0;
  if (isChamberEmpty) {
    // If the chamber is empty, and the shape is in the chamber, then the shape
    // has touched the floor.
    return true;
  }

  const bottomFirstShape = [...shape.bitShape].reverse();
  const isNotCollision = bottomFirstShape.every((shapeLine, shapeRowIndex) => {
    const shapeBitsInChamber =
      shapeLine << (chamberWidth - shapeX - shape.width + 1);
    const champberLineIndex =
      chamber.length - 1 + shapeRowIndex + (shapeY - shape.height + 1);
    if (champberLineIndex >= chamber.length) {
      return true;
    }
    const chamberLine = chamber[champberLineIndex];
    const didCollide = (chamberLine & shapeBitsInChamber) !== 0;
    return !didCollide;
  });
  return !isNotCollision;
}

function placeShape(
  chamber: number[],
  shape: Shape,
  shapeX: number,
  shapeY: number
) {
  const blankRowsToAdd = shapeY > 0 ? shapeY : 0;
  for (
    let newBlankRowIndex = 0;
    newBlankRowIndex < blankRowsToAdd;
    newBlankRowIndex++
  ) {
    chamber.push(0);
  }

  shape.bitShape.forEach((shapeLine, shapeRowIndex) => {
    const shapeBitsInChamber =
      shapeLine << (chamberWidth - shapeX - shape.width + 1);
    const champberLineIndex =
      chamber.length - 1 - shapeRowIndex + (shapeY - blankRowsToAdd);
    const chamberLine = chamber[champberLineIndex];
    chamber[champberLineIndex] = chamberLine | shapeBitsInChamber;
  });
}

function getHashCode(source: number[]): number {
  let hash = 0;
  source.forEach((sourceValue) => {
    hash = (hash << 5) - hash + sourceValue;
    hash |= 0; // Keep as integer
  });
  return hash;
}

export function findRepeatingSequence(
  numShapesToDrop: number,
  jetPatternText: string
) {
  const finalChamberState = dropNShapes(numShapesToDrop, jetPatternText);
  const hashDetails = new Map<number, number[]>();
  for (let index = 0; index < finalChamberState.chamber.length - 100; index++) {
    const chunkToHash = finalChamberState.chamber.slice(index, index + 100);
    const hashCode = getHashCode(chunkToHash);
    let existingMatchingHashes = hashDetails.get(hashCode) ?? [];
    existingMatchingHashes.push(index);
    hashDetails.set(hashCode, existingMatchingHashes);
  }

  const repeatingSequencesByFrequency = [...hashDetails.values()].sort(
    (indicesA, indicesB) => {
      if (indicesA.length !== indicesB.length) {
        return indicesB.length - indicesA.length;
      }
      return indicesB[0] - indicesA[0];
    }
  );

  // console.log(
  //   `Pattern of length 100 found at ${repeatingSequencesByFrequency[0]}`
  // );
}

export function findHeightAfterNDrops(
  numShapesToDrop: number,
  jetPatternText: string
): number {
  const finalChamberState = dropNShapes(10000, jetPatternText);

  type RepitionDetails = {
    dropIndex: number;
    chamberHeight: number;
  };

  const hashDetails = new Map<number, RepitionDetails[]>();
  for (
    let dropIndex = 0;
    dropIndex < finalChamberState.chamberHeightsPerDrop!.length;
    dropIndex++
  ) {
    const heightAfterDrop = finalChamberState.chamberHeightsPerDrop![dropIndex];
    if (
      heightAfterDrop == undefined ||
      heightAfterDrop > finalChamberState.chamber.length - 100
    ) {
      break;
    }
    const chunkToHash = finalChamberState.chamber.slice(
      heightAfterDrop,
      heightAfterDrop + 100
    );
    const hashCode = getHashCode(chunkToHash);
    let existingMatchingHashes = hashDetails.get(hashCode) ?? [];
    existingMatchingHashes.push({ dropIndex, chamberHeight: heightAfterDrop });
    hashDetails.set(hashCode, existingMatchingHashes);
  }

  const repeatingSequencesByFrequency = [...hashDetails.values()].sort(
    (indicesA, indicesB) => {
      if (indicesA.length !== indicesB.length) {
        return indicesB.length - indicesA.length;
      }
      return indicesB[0].dropIndex - indicesA[0].dropIndex;
    }
  );

  const firstSequence = repeatingSequencesByFrequency[0];

  const sequenceWithDifferentHeights = firstSequence.filter(
    (repititionDetails, index) => {
      if (index == firstSequence.length - 1) {
        return true;
      }
      return (
        repititionDetails.chamberHeight !==
        firstSequence[index + 1].chamberHeight
      );
    }
  );
  const startDrop = firstSequence[0].dropIndex;
  const heightAtStartOfRepetition = firstSequence[0].chamberHeight;
  const dropInterval =
    sequenceWithDifferentHeights[1].dropIndex -
    sequenceWithDifferentHeights[0].dropIndex;
  const heightGain =
    sequenceWithDifferentHeights[1].chamberHeight -
    sequenceWithDifferentHeights[0].chamberHeight;

  const repetitionCount = Math.floor(
    (numShapesToDrop - startDrop) / dropInterval
  );
  const remainerDrops = (numShapesToDrop - startDrop) % dropInterval;
  const remainerHeightGain =
    finalChamberState.chamberHeightsPerDrop![startDrop + remainerDrops] -
    finalChamberState.chamberHeightsPerDrop![startDrop];

  const finalHeight =
    heightAtStartOfRepetition +
    repetitionCount * heightGain +
    remainerHeightGain;

  return finalHeight;
}
