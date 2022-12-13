type Tree = {
  height: number;
  isVisible: boolean;
  viewingDistances: number[];
  scenicScore: number;
};

export function buildTreeModel(inputData: string[]): Tree[][] {
  const forest: Tree[][] = [];
  for (const rowText of inputData) {
    const treeRow = [...rowText].map((treeText) => {
      const treeHeight = Number.parseInt(treeText);
      return {
        height: treeHeight,
        isVisible: false,
        viewingDistances: [],
        scenicScore: 0,
      } as Tree;
    });
    forest.push(treeRow);
  }

  populateIsVisibleLeftToRight(forest);
  let rotatedForest = rotate(forest);
  populateIsVisibleLeftToRight(rotatedForest);
  rotatedForest = rotate(rotatedForest);
  populateIsVisibleLeftToRight(rotatedForest);
  rotatedForest = rotate(rotatedForest);
  populateIsVisibleLeftToRight(rotatedForest);

  populateViewingDistanceLeftToRight(forest);
  rotatedForest = rotate(forest);
  populateViewingDistanceLeftToRight(rotatedForest);
  rotatedForest = rotate(rotatedForest);
  populateViewingDistanceLeftToRight(rotatedForest);
  rotatedForest = rotate(rotatedForest);
  populateViewingDistanceLeftToRight(rotatedForest);

  populateScenicScore(forest);

  return forest;
}

function populateIsVisibleLeftToRight(forest: Tree[][]) {
  for (const treeRow of forest) {
    let maxTreeHeight = -1;
    for (const tree of treeRow) {
      const isVisibleFromLeft = tree.height > maxTreeHeight;
      tree.isVisible = tree.isVisible || isVisibleFromLeft;
      maxTreeHeight = Math.max(maxTreeHeight, tree.height);
    }
  }
}

function populateViewingDistanceLeftToRight(forest: Tree[][]) {
  for (const treeRow of forest) {
    const viewingDistanceByHeight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (const tree of treeRow) {
      const viewingDistance = viewingDistanceByHeight[tree.height];
      tree.viewingDistances.push(viewingDistance);
      viewingDistanceByHeight.fill(0, 0, tree.height + 1);
      for (let index = 0; index <= 9; index++) {
        viewingDistanceByHeight[index] += 1;
      }
    }
  }
}

function populateScenicScore(forest: Tree[][]) {
  for (const treeRow of forest) {
    for (const tree of treeRow) {
      tree.scenicScore = tree.viewingDistances.reduce(
        (previousValue, currentValue) => previousValue * currentValue,
        1
      );
    }
  }
}

export function findMaxScenicScore(forest: Tree[][]): Tree {
  let bestTree = forest[0][0];

  for (const treeRow of forest) {
    for (const tree of treeRow) {
      if (tree.scenicScore > bestTree.scenicScore) {
        bestTree = tree;
      }
    }
  }
  return bestTree;
}

function rotate(matrix: any[][]) {
  return matrix[0].map((_val, index) =>
    matrix.map((row) => row[index]).reverse()
  );
}

export function countVisibleTrees(forest: Tree[][]): number {
  let visibleTreeCount = 0;

  for (const treeRow of forest) {
    for (const tree of treeRow) {
      if (tree.isVisible) {
        visibleTreeCount += 1;
      }
    }
  }

  return visibleTreeCount;
}
