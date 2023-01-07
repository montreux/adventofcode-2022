import { loadDataFrom } from "../textFileReader";
import { findHighestScoringRoute } from "./take2";
import { parseInputData } from "./Valve";
import { valvesToNodes } from "./ValvesToNodesAndEdges";

test("findHighestScoringRoute - input data", () => {
  const inputData = loadDataFrom("./src/day16/elephantsInAVolcano.data.txt");
  const allValves = parseInputData(inputData);
  const allValvesAsNodes = valvesToNodes(allValves);
  const bestScore = findHighestScoringRoute(allValvesAsNodes);

  expect(bestScore).toBe(1796);
});

test("findHighestScoringRoute - example data", () => {
  const inputData = loadDataFrom(
    "./src/day16/elephantsInAVolcano.exampledata.txt"
  );
  const allValves = parseInputData(inputData);
  const allValvesAsNodes = valvesToNodes(allValves);
  const bestScore = findHighestScoringRoute(allValvesAsNodes);

  expect(bestScore).toBe(1651);
});
