import { loadDataFrom } from "../textFileReader";
import {
  parseRoundsData,
  scoreAllRounds,
  scoreAllRoundsPart2,
} from "./rockpaperscissors";

test("example data", () => {
  const inputData = loadDataFrom(
    "./src/day02/rockpaperscissors.exampledata.txt"
  );
  const roundsData = parseRoundsData(inputData);
  const finalScore = scoreAllRounds(roundsData);
  expect(finalScore).toBe(15);
});

test("real data", () => {
  const inputData = loadDataFrom("./src/day02/rockpaperscissors.data.txt");
  const roundsData = parseRoundsData(inputData);
  const finalScore = scoreAllRounds(roundsData);
  expect(finalScore).toBe(11767);
});

test("example data part 2", () => {
  const inputData = loadDataFrom(
    "./src/day02/rockpaperscissors.exampledata.txt"
  );
  const roundsData = parseRoundsData(inputData);
  const finalScore = scoreAllRoundsPart2(roundsData);
  expect(finalScore).toBe(12);
});

test("real data part 2", () => {
  const inputData = loadDataFrom("./src/day02/rockpaperscissors.data.txt");
  const roundsData = parseRoundsData(inputData);
  const finalScore = scoreAllRoundsPart2(roundsData);
  expect(finalScore).toBe(13886);
});
