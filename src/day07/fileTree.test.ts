import { loadDataFrom } from "../textFileReader";
import { processTerminalOutput } from "./fileTree";

test("processTerminalOutput - example data", () => {
  const testData = loadDataFrom("./src/day07/fileTree.exampleData.txt");
  const directoriesAndSizes = processTerminalOutput(testData);

  /*
  The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
Directory d has total size 24933642.
As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.
  */
  const directoryA = directoriesAndSizes.find(
    (directoryDetail) => directoryDetail.directory.name === "a"
  );
  expect(directoryA?.size).toBe(94853);
  const directoryE = directoriesAndSizes.find(
    (directoryDetail) => directoryDetail.directory.name === "e"
  );
  expect(directoryE?.size).toBe(584);
  const directoryD = directoriesAndSizes.find(
    (directoryDetail) => directoryDetail.directory.name === "d"
  );
  expect(directoryD?.size).toBe(24933642);
  const root = directoriesAndSizes.find(
    (directoryDetail) => directoryDetail.directory.name === ""
  );
  expect(root?.size).toBe(48381165);

  /*
  To begin, find all of the directories with a total size of at most 100000, then calculate the sum of their total sizes. In the example above, these directories are a and e; the sum of their total sizes is 95437 (94853 + 584). (As in this example, this process can count files more than once!)
  */
  const matchDirectorySizes = directoriesAndSizes.filter(
    (directoryDetail) => directoryDetail.size <= 100000
  );

  let sumOfMatchingSizes = 0;
  for (const directoryDetail of matchDirectorySizes) {
    sumOfMatchingSizes += directoryDetail.size;
  }
  expect(sumOfMatchingSizes).toBe(95437);
});

test("part one", () => {
  const testData = loadDataFrom("./src/day07/fileTree.data.txt");
  const directoriesAndSizes = processTerminalOutput(testData);

  /*
  Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?
  */
  const matchDirectorySizes = directoriesAndSizes.filter(
    (directoryDetail) => directoryDetail.size <= 100000
  );

  let sumOfMatchingSizes = 0;
  for (const directoryDetail of matchDirectorySizes) {
    sumOfMatchingSizes += directoryDetail.size;
  }
  expect(sumOfMatchingSizes).toBe(1334506);
});

test("part two - example data", () => {
  /*
    The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165; this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.

To achieve this, you have the following options:

Delete directory e, which would increase unused space by 584.
Delete directory a, which would increase unused space by 94853.
Delete directory d, which would increase unused space by 24933642.
Delete directory /, which would increase unused space by 48381165.
Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.
    */

  const testData = loadDataFrom("./src/day07/fileTree.exampleData.txt");
  const directoriesAndSizes = processTerminalOutput(testData);

  const root = directoriesAndSizes[0];
  expect(root.size).toBe(48381165);

  const diskSize = 70000000;
  const freeSpace = diskSize - root.size;
  const neededFreeSpace = 30000000;
  const spaceToFree = neededFreeSpace - freeSpace;

  // Find the directories big enough
  const matchDirectorySizes = directoriesAndSizes.filter(
    (directoryDetail) => directoryDetail.size >= spaceToFree
  );

  matchDirectorySizes.sort(
    (directoryA, directoryB) => directoryA.size - directoryB.size
  );

  expect(matchDirectorySizes).not.toHaveLength(0);
  expect(matchDirectorySizes[0].size).toBe(24933642);
});

test("part two", () => {
  /*
    The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165; this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.

To achieve this, you have the following options:

Delete directory e, which would increase unused space by 584.
Delete directory a, which would increase unused space by 94853.
Delete directory d, which would increase unused space by 24933642.
Delete directory /, which would increase unused space by 48381165.
Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.
    */

  const testData = loadDataFrom("./src/day07/fileTree.data.txt");
  const directoriesAndSizes = processTerminalOutput(testData);

  const root = directoriesAndSizes[0];
  const diskSize = 70000000;
  const freeSpace = diskSize - root.size;
  const neededFreeSpace = 30000000;
  const spaceToFree = neededFreeSpace - freeSpace;

  // Find the directories big enough
  const matchDirectorySizes = directoriesAndSizes.filter(
    (directoryDetail) => directoryDetail.size >= spaceToFree
  );

  matchDirectorySizes.sort(
    (directoryA, directoryB) => directoryA.size - directoryB.size
  );

  expect(matchDirectorySizes).not.toHaveLength(0);

  expect(matchDirectorySizes[0].directory.name).toBe("ptzptl");
  expect(matchDirectorySizes[0].size).toBe(7421137);
});
