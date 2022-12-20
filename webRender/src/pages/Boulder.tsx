/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Vector3 } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Box } from "./Box";
import {
  buildCubeMap,
  CubeState,
  parseInputData,
} from "../day18/boilingBoulders";
import { puzzleData } from "../day18/boilingBoulders.puzzledata";
import { Stage } from "@react-three/drei";
import { useState } from "react";

export function Boulder(): JSX.Element {
  const [layersToShow, setLayersToShow] = useState(0);

  const puzzleCubes = parseInputData(puzzleData.split("\n"));
  const cubeMap = buildCubeMap(puzzleCubes);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (elapsedTime > 5) {
      // setLayersToShow(elapsedTime % cubeMap.depth);
    } else {
      setLayersToShow(cubeMap.depth);
    }
  });

  const boxes: JSX.Element[] = [];
  for (let zIndex = 0; zIndex < layersToShow; zIndex++) {
    for (let yIndex = 0; yIndex < cubeMap.height; yIndex++) {
      for (let xIndex = 0; xIndex < cubeMap.width; xIndex++) {
        if (cubeMap.cubeState[xIndex]![yIndex]![zIndex] === CubeState.SOLID) {
          const cubeLocation: Vector3 = [xIndex, yIndex, zIndex];
          boxes.push(
            <Box position={cubeLocation} key={JSON.stringify(cubeLocation)} />
          );
        }
      }
    }
  }
  // const boxes = puzzleCubes.map((cubeLocation) => (
  //   <Box
  //     position={[cubeLocation.x, cubeLocation.y, cubeLocation.z]}
  //     key={JSON.stringify(cubeLocation)}
  //   />
  // ));
  return (
    <Stage adjustCamera>
      <mesh>{boxes}</mesh>
    </Stage>
  );
}
