import {
  loadDataFrom,
  scoreAllRounds,
  scoreAllRoundsPart2,
} from "./rockpaperscissors";

test("example data", () => {
  const roundsData = loadDataFrom(
    "./src/day02/rockpaperscissors.exampledata.txt"
  );
  const finalScore = scoreAllRounds(roundsData);
  expect(finalScore).toBe(15);
});

test("real data", () => {
  const roundsData = loadDataFrom("./src/day02/rockpaperscissors.data.txt");
  const finalScore = scoreAllRounds(roundsData);
  expect(finalScore).not.toBe(0);

  console.log(`Final score: ${finalScore}.`);
});

test("example data part 2", () => {
  const roundsData = loadDataFrom(
    "./src/day02/rockpaperscissors.exampledata.txt"
  );
  const finalScore = scoreAllRoundsPart2(roundsData);
  expect(finalScore).toBe(12);
});

test("real data part 2", () => {
  const roundsData = loadDataFrom("./src/day02/rockpaperscissors.data.txt");
  const finalScore = scoreAllRoundsPart2(roundsData);
  expect(finalScore).not.toBe(0);

  console.log(`Final score (part 2): ${finalScore}.`);
});
