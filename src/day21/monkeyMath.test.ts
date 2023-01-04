import { loadDataFrom } from "../textFileReader";
import {
  findHumnValue,
  parseInputData,
  processCalculations,
} from "./monkeyMath";

test("parseInputData", () => {
  const inputLines = loadDataFrom("./src/day21/monkeyMath.exampledata.txt");
  const { monkeyValues, monkeyOperations } = parseInputData(inputLines);
  expect(JSON.stringify(Object.fromEntries(monkeyValues))).toBe(
    '{"dbpl":5,"zczc":2,"dvpt":3,"lfqf":4,"humn":5,"ljgn":2,"sllz":4,"hmdt":32}'
  );
  expect(JSON.stringify(Object.fromEntries(monkeyOperations))).toBe(
    '{"root":{"monkeyA":"pppw","monkeyB":"sjmn","operation":"+"},"cczh":{"monkeyA":"sllz","monkeyB":"lgvd","operation":"+"},"ptdq":{"monkeyA":"humn","monkeyB":"dvpt","operation":"-"},"sjmn":{"monkeyA":"drzm","monkeyB":"dbpl","operation":"*"},"pppw":{"monkeyA":"cczh","monkeyB":"lfqf","operation":"/"},"lgvd":{"monkeyA":"ljgn","monkeyB":"ptdq","operation":"*"},"drzm":{"monkeyA":"hmdt","monkeyB":"zczc","operation":"-"}}'
  );
});

test("part 1 - example data", () => {
  const inputLines = loadDataFrom("./src/day21/monkeyMath.exampledata.txt");
  const { monkeyValues, monkeyOperations } = parseInputData(inputLines);
  const rootsValue = processCalculations(monkeyValues, monkeyOperations);
  expect(rootsValue).toBe(152);
});

test("part 1 - puzzle data", () => {
  const inputLines = loadDataFrom("./src/day21/monkeyMath.puzzledata.txt");
  const { monkeyValues, monkeyOperations } = parseInputData(inputLines);
  const rootsValue = processCalculations(monkeyValues, monkeyOperations);
  expect(rootsValue).toBe(152479825094094);
});

test("part 2 - example data", () => {
  const inputLines = loadDataFrom("./src/day21/monkeyMath.exampledata.txt");
  const { monkeyValues, monkeyOperations } = parseInputData(inputLines);
  const humnValue = findHumnValue(monkeyValues, monkeyOperations);
  expect(humnValue).toBe(301);
});

test("part 2 - puzzle data", () => {
  const inputLines = loadDataFrom("./src/day21/monkeyMath.puzzledata.txt");
  const { monkeyValues, monkeyOperations } = parseInputData(inputLines);
  const humnValue = findHumnValue(monkeyValues, monkeyOperations);
  expect(humnValue).toBe(3360561285172);
});
