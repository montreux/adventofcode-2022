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

export function findHighestScoringRouteWithElephant(
  allValves: Map<string, ValveAsNode>
) {
  const timeRemaining = 26;
  const startValve = allValves.get("AA")!;
  let bestScore = 0;
  let bestRoute: string[] = [];
  let timeBestRouteFinalised = -1;

  dfs(timeRemaining, startValve, 0, startValve, 0, 0, 0, []);

  return bestScore;

  function dfs(
    timeRemaining: number,
    agentOneCurrentValve: ValveAsNode,
    agentOneTimeToValve: number,
    agentTwoCurrentValve: ValveAsNode,
    agentTwoTimeToValve: number,
    currentPressureRelieved: number,
    pressureReliefFlowRate: number,
    openValves: ValveAsNode[]
  ) {
    const isCurrentValveAgentOne = agentOneTimeToValve == 0;
    const currentValve = isCurrentValveAgentOne
      ? agentOneCurrentValve
      : agentTwoCurrentValve;
    // timeToOpenCurrentValve must be 0
    const otherValve = !isCurrentValveAgentOne
      ? agentOneCurrentValve
      : agentTwoCurrentValve;
    const timeUntilOtherAgentOpensValve = !isCurrentValveAgentOne
      ? agentOneTimeToValve
      : agentTwoTimeToValve;

    const valvesThatCouldBeOpened = [...allValves.values()].filter(
      (valve) => !openValves.includes(valve) && valve.flowRate > 0
    );
    for (const nextValve of valvesThatCouldBeOpened) {
      const timeToReachAndOpenNextValve =
        currentValve.shortestPaths.get(nextValve.id)!.length + 1;
      const isWorthOpening = timeRemaining - timeToReachAndOpenNextValve > 1;
      if (isWorthOpening) {
        const newOpenValves = [...openValves, nextValve];
        const newAgentOneCurrentValve = isCurrentValveAgentOne
          ? nextValve
          : agentOneCurrentValve;
        const newAgentTwoCurrentValve = !isCurrentValveAgentOne
          ? nextValve
          : agentTwoCurrentValve;

        if (timeToReachAndOpenNextValve <= timeUntilOtherAgentOpensValve) {
          // The new valve for the current agent will be opened first
          const newTimeRemaining = timeRemaining - timeToReachAndOpenNextValve;
          const newAgentOneTimeToValve = isCurrentValveAgentOne
            ? timeToReachAndOpenNextValve
            : agentOneTimeToValve - timeToReachAndOpenNextValve;
          const newAgentTwoTimeToValve = !isCurrentValveAgentOne
            ? timeToReachAndOpenNextValve
            : agentTwoTimeToValve - timeToReachAndOpenNextValve;

          const newPressureRelieved =
            currentPressureRelieved +
            timeToReachAndOpenNextValve * pressureReliefFlowRate;
          const newPressureReliefFlowRate =
            pressureReliefFlowRate + nextValve.flowRate;

          dfs(
            newTimeRemaining,
            newAgentOneCurrentValve,
            newAgentOneTimeToValve,
            newAgentTwoCurrentValve,
            newAgentTwoTimeToValve,
            newPressureRelieved,
            newPressureReliefFlowRate,
            newOpenValves
          );
        } else {
          const newTimeRemaining =
            timeRemaining - timeUntilOtherAgentOpensValve;
          const newAgentOneTimeToValve = !isCurrentValveAgentOne
            ? agentOneTimeToValve - timeUntilOtherAgentOpensValve
            : timeToReachAndOpenNextValve - timeUntilOtherAgentOpensValve;
          const newAgentTwoTimeToValve = isCurrentValveAgentOne
            ? agentTwoTimeToValve - timeUntilOtherAgentOpensValve
            : timeToReachAndOpenNextValve - timeUntilOtherAgentOpensValve;
          const newPressureRelieved =
            currentPressureRelieved +
            timeUntilOtherAgentOpensValve * pressureReliefFlowRate;
          const newPressureReliefFlowRate =
            pressureReliefFlowRate + otherValve.flowRate;

          dfs(
            newTimeRemaining,
            newAgentOneCurrentValve,
            newAgentOneTimeToValve,
            newAgentTwoCurrentValve,
            newAgentTwoTimeToValve,
            newPressureRelieved,
            newPressureReliefFlowRate,
            newOpenValves
          );
        }
      }
    }

    const finalPressureRelieved =
      currentPressureRelieved + timeRemaining * pressureReliefFlowRate;
    if (finalPressureRelieved > bestScore) {
      bestScore = finalPressureRelieved;
      bestRoute = openValves.map((valve) => valve.id).sort();
      timeBestRouteFinalised = timeRemaining;
    }
  }
}
