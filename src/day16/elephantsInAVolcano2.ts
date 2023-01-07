import { plotRoute } from "./elephantsInAVolcano";
import { Valve } from "./Valve";

/**
 * Which Valve provides the most value if opened
 * @param a
 * @param b
 */
export function valveComparator(
  valves: Map<string, Valve>,
  currentValveId: string,
  a: Valve,
  b: Valve,
  //   remainingValveIds: string[],
  timeLeft: number
): number {
  const costToReachA = plotRoute(valves, currentValveId, a.id).length;
  const costToReachB = plotRoute(valves, currentValveId, b.id).length;

  const valueOfA = (timeLeft - costToReachA) * a.flowRate;
  const valueOfB = (timeLeft - costToReachB) * b.flowRate;

  //   const valvesACanVisitNext = [b, ...remainingValveIds];
  //   const valvesBCanVisitNext = [a, ...remainingValveIds];

  return valueOfA - valueOfB;
}
