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
  let bestScore = 0;
  // let bestStory = new Map<number, string[]>();

  dfs(timeRemaining, startValve, 0, startValve, 0, 0, 0, []);

  // printStory(bestStory, timeRemaining, bestScore);

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
    // storyLog: Map<number, string[]>,
    // openOrder: string[]
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

      // if (isAgentOneAtDestination) {
      //   openOrder.push(agentOneDestinationValve.id);
      // }
      // if (isAgentTwoAtDestination) {
      //   openOrder.push(agentTwoDestinationValve.id);
      // }

      //Log
      // const currentMinute = 26 - timeRemaining + 1;
      // const logForMinute = [...(storyLog.get(currentMinute) ?? [])];
      // if (openValves.length == 0) {
      //   logForMinute.push("No valves are open.");
      // } else {
      //   if (isAgentOneAtDestination) {
      //     logForMinute.push(
      //       `Agent 1 has opened ${agentOneDestinationValve.id}`
      //     );
      //   }
      //   if (isAgentTwoAtDestination) {
      //     logForMinute.push(
      //       `Agent 2 has opened ${agentTwoDestinationValve.id}`
      //     );
      //   }
      //   logForMinute.push(
      //     `Valves ${openValves
      //       .filter(
      //         (valve) =>
      //           !(
      //             valve == agentOneDestinationValve && agentOneTimeToValve > 0
      //           ) &&
      //           !(valve == agentTwoDestinationValve && agentTwoTimeToValve > 0)
      //       )
      //       .map((valve) => valve.id)
      //       .sort()
      //       .join(
      //         ", "
      //       )} are open, releasing ${newPressureReliefFlowRate} pressure.`
      //   );
      //   logForMinute.push(
      //     `${currentPressureRelieved} pressure currently relieved`
      //   );
      // }
      // storyLog.set(currentMinute, logForMinute);

      const valvesThatCouldBeOpened = [...allValves.values()].filter(
        (valve) => !openValves.includes(valve) && valve.flowRate > 0
      );

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
            // const isAtJjDdDecisionPoint =
            //   currentMinute == 1 &&
            //   nextAgentOneValve.id == "JJ" &&
            //   nextAgentTwoValve.id == "DD";
            // if (isAtJjDdDecisionPoint) {
            //   debugger;
            // }
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

            // const isNowhereForAgentOneToGo =
            //   isAgentOneAtDestination &&
            //   nextAgentOneValve.id == agentOneDestinationValve.id;
            // if (isNowhereForAgentOneToGo) {
            //   newAgentOneTimeToValve = Number.MAX_SAFE_INTEGER;
            // }
            // const isNowhereForAgentTwoToGo =
            //   isAgentTwoAtDestination &&
            //   nextAgentTwoValve.id == agentTwoDestinationValve.id;
            // if (isNowhereForAgentTwoToGo) {
            //   newAgentTwoTimeToValve = Number.MAX_SAFE_INTEGER;
            // }

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
              // const newOpenOrder = [...openOrder];
              if (isAgentOneAtDestination) {
                newOpenValves.push(nextAgentOneValve);
              }
              if (isAgentTwoAtDestination) {
                newOpenValves.push(nextAgentTwoValve);
              }

              // const newStoryLog = new Map<number, string[]>(storyLog.entries());
              // const logForMinute = [...(newStoryLog.get(currentMinute) ?? [])];

              // logForMinute.push(
              //   `Agent 1 heading to ${nextAgentOneValve.id}, open in ${newAgentOneTimeToValve} minutes.`
              // );
              // logForMinute.push(
              //   `Agent 2 heading to ${nextAgentTwoValve.id}, open in ${newAgentTwoTimeToValve} minutes.`
              // );

              // newStoryLog.set(currentMinute, logForMinute);

              dfs(
                newTimeRemaining,
                nextAgentOneValve,
                nextAgentOneTimeToValve,
                nextAgentTwoValve,
                nextAgentTwoTimeToValve,
                newCurrentPressureRelieved,
                newPressureReliefFlowRate,
                newOpenValves
                // storyLog,
                // newOpenOrder
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

    // const openOrderText = openOrder
    //   .filter((valveID) => valveID !== "AA")
    //   .join(", ");
    // if (openOrderText == "DD, JJ, BB, HH, CC, EE") {
    //   debugger;
    // }

    if (finalPressureRelieved > bestScore) {
      bestScore = finalPressureRelieved;

      // const currentMinute = 26 - timeRemaining + 1;
      // const logForMinute = [...(storyLog.get(currentMinute) ?? [])];
      // logForMinute.push(``, `(At this point, all valves are open.)`);
      // logForMinute.push(`Valve open order: ${openOrderText}`);

      // logForMinute.push(
      //   `Final pressure: ${finalPressureRelieved}, timeRemaining: ${timeRemaining}`
      // );
      // storyLog.set(currentMinute, logForMinute);

      // bestStory = storyLog;
    }
  }
}

function printStory(
  bestStory: Map<number, string[]>,
  timeRemaining: number,
  bestScore: number
) {
  const storyLines: string[] = [];

  const timesWithLogEntries = bestStory.keys();
  for (const minute of timesWithLogEntries) {
    storyLines.push("", `== Minute ${minute} ==`);
    const logForMinute = bestStory.get(minute) ?? [];
    storyLines.push(...logForMinute, "");
  }
  storyLines.push(
    `With the elephant helping, after ${timeRemaining} minutes, the best you could do would release a total of ${bestScore} pressure.`
  );
  console.log(storyLines.join("\n"));
}
