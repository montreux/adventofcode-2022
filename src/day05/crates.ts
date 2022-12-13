export function parseCratesTextIntoStacks(cratesTextArt: string[]): string[][] {
  const numberOfStacks = cratesTextArt[0].length / 4;
  const crateStacks: string[][] = [];
  for (let index = 0; index < numberOfStacks; index++) {
    crateStacks.push([]);
  }

  const linesOfCrateTextArt = [];
  for (const line of cratesTextArt) {
    if (line.trimStart().startsWith("1")) {
      break;
    }
    linesOfCrateTextArt.push(line);
  }

  const crateTextArtFromBottom = linesOfCrateTextArt.reverse();

  for (const line of crateTextArtFromBottom) {
    for (let index = 0; index < numberOfStacks; index++) {
      const charIndex = index * 4;
      const crateText = line.slice(charIndex, charIndex + 4).trim();
      if (crateText.length !== 0) {
        crateStacks[index].push(crateText.slice(1, 2));
      }
    }
  }

  return crateStacks;
}

interface CrateMove {
  numberOfCratesToMove: number;
  fromStack: number;
  toStack: number;
}

export function parseCratesTextIntoMoves(cratesTextArt: string[]): CrateMove[] {
  const moveRegex = /move (\d+) from (\d+) to (\d+)/;

  const crateMoves: CrateMove[] = [];
  for (const line of cratesTextArt) {
    if (!line.startsWith("move")) {
      continue;
    }
    const match = line.match(moveRegex);
    if (match == null) {
      throw new Error("Move regex failed to match");
    }
    crateMoves.push({
      numberOfCratesToMove: Number.parseInt(match[1]),
      fromStack: Number.parseInt(match[2]),
      toStack: Number.parseInt(match[3]),
    });
  }

  return crateMoves;
}

export function performMoves(
  crateStacks: string[][],
  moves: CrateMove[]
): string[][] {
  const outputStacks = JSON.parse(JSON.stringify(crateStacks));

  for (const move of moves) {
    for (let index = 0; index < move.numberOfCratesToMove; index++) {
      const crateBeingMoved = outputStacks[move.fromStack - 1].pop();
      outputStacks[move.toStack - 1].push(crateBeingMoved);
    }
  }

  return outputStacks;
}

export function topCrates(crateStacks: string[][]): string {
  const topCrateValues: string[] = [];
  for (const stack of crateStacks) {
    topCrateValues.push(stack[stack.length - 1]);
  }
  return topCrateValues.join("");
}

export function performMovesWithCrateMover9001(
  crateStacks: string[][],
  moves: CrateMove[]
): string[][] {
  const outputStacks = JSON.parse(JSON.stringify(crateStacks)) as string[][];

  for (const move of moves) {
    const sourceStack = outputStacks[move.fromStack - 1];
    const cratesBeingMoved = sourceStack.splice(
      sourceStack.length - move.numberOfCratesToMove,
      move.numberOfCratesToMove
    );
    const destinationStack = outputStacks[move.toStack - 1];
    destinationStack.push(...cratesBeingMoved);
  }

  return outputStacks;
}
