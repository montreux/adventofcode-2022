import { loadDataFrom } from "../textFileReader";
import { decimalToSnafu, snafuToDecimal } from "./snafu";

test("decimalToSnafu", () => {
  const snafuValue = decimalToSnafu(4890);
  expect(snafuValue).toBe("2=-1=0");
});

test("snafuToDecimal", () => {
  expect(snafuToDecimal("1=-0-2")).toBe(1747);
  expect(snafuToDecimal("12111")).toBe(906);
  expect(snafuToDecimal("2=0=")).toBe(198);
  expect(snafuToDecimal("21")).toBe(11);
});

test("Sum of snafu values - part 1", () => {
  const inputLines = loadDataFrom("./src/day25/snafu.puzzledata.txt");
  const decimalValues = inputLines.map((snafuValue) =>
    snafuToDecimal(snafuValue)
  );
  const sum = decimalValues.reduce((a, b) => a + b);
  const sumAsSnafu = decimalToSnafu(sum);
  expect(sumAsSnafu).toBe("2---0-1-2=0=22=2-011");
});
