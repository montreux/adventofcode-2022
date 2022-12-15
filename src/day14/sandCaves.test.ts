import { z } from "zod";
import * as fs from "fs";
import { loadDataFrom } from "../textFileReader";
import {
  parseLines,
  generateCaveModel,
  simulateSand,
  generateCaveModelWithFloor,
} from "./sandCaves";

const Diagram = z.object({
  index: z.number(),
  diagram: z.string(),
});
const Diagrams = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  diagrams: z.array(Diagram),
});

type Diagram = z.infer<typeof Diagram>;
type Diagrams = z.infer<typeof Diagrams>;

test("parse example json", () => {
  const dataBuffer = fs.readFileSync(
    "./src/day14/sandCaves.exampleDiagrams.json",
    "utf-8"
  );

  const diagrams = Diagrams.parse(JSON.parse(dataBuffer));

  expect(diagrams.diagrams).toHaveLength(6);

  //   const textPicture = [...diagrams.diagrams]
  //     .map<string>((value) => {
  //       return `=== ${value.index} ===\n\n${value.diagram}`;
  //     })
  //     .join("\n\n");
  //   console.log(textPicture);
});

test("Input data parser", () => {
  const testData = [
    "498,4 -> 498,6 -> 496,6",
    "503,4 -> 502,4 -> 502,9 -> 494,9",
  ];

  const lines = parseLines(testData);

  expect(lines).toHaveLength(2);
  expect(JSON.stringify(lines, null, 2)).toBe(
    `[
  [
    {
      "x": 498,
      "y": 4
    },
    {
      "x": 498,
      "y": 6
    },
    {
      "x": 496,
      "y": 6
    }
  ],
  [
    {
      "x": 503,
      "y": 4
    },
    {
      "x": 502,
      "y": 4
    },
    {
      "x": 502,
      "y": 9
    },
    {
      "x": 494,
      "y": 9
    }
  ]
]`
  );
});

test("generateCaveDiagram - Example data", () => {
  const testData = [
    "498,4 -> 498,6 -> 496,6",
    "503,4 -> 502,4 -> 502,9 -> 494,9",
  ];

  const lines = parseLines(testData);
  const caveModel = generateCaveModel(lines);

  const dataBuffer = fs.readFileSync(
    "./src/day14/sandCaves.exampleDiagrams.json",
    "utf-8"
  );
  const expectedDiagrams = Diagrams.parse(JSON.parse(dataBuffer));
  const actualDiagram = caveModel.visualization
    .map((rowCells) => rowCells.join(""))
    .join("\n");
  expect(actualDiagram).toBe(expectedDiagrams.diagrams[0].diagram);
});

test("Add sand - example data", () => {
  const inputData = loadDataFrom("./src/day14/sandCaves.exampledata.txt");
  const lines = parseLines(inputData);
  const initialDiagram = generateCaveModel(lines);
  const numSandGrainsAdded = simulateSand(initialDiagram);
  expect(numSandGrainsAdded).toBe(24);
});

test("Add sand - input data", () => {
  const inputData = loadDataFrom("./src/day14/sandCaves.data.txt");
  const lines = parseLines(inputData);
  const initialDiagram = generateCaveModel(lines);
  const numSandGrainsAdded = simulateSand(initialDiagram);
  expect(numSandGrainsAdded).toBe(757);
});

test("Add sand with floor - example data", () => {
  const inputData = loadDataFrom("./src/day14/sandCaves.exampledata.txt");
  const lines = parseLines(inputData);
  const initialDiagram = generateCaveModelWithFloor(lines);
  const numSandGrainsAdded = simulateSand(initialDiagram);
  expect(numSandGrainsAdded).toBe(93);
});

test("Add sand with floor - input data", () => {
  const inputData = loadDataFrom("./src/day14/sandCaves.data.txt");
  const lines = parseLines(inputData);
  const caveModel = generateCaveModelWithFloor(lines);

  // const initialDiagram = caveModel.visualization
  //   .map((rowCells) => rowCells.join(""))
  //   .join("\n");
  // console.log(initialDiagram);

  const numSandGrainsAdded = simulateSand(caveModel);
  expect(numSandGrainsAdded).toBe(24943);

  // const finalDiagram = caveModel.visualization
  //   .map((rowCells) => rowCells.join(""))
  //   .join("\n");
  // console.log(finalDiagram);
});
