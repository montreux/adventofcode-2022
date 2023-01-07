import { Valve } from "./Valve";

export type ValveAsNode = {
  id: string;
  flowRate: number;
  shortestPaths: Map<string, string[]>;
};

export function valvesToNodes(
  allValves: Map<string, Valve>
): Map<string, ValveAsNode> {
  // Filter the valves to those with a non-zero flow rate
  const sourceValves = [...allValves.values()].filter(
    (valve) => valve.flowRate > 0 || valve.id == "AA"
  );
  const scoringValves = sourceValves.filter((valve) => valve.flowRate > 0);

  const allValvesAsNodes = new Map<string, ValveAsNode>();

  // Calculate the distance to every other non-zero flow rate valve
  for (const sourceValve of sourceValves) {
    const bestRoutesToOtherScoringValves = new Map<string, string[]>();
    for (const destinationValve of scoringValves) {
      if (sourceValve.id !== destinationValve.id) {
        const bestRoute = shortestPathBetweenValves(
          allValves,
          sourceValve,
          destinationValve
        );
        bestRoutesToOtherScoringValves.set(destinationValve.id, bestRoute);
      }
    }
    allValvesAsNodes.set(sourceValve.id, {
      id: sourceValve.id,
      flowRate: sourceValve.flowRate,
      shortestPaths: bestRoutesToOtherScoringValves,
    });
  }

  return allValvesAsNodes;
}

export function shortestPathBetweenValves(
  allValves: Map<string, Valve>,
  source: Valve,
  destination: Valve
): string[] {
  // if connected then return destination ID
  // Djikstra
  // Build set of unvisited nodes and paired lengths, all set to infinity

  // Mark all nodes unvisited. Create a set of all the unvisited nodes called the unvisited set.
  const unvisitedValves = new Set<string>(allValves.keys());

  // Assign to every node a tentative distance value: set it to zero for our
  // initial node and to infinity for all other nodes. During the run of the
  // algorithm, the tentative distance of a node v is the length of the shortest
  // path discovered so far between the node v and the starting node. Since
  // initially no path is known to any other vertex than the source itself
  // (which is a path of length zero), all other tentative distances are
  // initially set to infinity. Set the initial node as current.
  const tentativeDistances = [...allValves.values()].reduce<
    Map<string, number>
  >((map, valve) => {
    map.set(valve.id, Number.MAX_SAFE_INTEGER);
    return map;
  }, new Map<string, number>());
  tentativeDistances.set(source.id, 0);

  const previousValves = new Map<string, string>();
  let foundDestination = false;

  while (unvisitedValves.size !== 0) {
    // Select the unvisited node that is marked with the smallest tentative
    // distance, set it as the new current node.
    const unvisitedValveIdsInDistanceOrder = [...unvisitedValves.values()].sort(
      (a, b) => tentativeDistances.get(a)! - tentativeDistances.get(b)!
    );
    const currentValve = allValves.get(unvisitedValveIdsInDistanceOrder[0])!;
    unvisitedValves.delete(currentValve.id);

    // For the current node, consider all of its unvisited neighbors and calculate
    // their tentative distances through the current node. Compare the newly
    // calculated tentative distance to the one currently assigned to the neighbor
    // and assign it the smaller one.
    for (const connectedValveId of currentValve.connectedValveIds) {
      const distanceToCurrentValve = tentativeDistances.get(currentValve.id)!;
      const newTentativeDistance = distanceToCurrentValve + 1;

      const currentTentativeDistanceToValve =
        tentativeDistances.get(connectedValveId)!;

      if (newTentativeDistance < currentTentativeDistanceToValve) {
        tentativeDistances.set(connectedValveId, newTentativeDistance);
        previousValves.set(connectedValveId, currentValve.id);
      }

      if (connectedValveId == destination.id) {
        foundDestination = true;
        break;
      }
    }
  }

  const didReachDestination =
    tentativeDistances.get(destination.id)! !== Number.MAX_SAFE_INTEGER;
  if (!didReachDestination) {
    throw new Error(`No path between ${source.id} and ${destination.id}`);
  }

  // Walk back to find the route
  const route: string[] = [];
  let currentValveId = destination.id;
  while (currentValveId !== source.id) {
    route.unshift(currentValveId);
    currentValveId = previousValves.get(currentValveId)!;
  }

  return route;
}
