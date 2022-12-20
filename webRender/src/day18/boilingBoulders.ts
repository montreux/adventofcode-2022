/* eslint-disable @typescript-eslint/no-non-null-assertion */
export type CubeLocation = {
  x: number;
  y: number;
  z: number;
};

export function parseInputData(inputData: string[]): CubeLocation[] {
  const cubeLocations = inputData.map((inputLine) => {
    const parts = inputLine.split(",");
    const x = parseInt(parts[0] ?? "0");
    const y = parseInt(parts[1] ?? "0");
    const z = parseInt(parts[2] ?? "0");
    return { x, y, z } as CubeLocation;
  });
  return cubeLocations;
}

function distanceBetweenCubes(a: CubeLocation, b: CubeLocation): number {
  const xDifference = Math.abs(a.x - b.x);
  const yDifference = Math.abs(a.y - b.y);
  const zDifference = Math.abs(a.z - b.z);

  return xDifference + yDifference + zDifference;
}

export function calcSurfaceAreaOfShape(cubes: CubeLocation[]): number {
  let sharedFaces = 0;
  cubes.forEach((referenceCube) => {
    const cubesOnePositionAway = cubes.filter(
      (cube) => distanceBetweenCubes(referenceCube, cube) === 1
    );
    sharedFaces += cubesOnePositionAway.length;
  });

  const surfaceArea = cubes.length * 6 - sharedFaces;
  return surfaceArea;
}

export function calcExternalSurfaceAreaOfShape(cubes: CubeLocation[]): number {
  const cubeMap = buildCubeMap(cubes);
  return cubeMap.surfaceArea;
  //   const surfaceArea = calcSurfaceAreaOfShape(cubes);
  // const voidSpaces = findVoidSpaces(cubes);
  // // const missedVoids = voidSpaces.filter((cube) => cubeMap.cubeState[cube.x][cube.y][cube.z] !== CubeState.INSIDE)

  //   const voidSpaceSurfaceArea = calcSurfaceAreaOfShape(voidSpaces);

  //   return surfaceArea - voidSpaceSurfaceArea;
}

function findVoidSpaces(cubes: CubeLocation[]): CubeLocation[] {
  const cubeMap = buildCubeMap(cubes);

  const voidLocations: CubeLocation[] = [];
  cubeMap.cubeState.forEach((plane, xIndex) =>
    plane.forEach((depthColumn, yIndex) =>
      depthColumn.forEach((cubeState, zIndex) => {
        if (cubeState === CubeState.INSIDE) {
          voidLocations.push({ x: xIndex, y: yIndex, z: zIndex });
        }
      })
    )
  );

  return voidLocations;
}

export enum CubeState {
  OUTSIDE = -1,
  SOLID = 0,
  INSIDE = 1,
  CIRCUMFERENCE = 2,
}

export type CubeMap = {
  width: number;
  height: number;
  depth: number;
  cubeState: CubeState[][][];
  surfaceArea: number;
};

export function buildCubeMap(cubes: CubeLocation[]): CubeMap {
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  let maxZ = Number.MIN_SAFE_INTEGER;
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let minZ = Number.MAX_SAFE_INTEGER;
  cubes.forEach((cube) => {
    maxX = Math.max(maxX, cube.x + 1);
    maxY = Math.max(maxY, cube.y + 1);
    maxZ = Math.max(maxZ, cube.z + 1);
    minX = Math.min(minX, cube.x);
    minY = Math.min(minY, cube.y);
    minZ = Math.min(minZ, cube.z);
  });

  const locationsWithCubes: CubeState[][][] = [];
  for (let xIndex = 0; xIndex <= maxX; xIndex++) {
    locationsWithCubes.push([]);
    for (let yIndex = 0; yIndex <= maxY; yIndex++) {
      locationsWithCubes[xIndex]!.push(
        new Array<CubeState>(maxZ + 1).fill(CubeState.INSIDE)
      );
    }
  }

  cubes.forEach((referenceCube) => {
    locationsWithCubes[referenceCube.x]![referenceCube.y]![referenceCube.z] =
      CubeState.SOLID;
  });

  const cubeMap = {
    width: maxX,
    height: maxY,
    depth: maxZ,
    cubeState: locationsWithCubes,
    surfaceArea: -1,
  };

  const surfaceArea = floodFillOutside(cubeMap);
  cubeMap.surfaceArea = surfaceArea;

  return cubeMap;
}

function floodFillOutside(cubeMap: CubeMap): number {
  const checkQueue: CubeLocation[] = [];
  let x = 0;
  let y = 0;
  let z = 0;
  checkQueue.push({ x, y, z });
  cubeMap.cubeState[x]![y]![z] = CubeState.OUTSIDE;

  let countOfSurfaceCubes = 0;

  while (checkQueue.length > 0) {
    ({ x, y, z } = checkQueue.pop()!);
    const adjacentLocations = [
      { x: x + 1, y, z },
      { x: x - 1, y, z },
      { x, y: y + 1, z },
      { x, y: y - 1, z },
      { x, y, z: z + 1 },
      { x, y, z: z - 1 },
    ];
    const locationsToFill = adjacentLocations.filter(
      ({ x, y, z }) =>
        x >= 0 &&
        y >= 0 &&
        z >= 0 &&
        x <= cubeMap.width &&
        y <= cubeMap.height &&
        z <= cubeMap.depth &&
        cubeMap.cubeState[x]![y]![z] === CubeState.INSIDE
    );
    checkQueue.push(...locationsToFill);
    locationsToFill.forEach(
      ({ x, y, z }) => (cubeMap.cubeState[x]![y]![z] = CubeState.OUTSIDE)
    );

    const solidAdjacentCells = adjacentLocations.filter(
      ({ x, y, z }) =>
        x >= 0 &&
        y >= 0 &&
        z >= 0 &&
        x <= cubeMap.width &&
        y <= cubeMap.height &&
        z <= cubeMap.depth &&
        cubeMap.cubeState[x]![y]![z] === CubeState.SOLID
    );
    countOfSurfaceCubes += solidAdjacentCells.length;
  }

  return countOfSurfaceCubes;
}
