// Monkey 0:
//   Starting items: 79, 98
//   Operation: new = old * 19
//   Test: divisible by 23
//     If true: throw to monkey 2
//     If false: throw to monkey 3

import { assert } from "console";

type Monkey = {
  monkeyId: number;
  itemWorryLevels: number[];
  operation: (oldWorryLevel: number, overflowDivisor?: number) => number;
  test: (worryLevel: number) => boolean;
  divisibleBy: number;
  monkeyIdIfTrue: number;
  monkeyIdIfFalse: number;
  numberOfItemsInspected: number;
};

const monkeyIdRegex = /Monkey (\d+):/;
const startItemsTextRegex = /Starting items: ([\d, ]*)/; // Then need to split by ", "
const operationRegex = /Operation: new = old (.*) (.*)/;
const divisibleByRegex = /Test: divisible by (.*)/;
const ifTrueRegex = /If true: throw to monkey (.*)/;
const ifFalseRegex = /If false: throw to monkey (.*)/;

export function parseMonkeyInputData(inputData: string[]): Monkey[] {
  const allMonkeys: Monkey[] = [];
  let newMonkey: Monkey;
  inputData.forEach((inputLine, lineIndex) => {
    const monkeyLineIndex = lineIndex % 7; // 7 lines per Monkey definition
    switch (monkeyLineIndex) {
      case 0:
        // Monkey 0:
        const monkeyIdText = inputLine.match(monkeyIdRegex)![1];
        assert(monkeyIdText);
        const monkeyId = parseInt(monkeyIdText);
        newMonkey = {
          monkeyId: monkeyId,
          itemWorryLevels: [],
          operation: (oldWorryLevel) => oldWorryLevel,
          test: () => false,
          monkeyIdIfTrue: -1,
          monkeyIdIfFalse: -1,
          numberOfItemsInspected: 0,
          divisibleBy: 1,
        };
        allMonkeys.push(newMonkey);
        break;
      case 1:
        //Starting items: 79, 98
        const startItemsText = inputLine.match(startItemsTextRegex)![1];
        const startItems = startItemsText
          .split(", ")
          .map((textValue) => parseInt(textValue));
        newMonkey.itemWorryLevels = startItems;
        break;
      case 2:
        //  Operation: new = old * 19
        const operatorText = inputLine.match(operationRegex)![1];
        const operationValueText = inputLine.match(operationRegex)![2];
        const operation = (oldWorryLevel: number, overflowDivisor?: number) => {
          const operationValue =
            operationValueText === "old"
              ? oldWorryLevel
              : parseInt(operationValueText);
          switch (operatorText) {
            case "*":
              return (oldWorryLevel % (overflowDivisor ?? 1)) * operationValue;
            case "+":
              return (oldWorryLevel % (overflowDivisor ?? 1)) + operationValue;
            default:
              return -1;
          }
        };
        newMonkey.operation = operation;
        break;
      case 3:
        // Test: divisible by 23
        const divisibleByText = inputLine.match(divisibleByRegex)![1];
        const divisibleBy = parseInt(divisibleByText);
        newMonkey.divisibleBy = divisibleBy;
        newMonkey.test = (worryLevel: number) => {
          return worryLevel % divisibleBy === 0;
        };
        break;
      case 4:
        // If true: throw to monkey 2
        const ifTrueDestinationMonkeyIdText = inputLine.match(ifTrueRegex)![1];
        newMonkey.monkeyIdIfTrue = parseInt(ifTrueDestinationMonkeyIdText);
        break;
      case 5:
        // If false: throw to monkey 3
        const ifFalseDestinationMonkeyIdText =
          inputLine.match(ifFalseRegex)![1];
        newMonkey.monkeyIdIfFalse = parseInt(ifFalseDestinationMonkeyIdText);
        break;
      case 6:
        // new line
        assert(inputLine.trim().length === 0);
        break;
      default:
        throw new Error("");
    }
  });

  return allMonkeys;
}

export function performTurn(
  monkeyId: number,
  allMonkeys: Monkey[],
  worryDivisor = 3,
  overflowDivisor = 1
) {
  const monkey = allMonkeys[monkeyId];

  for (const initialWorryLevel of monkey.itemWorryLevels) {
    monkey.numberOfItemsInspected += 1;
    let worryLevel = Math.floor(
      monkey.operation(initialWorryLevel, overflowDivisor) / worryDivisor
    );
    const destinationMonkeyId = monkey.test(worryLevel)
      ? monkey.monkeyIdIfTrue
      : monkey.monkeyIdIfFalse;
    let worryLevelToPush = /*
      worryDivisor !== 3 ? worryLevel % monkey.divisibleBy :*/ worryLevel;
    // if (monkey.operator = '*') {
    //     worryLevelToPush = (worryLevel % monkey.divisibleBy) + 1;
    // }
    //   worryDivisor < 3 ? (worryLevel % monkey.divisibleBy) + 1 : worryLevel;
    allMonkeys[destinationMonkeyId].itemWorryLevels.push(worryLevelToPush);
  }

  monkey.itemWorryLevels = [];
}

export function performRound(allMonkeys: Monkey[], worryDivisor = 3) {
  const productOfDivisors = calcProductOfDivisors(allMonkeys);
  allMonkeys.forEach((_monkey, index) => {
    performTurn(index, allMonkeys, worryDivisor, productOfDivisors);
  });
}

export function calcMoneyBusiness(allMonkeys: Monkey[]): number {
  const numItemsInspected = allMonkeys.map(
    (monkey) => monkey.numberOfItemsInspected
  );
  numItemsInspected.sort((a, b) => b - a);
  return numItemsInspected[0] * numItemsInspected[1];
}

function calcProductOfDivisors(allMonkeys: Monkey[]): number {
  const divisors = allMonkeys.map((monkey) => monkey.divisibleBy);
  const product = divisors.reduce(
    (previousValue, currentValue) => previousValue * currentValue
  );
  return product;
}
