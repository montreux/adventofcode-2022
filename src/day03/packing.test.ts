import { loadDataFrom } from "../textFileReader";
import {
  calculatePriorityOfBadgeItems,
  calculatePriorityOfItems,
  findAllMispackedItems,
  findItemInAllThreeBags,
  findMispackedItem,
  splitBagsIntoTriplets,
} from "./packing";

test("findMispackedItem", () => {
  const mispackedItem = findMispackedItem("vJrwpWtwJgWrhcsFMMfFFhFp");
  expect(mispackedItem).toBe("p");
});

test("findAllMispackedItems", () => {
  const testData = loadDataFrom("./src/day03/packing.exampledata.txt");
  const mispackedItems = findAllMispackedItems(testData);
  expect(mispackedItems.join("")).toBe("pLPvts");
});

test("calculatePriorityOfItems", () => {
  const testData = loadDataFrom("./src/day03/packing.exampledata.txt");
  const mispackedItems = findAllMispackedItems(testData);
  const sumOfPriorities = calculatePriorityOfItems(mispackedItems.join(""));
  expect(sumOfPriorities).toBe(157);
});

test("calculatePriorityOfItems - Part 1", () => {
  const testData = loadDataFrom("./src/day03/packing.data.txt");
  const mispackedItems = findAllMispackedItems(testData);
  const sumOfPriorities = calculatePriorityOfItems(mispackedItems.join(""));
  expect(sumOfPriorities).not.toBe(0);

  // console.log(`Sum of priorities of mispacked items: ${sumOfPriorities}`);
});

test("Priority value of team badges", () => {
  const testData = loadDataFrom("./src/day03/packing.exampledata.txt");
  const sumOfPriorities = calculatePriorityOfBadgeItems(testData);
  expect(sumOfPriorities).toBe(70);
});

test("Priority value of team badges - part 2", () => {
  const testData = loadDataFrom("./src/day03/packing.data.txt");
  const sumOfPriorities = calculatePriorityOfBadgeItems(testData);
  expect(sumOfPriorities).toBe(2790);
});
