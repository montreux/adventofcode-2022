// Track opened scoring valves
// Start at AA
// DFS: For all unopened scoring valves, trying going to each one (recurse).
// Once we run out of time, or no more valid moves, update the best score if higher

import { ValveAsNode } from "./ValvesToNodesAndEdges";

export function findHighestScoringRoute(allValves: Map<string, ValveAsNode>) {
  const timeRemaining = 30;
  const startValve = allValves.get("AA")!;
  let bestScore = 0;

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
    }
  }
}

type ValveOpeningState = {
  timeRemaining: number;
  agentOneCurrentValve: ValveAsNode;
  agentOneTimeToValve: number;
  agentTwoCurrentValve: ValveAsNode;
  agentTwoTimeToValve: number;
  currentPressureRelieved: number;
  pressureReliefFlowRate: number;
  openValves: ValveAsNode[];
};

export function findHighestScoringRouteWithElephant(
  allValves: Map<string, ValveAsNode>
) {
  const timeRemaining = 26;
  const startValve = allValves.get("AA")!;
  const maxFlowRate = [...allValves.values()]
    .map((valve) => valve.flowRate)
    .reduce((a, b) => a + b);
  let bestScore = 0;

  dfs(timeRemaining, startValve, 0, startValve, 0, 0, 0, []);

  return bestScore;

  function dfs(
    timeRemaining: number,
    agentOneDestinationValve: ValveAsNode,
    agentOneTimeToValve: number,
    agentTwoDestinationValve: ValveAsNode,
    agentTwoTimeToValve: number,
    currentPressureRelieved: number,
    pressureReliefFlowRate: number,
    openValves: ValveAsNode[]
  ) {
    const isAgentOneAtDestination = agentOneTimeToValve == 0;
    const isAgentTwoAtDestination = agentTwoTimeToValve == 0;
    let newPressureReliefFlowRate = pressureReliefFlowRate;
    if (isAgentOneAtDestination || isAgentTwoAtDestination) {
      newPressureReliefFlowRate += isAgentOneAtDestination
        ? agentOneDestinationValve.flowRate
        : 0;
      newPressureReliefFlowRate += isAgentTwoAtDestination
        ? agentTwoDestinationValve.flowRate
        : 0;

      const bestPossibleScore =
        currentPressureRelieved +
        newPressureReliefFlowRate +
        (timeRemaining - 1) * maxFlowRate;
      if (bestPossibleScore <= bestScore) {
        return;
      }

      const valvesThatCouldBeOpened = [...allValves.values()]
        .filter((valve) => !openValves.includes(valve) && valve.flowRate > 0)
        .sort((a, b) => b.flowRate - a.flowRate);

      if (valvesThatCouldBeOpened.length > 0) {
        const possibleNextAgentOneValves = isAgentOneAtDestination
          ? [...valvesThatCouldBeOpened]
          : [agentOneDestinationValve];
        const possibleNextAgentTwoValves = isAgentTwoAtDestination
          ? [...valvesThatCouldBeOpened]
          : [agentTwoDestinationValve];

        for (const nextAgentOneValve of possibleNextAgentOneValves) {
          for (const nextAgentTwoValve of possibleNextAgentTwoValves) {
            if (nextAgentTwoValve == nextAgentOneValve) {
              continue;
            }
            let newAgentOneTimeToValve = isAgentOneAtDestination
              ? agentOneDestinationValve.shortestPaths.get(
                  nextAgentOneValve.id
                )!.length + 1
              : agentOneTimeToValve;
            let newAgentTwoTimeToValve = isAgentTwoAtDestination
              ? agentTwoDestinationValve.shortestPaths.get(
                  nextAgentTwoValve.id
                )!.length + 1
              : agentTwoTimeToValve;

            const canGetToNextAgentOneValveInTime =
              timeRemaining - newAgentOneTimeToValve > 1;
            const canGetToNextAgentTwoValveInTime =
              timeRemaining - newAgentTwoTimeToValve > 1;

            if (
              canGetToNextAgentOneValveInTime ||
              canGetToNextAgentTwoValveInTime
            ) {
              // Fast forward
              const minTimeToNextValve = Math.min(
                newAgentOneTimeToValve,
                newAgentTwoTimeToValve
              );
              const newTimeRemaining = timeRemaining - minTimeToNextValve;
              const nextAgentOneTimeToValve =
                newAgentOneTimeToValve - minTimeToNextValve;
              const nextAgentTwoTimeToValve =
                newAgentTwoTimeToValve - minTimeToNextValve;
              const newCurrentPressureRelieved =
                currentPressureRelieved +
                newPressureReliefFlowRate * minTimeToNextValve;
              let newOpenValves = [...openValves];

              if (isAgentOneAtDestination) {
                newOpenValves.push(nextAgentOneValve);
              }
              if (isAgentTwoAtDestination) {
                newOpenValves.push(nextAgentTwoValve);
              }

              dfs(
                newTimeRemaining,
                nextAgentOneValve,
                nextAgentOneTimeToValve,
                nextAgentTwoValve,
                nextAgentTwoTimeToValve,
                newCurrentPressureRelieved,
                newPressureReliefFlowRate,
                newOpenValves
              );
            }
          }
        }
      }
    }

    // One valve may remain to be opened
    if (!isAgentOneAtDestination) {
      if (timeRemaining - agentOneTimeToValve > 1) {
        currentPressureRelieved +=
          agentOneTimeToValve * newPressureReliefFlowRate;
        newPressureReliefFlowRate += agentOneDestinationValve.flowRate;
        timeRemaining -= agentOneTimeToValve;
      }
    }
    if (!isAgentTwoAtDestination) {
      if (timeRemaining - agentTwoTimeToValve > 1) {
        currentPressureRelieved +=
          agentTwoTimeToValve * newPressureReliefFlowRate;
        newPressureReliefFlowRate += agentTwoDestinationValve.flowRate;
        timeRemaining -= agentTwoTimeToValve;
      }
    }

    // No more valves to open, calculate the final pressure
    const finalPressureRelieved =
      currentPressureRelieved + timeRemaining * newPressureReliefFlowRate;

    if (finalPressureRelieved > bestScore) {
      bestScore = finalPressureRelieved;
    }
  }
}
