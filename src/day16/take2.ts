// Track opened scoring valves
// Start at AA
// DFS: For all unopened scoring valves, trying going to each one (recurse).
// Once we run out of time, or no more valid moves, update the best score if higher

import { ValveAsNode } from "./ValvesToNodesAndEdges";

export function findHighestScoringRoute(allValves: Map<string, ValveAsNode>) {
  const timeRemaining = 30;
  const startValve = allValves.get("AA")!;
  let bestScore = 0;
  let bestRoute: ValveAsNode[] = [];

  dfs(timeRemaining, startValve, 0, 0, []);

  return bestScore;

  function dfs(
    timeRemaining: number,
    currentValve: ValveAsNode,
    currentPressureRelieved: number,
    pressureReliefFlowRate: number,
    openValves: ValveAsNode[]
  ) {
    const valvesThatCouldBeOpened = [...allValves.values()].filter(
      (valve) => !openValves.includes(valve) && valve.flowRate > 0
    );
    for (const nextValve of valvesThatCouldBeOpened) {
      const timeToReachAndOpenNextValve =
        currentValve.shortestPaths.get(nextValve.id)!.length + 1;
      if (timeRemaining - timeToReachAndOpenNextValve > 1) {
        const newTimeRemaining = timeRemaining - timeToReachAndOpenNextValve;
        const newPressureRelieved =
          currentPressureRelieved +
          timeToReachAndOpenNextValve * pressureReliefFlowRate;
        const newPressureReliefFlowRate =
          pressureReliefFlowRate + nextValve.flowRate;
        const newOpenValves = [...openValves, nextValve];
        dfs(
          newTimeRemaining,
          nextValve,
          newPressureRelieved,
          newPressureReliefFlowRate,
          newOpenValves
        );
      }
    }

    const finalPressureRelieved =
      currentPressureRelieved + timeRemaining * pressureReliefFlowRate;
    if (finalPressureRelieved > bestScore) {
      bestScore = finalPressureRelieved;
      bestRoute = [...openValves];
    }
  }
}
