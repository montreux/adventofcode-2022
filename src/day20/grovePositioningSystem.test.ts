import { loadDataFrom } from "../textFileReader";
import { decrypt, decryptPart2 } from "./grovePositioningSystem";

let exampleEncryptedLocation: number[] = [];
let puzzleEncryptedLocation: number[] = [];

beforeEach(() => {
  const exampleRawText = loadDataFrom(
    "./src/day20/grovePositioningSystem.exampledata.txt"
  );
  exampleEncryptedLocation = exampleRawText.map((textValue) =>
    parseInt(textValue)
  );
  const puzzleRawText = loadDataFrom(
    "./src/day20/grovePositioningSystem.puzzledata.txt"
  );
  puzzleEncryptedLocation = puzzleRawText.map((textValue) =>
    parseInt(textValue)
  );
});

test("decrypt example data", () => {
  const decryptedLocation = decrypt(exampleEncryptedLocation);
  //   expect(decryptedLocation.join(", ")).toBe("1, 2, -3, 4, 0, 3, -2");

  const indexOf0 = decryptedLocation.indexOf(0);
  const index1000After0 = (indexOf0 + 1000) % decryptedLocation.length;
  const valueAt1000After0 = decryptedLocation[index1000After0];
  expect(valueAt1000After0).toBe(4);
  const index2000After0 = (indexOf0 + 2000) % decryptedLocation.length;
  const valueAt2000After0 = decryptedLocation[index2000After0];
  expect(valueAt2000After0).toBe(-3);
  const index3000After0 = (indexOf0 + 3000) % decryptedLocation.length;
  const valueAt3000After0 = decryptedLocation[index3000After0];
  expect(valueAt3000After0).toBe(2);

  const sum = valueAt1000After0 + valueAt2000After0 + valueAt3000After0;
  expect(sum).toBe(3);
});

test("decrypt puzzle data", () => {
  const decryptedLocation = decrypt(puzzleEncryptedLocation);

  const indexOf0 = decryptedLocation.indexOf(0);
  const index1000After0 = (indexOf0 + 1000) % decryptedLocation.length;
  const valueAt1000After0 = decryptedLocation[index1000After0];
  const index2000After0 = (indexOf0 + 2000) % decryptedLocation.length;
  const valueAt2000After0 = decryptedLocation[index2000After0];
  const index3000After0 = (indexOf0 + 3000) % decryptedLocation.length;
  const valueAt3000After0 = decryptedLocation[index3000After0];

  const sum = valueAt1000After0 + valueAt2000After0 + valueAt3000After0;
  expect(sum).toBe(4914);
});

test("decrypt part 2 - example data", () => {
  const decryptedLocation = decryptPart2(exampleEncryptedLocation);
  //   expect(decryptedLocation.join(", ")).toBe(
  //     "0, -2434767459, 1623178306, 3246356612, -1623178306, 2434767459, 811589153"
  //   );

  const indexOf0 = decryptedLocation.indexOf(0);
  const index1000After0 = (indexOf0 + 1000) % decryptedLocation.length;
  const valueAt1000After0 = decryptedLocation[index1000After0];
  expect(valueAt1000After0).toBe(811589153);
  const index2000After0 = (indexOf0 + 2000) % decryptedLocation.length;
  const valueAt2000After0 = decryptedLocation[index2000After0];
  expect(valueAt2000After0).toBe(2434767459);
  const index3000After0 = (indexOf0 + 3000) % decryptedLocation.length;
  const valueAt3000After0 = decryptedLocation[index3000After0];
  expect(valueAt3000After0).toBe(-1623178306);

  const sum = valueAt1000After0 + valueAt2000After0 + valueAt3000After0;
  expect(sum).toBe(1623178306);
});

test("decrypt part 2 - puzzle data", () => {
  const decryptedLocation = decryptPart2(puzzleEncryptedLocation);

  const indexOf0 = decryptedLocation.indexOf(0);
  const index1000After0 = (indexOf0 + 1000) % decryptedLocation.length;
  const valueAt1000After0 = decryptedLocation[index1000After0];
  const index2000After0 = (indexOf0 + 2000) % decryptedLocation.length;
  const valueAt2000After0 = decryptedLocation[index2000After0];
  const index3000After0 = (indexOf0 + 3000) % decryptedLocation.length;
  const valueAt3000After0 = decryptedLocation[index3000After0];

  const sum = valueAt1000After0 + valueAt2000After0 + valueAt3000After0;
  expect(sum).toBe(7973051839072);
});
