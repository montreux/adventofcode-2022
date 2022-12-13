export function buildXValues(inputData: string[]): number[] {
  const xValuesPerCycle = new Array<number>();
  xValuesPerCycle.push(1);

  for (const currentInstruction of inputData) {
    const currentXValue = xValuesPerCycle[xValuesPerCycle.length - 1];
    const isAddX = currentInstruction.startsWith("addx");
    if (isAddX) {
      // Parse the instruction
      const valueToAdd = Number.parseInt(currentInstruction.split(" ")[1]);
      // Execute the instruction
      xValuesPerCycle.push(currentXValue);
      xValuesPerCycle.push(currentXValue + valueToAdd);
    } else {
      xValuesPerCycle.push(currentXValue);
    }
  }

  return xValuesPerCycle;
}

export function renderXValues(
  xValuesPerCycle: number[],
  litPixelChar: string = "#"
): string {
  const render: string[] = [];
  xValuesPerCycle.forEach((xValue, index) => {
    const spritePositions = [xValue, xValue + 1, xValue + 2];
    const position = (index % 40) + 1;
    const isSpriteOnCursor = spritePositions.includes(position);
    render.push(isSpriteOnCursor ? litPixelChar : ".");
  });
  const longLine = render.join("");
  const lines = [
    longLine.substring(0, 40),
    longLine.substring(40, 80),
    longLine.substring(80, 120),
    longLine.substring(120, 160),
    longLine.substring(160, 200),
    longLine.substring(200, 240),
  ];
  return lines.join("\n");
}
