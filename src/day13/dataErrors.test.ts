import { loadDataFrom } from "../textFileReader";
import {
  findSumOfMatchingPairIndices,
  doPairsMatch,
  compareSignal,
} from "./dataErrors";

test("Parsing example data", () => {
  const inputData = loadDataFrom("./src/day13/dataErrors.exampledata.txt");
  const actualResult = findSumOfMatchingPairIndices(inputData);
  const expectedResult = 13; // 1, 2, 4, and 6

  expect(actualResult).toBe(expectedResult);
});

test("Bug hunt", () => {
  const leftData = [[4, 9], [], 7, [5, 2, 6, 3, 6]];
  const rightData = [7];
  const debugOutput: string[] = [];
  const didMatch = doPairsMatch(leftData, rightData, debugOutput);

  //   console.log(debugOutput.join("\n"));
  expect(didMatch).toBe(true);
});

// [] vs []
test("Bug hunt 2", () => {
  const leftData = [[]];
  const rightData = [[]];
  const debugOutput: string[] = [];
  const didMatch = doPairsMatch(leftData, rightData, debugOutput);

  //   console.log(debugOutput.join("\n"));
  expect(didMatch).toBeUndefined();
});

test("Parsing input data", () => {
  const inputData = loadDataFrom("./src/day13/dataErrors.data.txt");
  const debugOutput: string[] = [];
  const actualResult = findSumOfMatchingPairIndices(inputData, debugOutput);
  const knownTooLow = 565;
  const knownTooLow2 = 1762;
  const knownTooHigh = 6227;
  const knownWrong = 6118;
  const expectedResult = 5659;
  // max possible = 11325

  //   console.log(debugOutput.join("\n"));
  expect(actualResult).toBeGreaterThan(knownTooLow);
  expect(actualResult).toBeGreaterThan(knownTooLow2);
  expect(actualResult).toBeLessThan(knownTooHigh);
  expect(actualResult).not.toBe(knownWrong);
  expect(actualResult).toBe(expectedResult);
});

test("Sort signals - example data", () => {
  const inputData = loadDataFrom("./src/day13/dataErrors.exampledata.txt");
  const inputDataNoBlankLines = inputData.filter(
    (line) => line.trim().length > 0
  );
  const firstDecoderPacket = "[[2]]";
  const secondDecoderPacket = "[[6]]";
  const inputDataWithDividerPackets = [
    ...inputDataNoBlankLines,
    firstDecoderPacket,
    secondDecoderPacket,
  ];
  inputDataWithDividerPackets.sort((aText, bText) =>
    compareSignal(JSON.parse(aText), JSON.parse(bText))
  );

  const indexOfFirstDecoderPacket =
    inputDataWithDividerPackets.indexOf(firstDecoderPacket) + 1;
  const indexOfSecondDecoderPacket =
    inputDataWithDividerPackets.indexOf(secondDecoderPacket) + 1;

  expect(indexOfFirstDecoderPacket).toBe(10);
  expect(indexOfSecondDecoderPacket).toBe(14);

  const decoderKey = indexOfFirstDecoderPacket * indexOfSecondDecoderPacket;
  expect(decoderKey).toBe(140);
});

test("Sort signals - input data", () => {
  const inputData = loadDataFrom("./src/day13/dataErrors.data.txt");
  const inputDataNoBlankLines = inputData.filter(
    (line) => line.trim().length > 0
  );
  const firstDecoderPacket = "[[2]]";
  const secondDecoderPacket = "[[6]]";
  const inputDataWithDividerPackets = [
    ...inputDataNoBlankLines,
    firstDecoderPacket,
    secondDecoderPacket,
  ];
  inputDataWithDividerPackets.sort((aText, bText) =>
    compareSignal(JSON.parse(aText), JSON.parse(bText))
  );

  const indexOfFirstDecoderPacket =
    inputDataWithDividerPackets.indexOf(firstDecoderPacket) + 1;
  const indexOfSecondDecoderPacket =
    inputDataWithDividerPackets.indexOf(secondDecoderPacket) + 1;

  const decoderKey = indexOfFirstDecoderPacket * indexOfSecondDecoderPacket;
  expect(decoderKey).toBe(22110);
});
