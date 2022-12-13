import { loadDataFrom } from "../textFileReader";
import {
  buildTreeModel,
  countVisibleTrees,
  findMaxScenicScore,
} from "./treeHouse";

test("count visible trees - example data", () => {
  const testData = loadDataFrom("./src/day08/treeHouse.exampleData.txt");
  const treeModel = buildTreeModel(testData);

  expect(treeModel[0][0].isVisible).toBe(true);
  expect(treeModel[0][0].height).toBe(3);

  const numberOfVisibleTrees = countVisibleTrees(treeModel);
  expect(numberOfVisibleTrees).toBe(21);
});

test("count visible trees - part one", () => {
  const testData = loadDataFrom("./src/day08/treeHouse.data.txt");
  const treeModel = buildTreeModel(testData);
  const numberOfVisibleTrees = countVisibleTrees(treeModel);
  expect(numberOfVisibleTrees).not.toBe(0);

  console.log(`${numberOfVisibleTrees} visible trees`);
});

test("viewing distance - example data", () => {
  const testData = loadDataFrom("./src/day08/treeHouse.exampleData.txt");
  const treeModel = buildTreeModel(testData);

  const a1 = JSON.stringify(treeModel[0][0].viewingDistances);
  expect(a1).toBe("[0,2,2,0]");
  const c2 = JSON.stringify(treeModel[1][2].viewingDistances);
  expect(c2).toBe("[1,2,2,1]");
  const c4 = JSON.stringify(treeModel[3][2].viewingDistances);
  expect(c4).toBe("[2,1,2,2]");
});

test("scenic score - example data", () => {
  const testData = loadDataFrom("./src/day08/treeHouse.exampleData.txt");
  const treeModel = buildTreeModel(testData);

  const c2 = treeModel[1][2];
  expect(c2.scenicScore).toBe(4);
  const c4 = treeModel[3][2];
  expect(c4.scenicScore).toBe(8);
});

test("scenic score - part2", () => {
  const testData = loadDataFrom("./src/day08/treeHouse.data.txt");
  const forest = buildTreeModel(testData);
  const bestTree = findMaxScenicScore(forest);

  expect(bestTree.scenicScore).not.toBe(0);

  console.log(`Tree with highest scenic score: ${JSON.stringify(bestTree)}`);
});
