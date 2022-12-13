import { assert } from "console";

const MoveValues = new Map<string, number>([
  ["A", 1],
  ["B", 2],
  ["C", 3],
  ["X", 1],
  ["Y", 2],
  ["Z", 3],
]);

const MovesFromTheirMoveAndResult = new Map<string, string>([
  ["AX", "C"], // You lose against Rock, with Scissors
  ["AY", "A"], // You draw against Rock, with Rock
  ["AZ", "B"], // You win against Rock, with Paper
  ["BX", "A"], // You lose against Paper, with Rock
  ["BY", "B"], // You draw against Paper, with Paper
  ["BZ", "C"], // You win against Paper, with Scissors
  ["CX", "B"], // You lose against Scissors, with Paper
  ["CY", "C"], // You draw against Scissors, with Scissors
  ["CZ", "A"], // You lose against Rock, with Scissors
]);

const LossPoints = 0;
const DrawPoints = 3;
const WinPoints = 6;

interface RockPaperScissorRound {
  theirMove: "A" | "B" | "C";
  yourMove: "X" | "Y" | "Z";
}

// read data file into data structure
export function parseRoundsData(inputData: string[]): RockPaperScissorRound[] {
  const rounds = inputData.map(
    (encryptedMove: string): RockPaperScissorRound => {
      const moves = encryptedMove.split(" ");
      return {
        theirMove: moves[0],
        yourMove: moves[1],
      } as RockPaperScissorRound;
    }
  );

  return rounds;
}

export function scoreRound(round: RockPaperScissorRound): number {
  const yourMoveValue = MoveValues.get(round.yourMove)!;
  assert(
    [1, 2, 3].includes(yourMoveValue),
    `${round.yourMove} value is not in [1,2,3]`
  );

  const didWin =
    (round.theirMove === "A" && round.yourMove === "Y") ||
    (round.theirMove === "B" && round.yourMove === "Z") ||
    (round.theirMove === "C" && round.yourMove === "X");

  const didDraw =
    (round.theirMove === "A" && round.yourMove === "X") ||
    (round.theirMove === "B" && round.yourMove === "Y") ||
    (round.theirMove === "C" && round.yourMove === "Z");

  const resultValue = didWin ? 6 : didDraw ? 3 : 0;

  const roundValue = yourMoveValue + resultValue;
  assert(
    !isNaN(roundValue),
    `youMoveValue: ${yourMoveValue}, resultValue: ${resultValue}`
  );
  return roundValue;
}

export function scoreAllRounds(rounds: RockPaperScissorRound[]): number {
  const allRoundValues = rounds.map((round) => scoreRound(round));
  const sumOfRoundValues = allRoundValues.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );
  return sumOfRoundValues;
}

export function scoreAllRoundsPart2(rounds: RockPaperScissorRound[]): number {
  const allRoundValues = rounds.map((round) => scoreRoundPart2(round));
  const sumOfRoundValues = allRoundValues.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );
  return sumOfRoundValues;
}

/**
 * X means you need to lose, Y means you need to end the round in a
 * draw, and Z means you need to win.
 */
function scoreRoundPart2(round: RockPaperScissorRound): number {
  const desiredResult = round.yourMove;
  const theirMoveAndResult = `${round.theirMove}${desiredResult}`;

  const yourMove = MovesFromTheirMoveAndResult.get(theirMoveAndResult)!;
  assert(
    ["A", "B", "C"].includes(yourMove),
    `${yourMove} is not in ["A", "B", "C"]`
  );
  const yourMoveValue = MoveValues.get(yourMove)!;
  assert(
    [1, 2, 3].includes(yourMoveValue),
    `${round.yourMove} value is not in [1,2,3]`
  );

  const didWin = round.yourMove === "Z";
  const didDraw = round.yourMove === "Y";

  const resultValue = didWin ? 6 : didDraw ? 3 : 0;

  const roundValue = yourMoveValue + resultValue;
  assert(
    !isNaN(roundValue),
    `youMoveValue: ${yourMoveValue}, resultValue: ${resultValue}`
  );
  return roundValue;
}
