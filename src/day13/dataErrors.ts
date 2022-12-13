export function findSumOfMatchingPairIndices(
  inputData: string[],
  debugOutput: string[] = []
): number {
  const pairs = getPairs(inputData);
  const indicesOfPairsInRightOrder = findIndicesOfPairsInRightOrder(
    pairs,
    debugOutput
  );

  // Sum indices of pairs in right order
  const sum = [0, ...indicesOfPairsInRightOrder].reduce((a, b) => a + b);

  return sum;
}

function getPairs(inputData: string[]) {
  const pairs: [string, string][] = [];
  for (let index = 0; index < inputData.length - 1; index += 3) {
    pairs.push([inputData[index], inputData[index + 1]]);
  }
  return pairs;
}

function findIndicesOfPairsInRightOrder(
  pairs: [string, string][],
  debugOutput: string[] = []
) {
  const indicesOfPairsInRightOrder: number[] = []; // 1-based
  pairs.forEach(([left, right], zeroBasedPairIndex) => {
    const leftData = JSON.parse(left);
    const rightData = JSON.parse(right);

    const newDebugOutput: string[] = [];
    const doPairMatch = doPairsMatch(leftData, rightData, newDebugOutput);

    const successOrFailureSymbol = doPairMatch ? "✅" : "❌";
    if (doPairMatch) {
      indicesOfPairsInRightOrder.push(zeroBasedPairIndex + 1);
    }
    debugOutput.push(
      `== ${successOrFailureSymbol} Pair ${zeroBasedPairIndex + 1} ==`,
      ...newDebugOutput,
      "\n"
    );
  });

  return indicesOfPairsInRightOrder;
}

export function compareSignal(
  leftData: any,
  rightData: any,
  debugOutput: string[] = [],
  currentDepth = 0
): number {
  const leftType = typeof leftData;
  const rightType = typeof rightData;

  // If both values are integers, the lower integer should come first. If the left integer is lower than the right integer, the inputs are in the right order. If the left integer is higher than the right integer, the inputs are not in the right order. Otherwise, the inputs are the same integer; continue checking the next part of the input.
  if (leftType === "number" && rightType === "number") {
    return leftData - rightData;
  }

  // If both values are lists, compare the first value of each list, then the second value, and so on. If the left list runs out of items first, the inputs are in the right order. If the right list runs out of items first, the inputs are not in the right order. If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.
  if (leftType === "object" && rightType === "object") {
    // Assuming only have numbers and arrays, so all objects are arrays.
    let index = 0;
    for (const leftValue of leftData) {
      const rightListOutOfItems = index >= rightData.length;
      if (rightListOutOfItems) {
        return 1;
      }
      const comparisonResult = compareSignal(
        leftValue,
        rightData[index],
        debugOutput,
        currentDepth + 1
      );
      if (comparisonResult !== 0) {
        return comparisonResult;
      }
      index += 1;
    }
    // If the left list runs out of items first, the inputs are in the right order.
    if (leftData.length < rightData.length) {
      return -1;
    }
    if (leftData.length === rightData.length) {
      return 0;
    }
    throw new Error("!");
  }

  // If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, then retry the comparison. For example, if comparing [0,0,0] and 2, convert the right value to [2] (a list containing 2); the result is then found by instead comparing [0,0,0] and [2].
  if (leftType === "object" && rightType === "number") {
    if (leftData.length === 0) {
      return -1; // Left ran out of data
    }
    return compareSignal(leftData, [rightData], debugOutput, currentDepth + 1);
  } else if (leftType === "number" && rightType === "object") {
    return compareSignal([leftData], rightData, debugOutput, currentDepth + 1);
  }

  throw new Error("Should be unreachable");
}

export function doPairsMatch(
  leftData: any,
  rightData: any,
  debugOutput: string[] = [],
  currentDepth = 0
): boolean | undefined {
  const leftType = typeof leftData;
  const rightType = typeof rightData;

  // Validate types
  for (const type of [leftType, rightType]) {
    if (!["number", "object"].includes(type)) {
      throw new Error(`Unexpected type ${type}`);
    }
  }

  const debugIndentation = new Array<string>(2 * currentDepth)
    .fill(" ")
    .join("");
  debugOutput.push(
    `${debugIndentation}- Compare ${JSON.stringify(
      leftData
    )} vs ${JSON.stringify(rightData)}`
  );

  // If both values are integers, the lower integer should come first. If the left integer is lower than the right integer, the inputs are in the right order. If the left integer is higher than the right integer, the inputs are not in the right order. Otherwise, the inputs are the same integer; continue checking the next part of the input.
  if (leftType === "number" && rightType === "number") {
    if (leftData == rightData) {
      debugOutput.push(`${debugIndentation}↩️ ${leftData} == ${rightData}`);
      return undefined;
    }
    debugOutput.push(
      leftData < rightData
        ? `${debugIndentation}✅ ${leftData} < ${rightData}`
        : `${debugIndentation}❌ ${leftData} >= ${rightData}`
    );
    return leftData < rightData;
  }

  // If both values are lists, compare the first value of each list, then the second value, and so on. If the left list runs out of items first, the inputs are in the right order. If the right list runs out of items first, the inputs are not in the right order. If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.
  if (leftType === "object" && rightType === "object") {
    // Assuming only have numbers and arrays, so all objects are arrays.
    let index = 0;
    for (const leftValue of leftData) {
      const rightListOutOfItems = index >= rightData.length;
      if (rightListOutOfItems) {
        debugOutput.push(`${debugIndentation}❌ right out of data`);
        return false;
      }
      const doLeftAndRightMatch = doPairsMatch(
        leftValue,
        rightData[index],
        debugOutput,
        currentDepth + 1
      );
      if (doLeftAndRightMatch !== undefined) {
        return doLeftAndRightMatch;
      }
      index += 1;
    }
    // If the left list runs out of items first, the inputs are in the right order.
    if (leftData.length < rightData.length) {
      debugOutput.push(`${debugIndentation}✅ left out of items`);
      return true;
    }
    if (leftData.length === rightData.length) {
      debugOutput.push(`${debugIndentation}↩️ both out of items`);
      return undefined;
    }
    throw new Error("!");
  }

  // If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, then retry the comparison. For example, if comparing [0,0,0] and 2, convert the right value to [2] (a list containing 2); the result is then found by instead comparing [0,0,0] and [2].
  if (leftType === "object" && rightType === "number") {
    if (leftData.length === 0) {
      debugOutput.push(`${debugIndentation}✅ left out of items`);
      return true; // Left ran out of data
    }
    return doPairsMatch(leftData, [rightData], debugOutput, currentDepth + 1);
  } else if (leftType === "number" && rightType === "object") {
    return doPairsMatch([leftData], rightData, debugOutput, currentDepth + 1);
  }

  throw new Error("Should be unreachable");
}
