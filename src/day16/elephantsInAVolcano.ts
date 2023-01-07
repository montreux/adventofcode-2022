import { assert } from "console";
import { Valve, valveArrayToMap } from "./Valve";

export enum Action {
  MOVE,
  OPEN,
  NOOP,
}
export type CaveAction = [Action, string | boolean];

export function calcRouteValue(
  valves: Map<string, Valve>,
  currentValveId: string,
  actions: CaveAction[]
): number {
  const openValves: Valve[] = [];
  let cumulativeValue = 0;
  let currentValve = valves.get(currentValveId)!;
  for (
    let minutesLeft = 30, actionIndex = 0;
    minutesLeft > 0;
    minutesLeft--, actionIndex++
  ) {
    // Score open valves
    for (const valve of openValves) {
      cumulativeValue += valve.flowRate;
    }

    // Perform action
    const currentAction = actions[actionIndex];
    if (currentAction[0] == Action.MOVE) {
      const nextValveId = currentAction[1] as string;
      assert(
        currentValve.connectedValveIds.includes(nextValveId),
        "Trying to move to unconnected valve."
      );
      currentValve = valves.get(nextValveId)!;
    } else if (currentAction[0] == Action.OPEN) {
      const shouldOpenCurrentValue = currentAction[1];
      if (shouldOpenCurrentValue) {
        openValves.push(currentValve);
      }
    }
  }
  return cumulativeValue;
}

export function findValvesWorthOpening(valves: Map<string, Valve>) {
  return valveArrayToMap(
    [...valves.values()].filter((valve) => valve.flowRate > 0)
  );
}

export function findAllScoringRoutes(
  valves: Map<string, Valve>,
  startingValveId: string,
  timeAvailable: number
): string[][] {
  const valvesIdsWorthOpening = [...valves.values()]
    .filter((valve) => valve.flowRate > 0)
    .map((valve) => valve.id);
  return findScoringRoutes(
    valves,
    startingValveId,
    valvesIdsWorthOpening,
    timeAvailable,
    [startingValveId]
  );
}

export function findScoringRoutes(
  valves: Map<string, Valve>,
  startingValveId: string,
  searchSet: string[],
  timeAvailable: number,
  currentRoute: string[]
): string[][] {
  const possibleNextValves = reachableValves(
    valves,
    startingValveId,
    searchSet,
    timeAvailable
  );

  if (possibleNextValves.length === 0) {
    return [currentRoute];
  }

  const routes: string[][] = [];
  for (const nextValveId of possibleNextValves) {
    const costToReach = plotRoute(valves, startingValveId, nextValveId).length;
    const newSearchSet = searchSet.filter((valveId) => valveId !== nextValveId);
    const availableRoutes = findScoringRoutes(
      valves,
      nextValveId,
      newSearchSet,
      timeAvailable - costToReach,
      [...currentRoute, nextValveId]
    );
    routes.push(...availableRoutes);
  }

  return routes;
}

export function findBestRoute(
  valves: Map<string, Valve>,
  startingValveId: string,
  timeAvailable: number
): [string[], number] {
  const valvesIdsWorthOpening = [...valves.values()]
    .filter((valve) => valve.flowRate > 0)
    .map((valve) => valve.id);

  const bestRoute = bestSubRoute(
    valves,
    startingValveId,
    valvesIdsWorthOpening,
    timeAvailable
  );

  const testNodeId1 = "HH:CC,EE";
  const routeCache1 = bestSubRoutes.get(testNodeId1);
  const testNodeId2 = "CC:EE,HH";
  const routeCache2 = bestSubRoutes.get(testNodeId2);

  // Reset cache
  bestSubRoutes.clear();

  return bestRoute;
}

type ValveValue = {
  costToReach: number;
  flowRate: number;
};

const bestSubRoutes = new Map<string, string[]>();
const subRouteValues = new Map<string, ValveValue[]>();

function calcValueOfRoute(
  valves: Map<string, Valve>,
  valveIds: string[],
  timeAvailable: number
): number {
  let totalValue = 0;
  let timeFlowRateApplied = timeAvailable;
  for (let index = 0; index < valveIds.length - 1; index++) {
    const valve = valves.get(valveIds[index])!;
    totalValue += valve.flowRate * timeFlowRateApplied;
    const costToReachNext = plotRoute(
      valves,
      valveIds[index],
      valveIds[index + 1]
    ).length;
    timeFlowRateApplied -= costToReachNext;
  }
  return totalValue;
}

export function bestSubRoute(
  valves: Map<string, Valve>,
  startingValveId: string,
  searchSet: string[],
  timeAvailable: number
): [string[], number] {
  // Early exit if previously calculated
  const nodeId = `${startingValveId}:${[...searchSet].sort().join()}`;
  if (bestSubRoutes.has(nodeId)) {
    const cachedRoute = bestSubRoutes.get(nodeId)!;
    const routeValue = calcValueOfRoute(valves, cachedRoute, timeAvailable);
    return [cachedRoute, routeValue];
  }

  const possibleNextValves = reachableValves(
    valves,
    startingValveId,
    searchSet,
    timeAvailable
  );

  if (possibleNextValves.length === 0) {
    // Can't reach any other valves in the available time
    return [[startingValveId], 0];
  }

  if (possibleNextValves.length === 1) {
    const nextValveId = possibleNextValves[0];
    const routeValue = calcValueOfRoute(
      valves,
      [startingValveId, nextValveId],
      timeAvailable
    );

    bestSubRoutes.set(nodeId, [startingValveId, nextValveId]);
    return [[startingValveId, nextValveId], routeValue];
  }

  let bestRoute: string[] = [];
  let bestRouteScore: number = -1;
  for (const nextValveId of possibleNextValves) {
    const costToReach = plotRoute(valves, startingValveId, nextValveId).length;
    const newSearchSet = searchSet.filter((valveId) => valveId !== nextValveId);
    const [subRoute, score] = bestSubRoute(
      valves,
      nextValveId,
      newSearchSet,
      timeAvailable - costToReach
    );

    if (score > bestRouteScore) {
      bestRouteScore = score;
      bestRoute = subRoute;
    }
  }

  const routeFromHere = [startingValveId, ...bestRoute];
  const valueFromHere = calcValueOfRoute(valves, routeFromHere, timeAvailable);

  bestSubRoutes.set(nodeId, routeFromHere);

  return [routeFromHere, valueFromHere];
}

export function calcScoringRouteValue(
  valves: Map<string, Valve>,
  scoringRoute: string[]
): number {
  const allActions: CaveAction[] = [];
  for (let index = 0; index < scoringRoute.length - 1; index++) {
    const fromValveId = scoringRoute[index];
    const toValveId = scoringRoute[index + 1];
    const actions = generateActionsToOpenValve(valves, fromValveId, toValveId);
    allActions.push(...actions);
  }
  const numNoopsToAdd = 30 - allActions.length;
  for (let index = 0; index < numNoopsToAdd; index++) {
    allActions.push([Action.NOOP, ""]);
  }
  const score = calcRouteValue(valves, scoringRoute[0], allActions);
  return score;
}

export function reachableValves(
  valves: Map<string, Valve>,
  currentValveId: string,
  availableValves: string[],
  timeAvailable: number
): string[] {
  return availableValves.filter(
    (valveId) =>
      plotRoute(valves, currentValveId, valveId).length < timeAvailable - 1
  );
}

export function bestActions(
  valves: Map<string, Valve>,
  startingValveId: string,
  movesLeft: number
): CaveAction[] {
  const actions: CaveAction[] = [];
  const openValves: string[] = [];
  let currentValveId = startingValveId;
  while (movesLeft - actions.length > 0) {
    const nextValveToOpen = bestNextValveToOpen(
      valves,
      openValves,
      currentValveId,
      movesLeft - actions.length
    );
    const haveValvesWorthOpening = nextValveToOpen.length > 0;
    if (haveValvesWorthOpening) {
      const newActions = generateActionsToOpenValve(
        valves,
        currentValveId,
        nextValveToOpen
      );
      openValves.push(nextValveToOpen);
      actions.push(...newActions);
    } else {
      // No Op the rest of actions
      for (let index = 0; index < movesLeft - actions.length; index++) {
        actions.push([Action.NOOP, ""]);
      }
    }
  }

  return actions;
}

export function bestNextValveToOpen(
  valves: Map<string, Valve>,
  openValves: string[],
  currentValveId: string,
  movesLeft: number
): string {
  const valvesThatCanBeOpened = [...valves.values()].filter(
    (valve) => !openValves.includes(valve.id)
  );
  const routesToValves = valvesThatCanBeOpened.map((valve) =>
    plotRoute(valves, currentValveId, valve.id)
  );
  const routesReachableInTime = routesToValves.filter(
    (route) => route.length < movesLeft - 2
  );
  const mapOfRoutes: Map<string, string[]> = routesReachableInTime.reduce<
    Map<string, string[]>
  >(
    (map, route) => map.set(route[route.length - 1], route),
    new Map<string, string[]>()
  );

  let bestFutureValue = Number.MIN_SAFE_INTEGER;
  let bestValveIdToOpen = "";
  for (const valveId of mapOfRoutes.keys()) {
    const routeToValve = mapOfRoutes.get(valveId)!;
    const timeLeftWhenReachedAndOpened = movesLeft - routeToValve.length;
    const futureValue =
      timeLeftWhenReachedAndOpened * valves.get(valveId)!.flowRate;
    if (futureValue > bestFutureValue) {
      bestFutureValue = futureValue;
      bestValveIdToOpen = valveId;
    }
  }

  return bestValveIdToOpen;
}

export function generateActionsToOpenValve(
  valves: Map<string, Valve>,
  currentValveId: string,
  valveIdToOpen: string
): CaveAction[] {
  const route = plotRoute(valves, currentValveId, valveIdToOpen);
  const actions: CaveAction[] = route.map((valveId) => [Action.MOVE, valveId]);
  actions.shift();
  actions.push([Action.OPEN, true]);

  return actions;
}

export function plotRoute(
  valves: Map<string, Valve>,
  fromValveId: string,
  toValveId: string
): string[] {
  // 1. Mark all nodes unvisited. Create a set of all the unvisited nodes called the unvisited set.
  const allValveIds = [...valves.values()].map((valve) => valve.id);
  const unvisitedSet = new Set<string>(allValveIds);

  // 2. Assign to every node a tentative distance value: set it to zero for our initial node and to infinity for all other nodes. During the run of the algorithm, the tentative distance of a node v is the length of the shortest path discovered so far between the node v and the starting node. Since initially no path is known to any other vertex than the source itself (which is a path of length zero), all other tentative distances are initially set to infinity. Set the initial node as current.
  const tentativeDistances: Map<string, number> = [...valves.values()].reduce<
    Map<string, number>
  >(
    (map, valve) => map.set(valve.id, Number.MAX_SAFE_INTEGER),
    new Map<string, number>()
  );
  tentativeDistances.set(fromValveId, 0);

  let shouldContinue = false;
  let currentValveId = fromValveId;

  do {
    // 3. For the current node, consider all of its unvisited neighbors and calculate their tentative distances through the current node. Compare the newly calculated tentative distance to the one currently assigned to the neighbor and assign it the smaller one. For example, if the current node A is marked with a distance of 6, and the edge connecting it with a neighbor B has length 2, then the distance to B through A will be 6 + 2 = 8. If B was previously marked with a distance greater than 8 then change it to 8. Otherwise, the current value will be kept.

    // Filter to be in unvisited set
    const connectedValveIds = valves.get(currentValveId)!.connectedValveIds;
    const unvisitedNodesToInspect = connectedValveIds.filter((valveId) =>
      unvisitedSet.has(valveId)
    );

    // Calculate tentative distance for each node as current+1
    // Set tentative distances of nodes to the min of calculated and value and their curent value
    const currentNodeTentativeDistance =
      tentativeDistances.get(currentValveId)!;
    for (const valveId of unvisitedNodesToInspect) {
      const tentativeDistanceOfNode = tentativeDistances.get(valveId)!;
      const newTentativeDistanceOfNode = Math.min(
        tentativeDistanceOfNode,
        currentNodeTentativeDistance + 1
      );
      tentativeDistances.set(valveId, newTentativeDistanceOfNode);
    }

    // 4. When we are done considering all of the unvisited neighbors of the current node, mark the current node as visited and remove it from the unvisited set. A visited node will never be checked again (this is valid and optimal in connection with the behavior in step 6.: that the next nodes to visit will always be in the order of 'smallest distance from initial node first' so any visits after would have a greater distance).
    unvisitedSet.delete(currentValveId);

    // 5. If the destination node has been marked visited (when planning a route between two specific nodes) or if the smallest tentative distance among the nodes in the unvisited set is infinity (when planning a complete traversal; occurs when there is no connection between the initial node and remaining unvisited nodes), then stop. The algorithm has finished.
    const haveVisitedEveryNode = unvisitedSet.size === 0;
    let nextValveId = "";
    let tentativeDistanceOfNextNode = Number.MAX_SAFE_INTEGER;
    if (!haveVisitedEveryNode) {
      const allUnvisitedNodes = Array.from(unvisitedSet.values());

      nextValveId =
        allUnvisitedNodes.length === 1
          ? allUnvisitedNodes[0]
          : allUnvisitedNodes.sort(
              (a, b) => tentativeDistances.get(a)! - tentativeDistances.get(b)!
            )[0];
      tentativeDistanceOfNextNode = tentativeDistances.get(nextValveId)!;
    }
    const haveNoMoreReachableNodes =
      tentativeDistanceOfNextNode === Number.MAX_SAFE_INTEGER;

    // 6. Otherwise, select the unvisited node that is marked with the smallest tentative distance, set it as the new current node, and go back to step 3.
    shouldContinue = !haveVisitedEveryNode && !haveNoMoreReachableNodes;
    if (shouldContinue) {
      currentValveId = nextValveId;
    }

    // When planning a route, it is actually not necessary to wait until the destination node is "visited" as above: the algorithm can stop once the destination node has the smallest tentative distance among all "unvisited" nodes (and thus could be selected as the next "current").
    const isNextNodeTheDestination = nextValveId === toValveId;
    if (isNextNodeTheDestination) {
      // Still need to write the distance to the end node
      tentativeDistances.set(nextValveId, currentNodeTentativeDistance + 1);
    }
    shouldContinue &&= !isNextNodeTheDestination;
  } while (shouldContinue);

  // Now find our route by walking back from our destination
  const shortestRoute: string[] = [toValveId];
  currentValveId = toValveId;
  do {
    // Find the reachable adjacent node with a lower tentative distance
    const valve = valves.get(currentValveId)!;
    let shortestDistance = Number.MAX_SAFE_INTEGER;
    let nextValveId = "";
    for (const valveId of valve.connectedValveIds) {
      const distance = tentativeDistances.get(valveId)!;
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nextValveId = valveId;
      }
    }

    currentValveId = nextValveId;

    // Insert node at the start of the route
    shortestRoute.unshift(currentValveId);
  } while (currentValveId !== fromValveId);

  return shortestRoute;
}
