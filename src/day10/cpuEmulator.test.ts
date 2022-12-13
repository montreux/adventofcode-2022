import { loadDataFrom } from "../textFileReader";
import { buildXValues, renderXValues } from "./cpuEmulator";

test("Example data signal strengths", () => {
  const testData = loadDataFrom("./src/day10/cpuEmulator.exampledata.txt");
  const xValuesPerCycle: number[] = buildXValues(testData);

  /*
The interesting signal strengths can be determined as follows:

During the 20th cycle, register X has the value 21, so the signal strength is 20 * 21 = 420. (The 20th cycle occurs in the middle of the second addx -1, so the value of register X is the starting value, 1, plus all of the other addx values up to that point: 1 + 15 - 11 + 6 - 3 + 5 - 1 - 8 + 13 + 4 = 21.)
During the 60th cycle, register X has the value 19, so the signal strength is 60 * 19 = 1140.
During the 100th cycle, register X has the value 18, so the signal strength is 100 * 18 = 1800.
During the 140th cycle, register X has the value 21, so the signal strength is 140 * 21 = 2940.
During the 180th cycle, register X has the value 16, so the signal strength is 180 * 16 = 2880.
During the 220th cycle, register X has the value 18, so the signal strength is 220 * 18 = 3960.
The sum of these signal strengths is 13140.
    */

  const cyclesOfInterest = [20, 60, 100, 140, 180, 220];
  const expectedSignalStrengths = [420, 1140, 1800, 2940, 2880, 3960];
  const totalSignalStrength = 13140;

  const actualSignalStrengths: number[] = [];
  for (const cycleNumber of cyclesOfInterest) {
    const xValue = xValuesPerCycle[cycleNumber - 1];
    const signalStrength = xValue * cycleNumber;
    actualSignalStrengths.push(signalStrength);
  }

  expect(actualSignalStrengths).toStrictEqual(expectedSignalStrengths);
  const sumOfSignalStrengths = actualSignalStrengths.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );
  expect(sumOfSignalStrengths).toBe(totalSignalStrength);
});

test("Part 1 - signal strengths", () => {
  const testData = loadDataFrom("./src/day10/cpuEmulator.data.txt");
  const xValuesPerCycle: number[] = buildXValues(testData);

  const cyclesOfInterest = [20, 60, 100, 140, 180, 220];

  const actualSignalStrengths: number[] = [];
  for (const cycleNumber of cyclesOfInterest) {
    const xValue = xValuesPerCycle[cycleNumber - 1];
    const signalStrength = xValue * cycleNumber;
    actualSignalStrengths.push(signalStrength);
  }

  const sumOfSignalStrengths = actualSignalStrengths.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );
  expect(sumOfSignalStrengths).not.toBe(0);

  console.log(`Sum of 6 signal strengths: ${sumOfSignalStrengths}`);
});

test("Part 2 - Render example data", () => {
  const expectedRender = `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`;

  const testData = loadDataFrom("./src/day10/cpuEmulator.exampledata.txt");
  const xValuesPerCycle: number[] = buildXValues(testData);

  const actualRender = renderXValues(xValuesPerCycle);

  expect(actualRender).toBe(expectedRender);
});

test("Part 2 - Render puzzle data", () => {
  const testData = loadDataFrom("./src/day10/cpuEmulator.data.txt");
  const xValuesPerCycle: number[] = buildXValues(testData);

  const actualRender = renderXValues(xValuesPerCycle, "█");

  expect(actualRender).not.toBe("");
  console.log(actualRender);
});
