/*
Tree of array of nodes. Nodes can be directory (tree of nodes) of files (leaf nodes).

Directory:
* Files[] - name and size
* Directories - name and link (can calc size on building tree)

*/

import { assert } from "console";

type AoCFile = {
  name: string;
  size: number;
};

type AoCDirectory = {
  name: string;
  size: number;
  files: AoCFile[];
  subdirs: AoCDirectory[];
  parent: AoCDirectory | undefined;
};

// Track 'where am I?' with every cd
// 'ls' populates current 'where am I' location
const cdUpRegex = /\$ cd \.\./;
const cdDownRegex = /\$ cd (\w+)/;
const dirRegex = /dir (\w+)/;
const fileRegex = /(\d+) (.*)/;

export function buildTree(terminalOutput: string[]): AoCDirectory {
  let whereAmI: string[] = [];
  let currentDirectory: AoCDirectory = {
    name: "",
    size: -1,
    files: [],
    subdirs: [],
    parent: undefined,
  };
  const rootDirectory = currentDirectory;

  for (const line of terminalOutput) {
    if (line.startsWith("$")) {
      if (line.includes("cd ..")) {
        whereAmI.pop();
        if (currentDirectory.parent) {
          currentDirectory = currentDirectory.parent;
        }
      }
      if (line.includes("cd /")) {
        whereAmI = [];
        currentDirectory = rootDirectory;
      }
      const cdDownMatch = line.match(cdDownRegex);
      if (cdDownMatch) {
        const directoryName = cdDownMatch[1];
        whereAmI.push(directoryName);
        currentDirectory = currentDirectory.subdirs.find(
          (directory) => directory.name === directoryName
        ) ?? {
          name: directoryName,
          size: -1,
          files: [],
          subdirs: [],
          parent: currentDirectory,
        };
      }
    } else {
      // Hopefully reading the output of 'ls'
      const fileMatch = line.match(fileRegex);
      if (fileMatch) {
        currentDirectory.files.push({
          size: Number.parseInt(fileMatch[1]),
          name: fileMatch[2],
        });
      }
      const dirMatch = line.match(dirRegex);
      if (dirMatch) {
        // assert(currentDirectory.subdirs !== undefined, `"${line}"`);
        currentDirectory.subdirs.push({
          name: dirMatch[1],
          size: -1,
          files: [],
          subdirs: [],
          parent: currentDirectory,
        });
      }
    }
  }

  return rootDirectory;
}

type DirectorySize = {
  directory: AoCDirectory;
  size: number;
};

export function processTerminalOutput(
  terminalOutput: string[]
): DirectorySize[] {
  const rootDirectory = buildTree(terminalOutput);
  populateDirectorySizes(rootDirectory);
  return findDirectoriesAndSizes(rootDirectory);
}

export function findDirectoriesAndSizes(
  directory: AoCDirectory
): DirectorySize[] {
  const allDirectoriesAndSizes: DirectorySize[] = [
    { directory, size: directory.size },
  ];

  for (const subdir of directory.subdirs) {
    allDirectoriesAndSizes.push(...findDirectoriesAndSizes(subdir));
  }

  return allDirectoriesAndSizes;
}

export function populateDirectorySizes(directory: AoCDirectory): void {
  let totalSize = 0;

  for (const subdir of directory.subdirs) {
    populateDirectorySizes(subdir);

    totalSize += subdir.size;
  }

  for (const file of directory.files) {
    totalSize += file.size;
  }

  directory.size = totalSize;
}
