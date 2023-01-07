export type Valve = {
  id: string;
  flowRate: number;
  connectedValveIds: string[];
};

export function parseInputData(inputData: string[]): Map<string, Valve> {
  const allValves: Valve[] = [];

  // Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  const sensorAndBeaconRegex = /Valve ([A-Z]+).*=(\d+).*to valves* (.*)/;

  for (const inputLine of inputData) {
    const match = inputLine.match(sensorAndBeaconRegex);
    if (match) {
      const id = match[1];
      const flowRate = parseInt(match[2]);
      const connectedValveIds = match[3].split(", ");

      allValves.push({
        id,
        flowRate,
        connectedValveIds,
      });
    }
  }

  return valveArrayToMap(allValves);
}
export function valveArrayToMap(valves: Valve[]): Map<string, Valve> {
  const valvesMap = valves.reduce<Map<string, Valve>>((map, valve) => {
    map.set(valve.id, valve);
    return map;
  }, new Map<string, Valve>());

  return valvesMap;
}
