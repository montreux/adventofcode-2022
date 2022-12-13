import { loadDataFrom } from "../textFileReader";
import {
  calcMoneyBusiness,
  parseMonkeyInputData,
  performRound,
} from "./monkeyBusiness";

test("Parse monkey input - example data", () => {
  const testData = loadDataFrom("./src/day11/monkeyBusiness.exampledata.txt");
  const allMonkeys = parseMonkeyInputData(testData);

  expect(allMonkeys.length).toBe(4);

  /*
  Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3
*/
  expect(JSON.stringify(allMonkeys[0])).toBe(
    `{"monkeyId":0,"itemWorryLevels":[79,98],"monkeyIdIfTrue":2,"monkeyIdIfFalse":3,"numberOfItemsInspected":0,"divisibleBy":23}`
  );
  expect(allMonkeys[0].operation(0)).toBe(0);
  expect(allMonkeys[0].operation(1, 1000)).toBe(19);
  expect(allMonkeys[0].test(22)).toBe(false);
  expect(allMonkeys[0].test(23)).toBe(true);
  /*

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0
*/
  expect(JSON.stringify(allMonkeys[1])).toBe(
    `{"monkeyId":1,"itemWorryLevels":[54,65,75,74],"monkeyIdIfTrue":2,"monkeyIdIfFalse":0,"numberOfItemsInspected":0,"divisibleBy":19}`
  );
  expect(allMonkeys[1].operation(0, 1)).toBe(6);
  expect(allMonkeys[1].operation(1, 1000)).toBe(7);
  expect(allMonkeys[1].test(20)).toBe(false);
  expect(allMonkeys[1].test(19)).toBe(true);
  /*
Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3
*/
  expect(JSON.stringify(allMonkeys[2])).toBe(
    `{"monkeyId":2,"itemWorryLevels":[79,60,97],"monkeyIdIfTrue":1,"monkeyIdIfFalse":3,"numberOfItemsInspected":0,"divisibleBy":13}`
  );
  expect(allMonkeys[2].operation(1, 1000)).toBe(1);
  expect(allMonkeys[2].operation(2, 1000)).toBe(4);
  expect(allMonkeys[2].test(13)).toBe(true);
  expect(allMonkeys[2].test(14)).toBe(false);
  expect(allMonkeys[2].test(26)).toBe(true);
  expect(allMonkeys[2].test(27)).toBe(false);
});

test("Perform rounds - example data", () => {
  const testData = loadDataFrom("./src/day11/monkeyBusiness.exampledata.txt");
  const allMonkeys = parseMonkeyInputData(testData);

  // After round 1, the monkeys are holding items with these worry levels:
  // Monkey 0: 20, 23, 27, 26
  // Monkey 1: 2080, 25, 167, 207, 401, 1046
  // Monkey 2:
  // Monkey 3:
  performRound(allMonkeys);
  expect(allMonkeys.length).toBe(4);
  expect(JSON.stringify(allMonkeys[0].itemWorryLevels)).toBe("[20,23,27,26]");
  expect(JSON.stringify(allMonkeys[1].itemWorryLevels)).toBe(
    "[2080,25,167,207,401,1046]"
  );
  expect(JSON.stringify(allMonkeys[2].itemWorryLevels)).toBe("[]");
  expect(JSON.stringify(allMonkeys[3].itemWorryLevels)).toBe("[]");

  // After round 20, the monkeys are holding items with these worry levels:
  // Monkey 0: 10, 12, 14, 26, 34
  // Monkey 1: 245, 93, 53, 199, 115
  // Monkey 2:
  // Monkey 3:
  for (let index = 1; index < 20; index++) {
    performRound(allMonkeys);
  }

  expect(allMonkeys.length).toBe(4);
  expect(JSON.stringify(allMonkeys[0].itemWorryLevels)).toBe(
    "[10,12,14,26,34]"
  );
  expect(JSON.stringify(allMonkeys[1].itemWorryLevels)).toBe(
    "[245,93,53,199,115]"
  );
  expect(JSON.stringify(allMonkeys[2].itemWorryLevels)).toBe("[]");
  expect(JSON.stringify(allMonkeys[3].itemWorryLevels)).toBe("[]");

  // Monkey 0 inspected items 101 times.
  // Monkey 1 inspected items 95 times.
  // Monkey 2 inspected items 7 times.
  // Monkey 3 inspected items 105 times.
  expect(allMonkeys[0].numberOfItemsInspected).toBe(101);
  expect(allMonkeys[1].numberOfItemsInspected).toBe(95);
  expect(allMonkeys[2].numberOfItemsInspected).toBe(7);
  expect(allMonkeys[3].numberOfItemsInspected).toBe(105);

  const monkeyBusiness = calcMoneyBusiness(allMonkeys);
  expect(monkeyBusiness).toBe(10605);
});

test("Perform rounds - real data - part one", () => {
  const testData = loadDataFrom("./src/day11/monkeyBusiness.data.txt");
  const allMonkeys = parseMonkeyInputData(testData);
  expect(allMonkeys.length).toBe(8);

  // Perform 20 rounds
  for (let index = 0; index < 20; index++) {
    performRound(allMonkeys);
  }

  const monkeyBusiness = calcMoneyBusiness(allMonkeys);
  expect(monkeyBusiness).not.toBe(18620); // Known wrong
  expect(monkeyBusiness).toBe(55944);

  console.log(`Monkey business: ${monkeyBusiness}`);
});

test("Perform rounds - example data - part two", () => {
  const testData = loadDataFrom("./src/day11/monkeyBusiness.exampledata.txt");
  const allMonkeys = parseMonkeyInputData(testData);
  expect(allMonkeys.length).toBe(4);

  // == After round 1 ==
  // Monkey 0 inspected items 2 times.
  // Monkey 1 inspected items 4 times.
  // Monkey 2 inspected items 3 times.
  // Monkey 3 inspected items 6 times.
  performRound(allMonkeys, 1);
  expect(allMonkeys[0].numberOfItemsInspected).toBe(2);
  expect(allMonkeys[1].numberOfItemsInspected).toBe(4);
  expect(allMonkeys[2].numberOfItemsInspected).toBe(3);
  expect(allMonkeys[3].numberOfItemsInspected).toBe(6);

  // == After round 20 ==
  // Monkey 0 inspected items 99 times.
  // Monkey 1 inspected items 97 times.
  // Monkey 2 inspected items 8 times.
  // Monkey 3 inspected items 103 times.
  for (let index = 1; index < 20; index++) {
    performRound(allMonkeys, 1);
  }
  expect(allMonkeys[0].numberOfItemsInspected).toBe(99);
  expect(allMonkeys[1].numberOfItemsInspected).toBe(97);
  expect(allMonkeys[2].numberOfItemsInspected).toBe(8);
  expect(allMonkeys[3].numberOfItemsInspected).toBe(103);

  // == After round 1000 ==
  // Monkey 0 inspected items 5204 times.
  // Monkey 1 inspected items 4792 times.
  // Monkey 2 inspected items 199 times.
  // Monkey 3 inspected items 5192 times.
  for (let index = 20; index < 1000; index++) {
    performRound(allMonkeys, 1);
  }
  expect(allMonkeys[0].numberOfItemsInspected).toBe(5204);
  expect(allMonkeys[1].numberOfItemsInspected).toBe(4792);
  expect(allMonkeys[2].numberOfItemsInspected).toBe(199);
  expect(allMonkeys[3].numberOfItemsInspected).toBe(5192);

  // == After round 2000 ==
  // Monkey 0 inspected items 10419 times.
  // Monkey 1 inspected items 9577 times.
  // Monkey 2 inspected items 392 times.
  // Monkey 3 inspected items 10391 times.
  for (let index = 1000; index < 2000; index++) {
    performRound(allMonkeys, 1);
  }
  expect(allMonkeys[0].numberOfItemsInspected).toBe(10419);
  expect(allMonkeys[1].numberOfItemsInspected).toBe(9577);
  expect(allMonkeys[2].numberOfItemsInspected).toBe(392);
  expect(allMonkeys[3].numberOfItemsInspected).toBe(10391);

  // == After round 10000 ==
  // Monkey 0 inspected items 52166 times.
  // Monkey 1 inspected items 47830 times.
  // Monkey 2 inspected items 1938 times.
  // Monkey 3 inspected items 52013 times.
  for (let index = 2000; index < 10000; index++) {
    performRound(allMonkeys, 1);
  }
  expect(allMonkeys[0].numberOfItemsInspected).toBe(52166);
  expect(allMonkeys[1].numberOfItemsInspected).toBe(47830);
  expect(allMonkeys[2].numberOfItemsInspected).toBe(1938);
  expect(allMonkeys[3].numberOfItemsInspected).toBe(52013);

  // After 10000 rounds, the two most active monkeys inspected items 52166 and 52013 times. Multiplying these together, the level of monkey business in this situation is now 2713310158.
  const monkeyBusiness = calcMoneyBusiness(allMonkeys);
  expect(monkeyBusiness).toBe(2713310158);

  console.log(`Monkey business: ${monkeyBusiness}`);
});

test("Perform rounds - real data - part two", () => {
  const testData = loadDataFrom("./src/day11/monkeyBusiness.data.txt");
  const allMonkeys = parseMonkeyInputData(testData);
  expect(allMonkeys.length).toBe(8);

  // Perform 10000 rounds, no divisor
  for (let index = 0; index < 10000; index++) {
    performRound(allMonkeys, 1);
  }

  const monkeyBusiness = calcMoneyBusiness(allMonkeys);
  expect(monkeyBusiness).not.toBe(18620); // Known wrong
  expect(monkeyBusiness).toBe(15117269860);

  console.log(`Monkey business: ${monkeyBusiness}`);
});
