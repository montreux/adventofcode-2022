import { useState } from "react";
import {
  parseInputData,
  visualiseElfLocations,
} from "../day23/unstableDiffusion";
import { puzzleData } from "../day23/unstableDiffusion.puzzledata";

export function UnstableDiffusion(): JSX.Element {
  const [textMap, setTextMap] = useState("");

  const elfLocations = parseInputData(puzzleData.split("\n"));

  setTextMap(visualiseElfLocations(elfLocations));

  return <div style={{ fontFamily: "monospace" }}>{textMap}</div>;
  //   const numRoundsToSpaceOut = findNumRoundsToSpaceOut(elfLocations);
}
