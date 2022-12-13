import * as fs from "fs";

export function loadDataFrom(filePath: string): string[] {
  const dataBuffer = fs.readFileSync(filePath, "utf-8");
  const dataLines = dataBuffer.split("\n");

  return dataLines;
}
