export type TerrainMap = {
  start: [number, number];
  end: [number, number];
  map: number[][];
};

export function parseTerrainMap(inputData: string[]): TerrainMap {
  let start: [number, number] = [-1, -1];
  let end: [number, number] = [-1, -1];
  const rows: number[][] = [];

  inputData.forEach((inputLine, rowIndex) => {
    const heights = [...inputLine].map((textValue, columnIndex) => {
      if (textValue === "S") {
        start = [rowIndex, columnIndex];
        return -1;
      }
      if (textValue === "E") {
        end = [rowIndex, columnIndex];
        return -2;
      }
      return textValue.charCodeAt(0) - "a".charCodeAt(0);
    });
    rows.push(heights);
  });

  return { start, end, map: rows };
}

export function routeFromRouteMap(
  inputData: string[],
  start: [number, number]
): [number, number][] {
  let currentRow = start[0];
  let currentColumn = start[1];
  const route: [number, number][] = [];

  let currentDirection = "";
  do {
    route.push([currentRow, currentColumn]);
    currentDirection = [...inputData[currentRow]][currentColumn];

    switch (currentDirection) {
      case "v":
        currentRow += 1;
        break;
      case "<":
        currentColumn -= 1;
        break;
      case "^":
        currentRow -= 1;
        break;
      case ">":
        currentColumn += 1;
        break;
      case "E":
        route.pop();
        break;
      default:
        throw new Error(
          `Unexpected direction ${currentDirection} at position[${currentRow},${currentColumn}]`
        );
    }
  } while (currentDirection !== "E");

  return route;
}

export function buildRouteMap(
  routePositions: [number, number][],
  terrainMap: TerrainMap
): string {
  const map: string[][] = [];
  const numRows = terrainMap.map.length;
  const numColumns = terrainMap.map[0].length;
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    map.push(new Array<string>(numColumns).fill("."));
  }

  routePositions.forEach((position, routeIndex) => {
    const isEnd = routeIndex === routePositions.length - 1;
    const nextPosition = isEnd
      ? terrainMap.end
      : routePositions[routeIndex + 1];
    const rowDiff = nextPosition[0] - position[0];
    const columnDiff = nextPosition[1] - position[1];

    let symbol = "!";
    if (rowDiff === 1) {
      symbol = "v";
    } else if (rowDiff === -1) {
      symbol = "^";
    } else if (columnDiff === 1) {
      symbol = ">";
    } else if (columnDiff === -1) {
      symbol = "<";
    } else {
      throw new Error(
        `Unexpected route at index ${routeIndex}. From ${position} to ${nextPosition}`
      );
    }
    map[position[0]][position[1]] = symbol;
  });

  map[terrainMap.end[0]][terrainMap.end[1]] = "E";

  const routeMapText = map
    .map((columnTextValues) => columnTextValues.join(""))
    .join("\n");
  return routeMapText;
}

export function dijkstrasAlgorithm(terrainMap: TerrainMap): [number, number][] {
  const numRows = terrainMap.map.length;
  const numColumns = terrainMap.map[0].length;

  // 1. Mark all nodes unvisited. Create a set of all the unvisited nodes called the unvisited set.
  const unvisitedSet = new Set<[number, number]>();
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
      unvisitedSet.add([rowIndex, columnIndex]);
    }
  }

  // 2. Assign to every node a tentative distance value: set it to zero for our initial node and to infinity for all other nodes. During the run of the algorithm, the tentative distance of a node v is the length of the shortest path discovered so far between the node v and the starting node. Since initially no path is known to any other vertex than the source itself (which is a path of length zero), all other tentative distances are initially set to infinity. Set the initial node as current.
  const tentativeDistances: number[][] = [];
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    tentativeDistances.push(
      new Array<number>(numColumns).fill(Number.MAX_SAFE_INTEGER)
    );
  }
  let currentNodeRow = terrainMap.start[0];
  let currentNodeColumn = terrainMap.start[1];
  tentativeDistances[currentNodeRow][currentNodeColumn] = 0;

  let shouldContinue = false;

  do {
    // 3. For the current node, consider all of its unvisited neighbors and calculate their tentative distances through the current node. Compare the newly calculated tentative distance to the one currently assigned to the neighbor and assign it the smaller one. For example, if the current node A is marked with a distance of 6, and the edge connecting it with a neighbor B has length 2, then the distance to B through A will be 6 + 2 = 8. If B was previously marked with a distance greater than 8 then change it to 8. Otherwise, the current value will be kept.

    // Find positions of nodes L,R,U,D
    const leftNodePosition: [number, number] = [
      currentNodeRow,
      currentNodeColumn - 1,
    ];
    const rightNodePosition: [number, number] = [
      currentNodeRow,
      currentNodeColumn + 1,
    ];
    const upNodePosition: [number, number] = [
      currentNodeRow - 1,
      currentNodeColumn,
    ];
    const downNodePosition: [number, number] = [
      currentNodeRow + 1,
      currentNodeColumn,
    ];
    const nodesToInspect: [number, number][] = [
      leftNodePosition,
      rightNodePosition,
      upNodePosition,
      downNodePosition,
    ];

    // Filter to be in unvisited set
    const unvisitedNodesToInspect = nodesToInspect.filter(
      ([rowIndex, columnIndex]) => {
        for (const unvisitedNode of unvisitedSet) {
          if (
            unvisitedNode[0] === rowIndex &&
            unvisitedNode[1] === columnIndex
          ) {
            return true;
          }
        }
        return false;
      }
    );

    // Filter to be possible to reach
    const currentHeight = terrainMap.map[currentNodeRow][currentNodeColumn];
    const reachableUnvisitedNodes = unvisitedNodesToInspect.filter(
      ([rowIndex, columnIndex]) => {
        const nodeHeight = terrainMap.map[rowIndex][columnIndex];
        return nodeHeight <= currentHeight + 1;
      }
    );

    // Calculate tentative distance for each node as current+1
    // Set tentative distances of nodes to the min of calculated and value and their curent value
    const currentNodeTentativeDistance =
      tentativeDistances[currentNodeRow][currentNodeColumn];
    for (const reachableNode of reachableUnvisitedNodes) {
      const tentativeDistanceOfNode =
        tentativeDistances[reachableNode[0]][reachableNode[1]];
      const newTentativeDistanceOfNode = Math.min(
        tentativeDistanceOfNode,
        currentNodeTentativeDistance + 1
      );
      tentativeDistances[reachableNode[0]][reachableNode[1]] =
        newTentativeDistanceOfNode;
    }

    // 4. When we are done considering all of the unvisited neighbors of the current node, mark the current node as visited and remove it from the unvisited set. A visited node will never be checked again (this is valid and optimal in connection with the behavior in step 6.: that the next nodes to visit will always be in the order of 'smallest distance from initial node first' so any visits after would have a greater distance).
    for (const unvisitedNode of unvisitedSet) {
      if (
        unvisitedNode[0] === currentNodeRow &&
        unvisitedNode[1] === currentNodeColumn
      ) {
        unvisitedSet.delete(unvisitedNode);
        break;
      }
    }

    // 5. If the destination node has been marked visited (when planning a route between two specific nodes) or if the smallest tentative distance among the nodes in the unvisited set is infinity (when planning a complete traversal; occurs when there is no connection between the initial node and remaining unvisited nodes), then stop. The algorithm has finished.
    const haveVisitedEveryNode = unvisitedSet.size === 0;
    let nextNode = [-1, -1];
    let tentativeDistanceOfNextNode = Number.MAX_SAFE_INTEGER;
    if (!haveVisitedEveryNode) {
      const allUnvisitedNodes = Array.from(unvisitedSet.values());
      //   const allReachableUnvisitedNodes = allUnvisitedNodes.filter(
      //     ([rowIndex, columnIndex]) => {
      //       const isAdjacent =
      //         (Math.abs(currentNodeRow - rowIndex) <= 1 &&
      //           currentNodeColumn === columnIndex) ||
      //         (Math.abs(currentNodeColumn - columnIndex) <= 1 &&
      //           currentNodeRow === rowIndex);
      //       if (!isAdjacent) {
      //         return false;
      //       }
      //       const nodeHeight = terrainMap.map[rowIndex][columnIndex];
      //       return nodeHeight <= currentHeight + 1;
      //     }
      //   );

      //   if (allReachableUnvisitedNodes.length === 0) {
      //     throw new Error("Aha!");
      //   }
      nextNode =
        allUnvisitedNodes.length === 1
          ? allUnvisitedNodes[0]
          : allUnvisitedNodes.sort(
              (a, b) =>
                tentativeDistances[a[0]][a[1]] - tentativeDistances[b[0]][b[1]]
            )[0];
      tentativeDistanceOfNextNode =
        tentativeDistances[nextNode[0]][nextNode[1]];
    }
    const haveNoMoreReachableNodes =
      tentativeDistanceOfNextNode === Number.MAX_SAFE_INTEGER;

    // 6. Otherwise, select the unvisited node that is marked with the smallest tentative distance, set it as the new current node, and go back to step 3.
    shouldContinue = !haveVisitedEveryNode && !haveNoMoreReachableNodes;
    if (shouldContinue) {
      currentNodeRow = nextNode[0];
      currentNodeColumn = nextNode[1];
    }

    // When planning a route, it is actually not necessary to wait until the destination node is "visited" as above: the algorithm can stop once the destination node has the smallest tentative distance among all "unvisited" nodes (and thus could be selected as the next "current").
    const isNextNodeTheDestination = nextNode === terrainMap.end;
    if (isNextNodeTheDestination) {
      // Still need to write the distance to the end node
      tentativeDistances[currentNodeRow][currentNodeColumn] =
        currentNodeTentativeDistance + 1;
    }
    shouldContinue &&= !isNextNodeTheDestination;
  } while (shouldContinue);

  // Now find our route by walking back from our destination
  const shortestRoute: [number, number][] = [];
  currentNodeRow = terrainMap.end[0];
  currentNodeColumn = terrainMap.end[1];
  do {
    // Find the reachable adjacent node with a lower tentative distance

    const leftNodePosition: [number, number] = [
      currentNodeRow,
      currentNodeColumn - 1,
    ];
    const rightNodePosition: [number, number] = [
      currentNodeRow,
      currentNodeColumn + 1,
    ];
    const upNodePosition: [number, number] = [
      currentNodeRow - 1,
      currentNodeColumn,
    ];
    const downNodePosition: [number, number] = [
      currentNodeRow + 1,
      currentNodeColumn,
    ];
    const nodesToInspect: [number, number][] = [
      leftNodePosition,
      rightNodePosition,
      upNodePosition,
      downNodePosition,
    ];

    // Filter to be possible to reach
    const currentHeight = terrainMap.map[currentNodeRow][currentNodeColumn];
    const reachableNodes = nodesToInspect.filter(([rowIndex, columnIndex]) => {
      const isIllegalPosition =
        rowIndex < 0 ||
        columnIndex < 0 ||
        rowIndex >= numRows ||
        columnIndex >= numColumns;
      if (isIllegalPosition) {
        return false;
      }
      const nodeHeight = terrainMap.map[rowIndex][columnIndex];
      const isReachable =
        currentHeight == -2 || nodeHeight >= currentHeight - 1;
      return isReachable;
    });

    let previousNode: [number, number] = reachableNodes[0];
    if (reachableNodes.length > 1) {
      const isEnd =
        currentNodeRow == terrainMap.end[0] &&
        currentNodeColumn == terrainMap.end[1];
      if (isEnd) {
        // The previous node is the highest reachable
        previousNode = reachableNodes.sort(
          ([rowIndexA, columnIndexA], [rowIndexB, columnIndexB]) => {
            const aHeight = terrainMap.map[rowIndexA][columnIndexA];
            const bHeight = terrainMap.map[rowIndexB][columnIndexB];
            return bHeight - aHeight;
          }
        )[0];
      } else {
        // Find the node with currentTentativeDistance - 1
        const currentTentativeDistance =
          tentativeDistances[currentNodeRow][currentNodeColumn];
        previousNode = reachableNodes.find(
          ([rowIndex, columnIndex]) =>
            tentativeDistances[rowIndex][columnIndex] ===
            currentTentativeDistance - 1
        )!;
        if (!previousNode) {
          throw new Error("Find previous node failed.");
        }
      }
    }
    currentNodeRow = previousNode[0];
    currentNodeColumn = previousNode[1];

    // Insert node at the start of the route
    shortestRoute.unshift([currentNodeRow, currentNodeColumn]);
  } while (
    !(
      currentNodeRow == terrainMap.start[0] &&
      currentNodeColumn == terrainMap.start[1]
    )
  );

  return shortestRoute;
}
