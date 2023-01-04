const numbersRegex = /(.*): (-?\d+)/;
const operationRegex = /(.*): (.*) (.) (.*)/;

type Operator = "+" | "-" | "*" | "/";

type MonkeyOperation = {
  monkeyA: string;
  monkeyB: string;
  operation: Operator;
};

export function parseInputData(inputLines: string[]): {
  monkeyValues: Map<string, number>;
  monkeyOperations: Map<string, MonkeyOperation>;
} {
  const monkeyValues = new Map<string, number>();
  const monkeyOperations = new Map<string, MonkeyOperation>();

  inputLines.forEach((inputLine) => {
    const numbersMatch = inputLine.match(numbersRegex);
    if (numbersMatch) {
      const monkeyName = numbersMatch[1];
      const monkeyValue = parseInt(numbersMatch[2]);
      monkeyValues.set(monkeyName, monkeyValue);
    }
    const operationMatch = inputLine.match(operationRegex);
    if (operationMatch) {
      const monkeyName = operationMatch[1];
      const monkeyA = operationMatch[2];
      const monkeyB = operationMatch[4];
      const operation = operationMatch[3] as Operator;
      monkeyOperations.set(monkeyName, { monkeyA, monkeyB, operation });
    }
  });

  return { monkeyValues, monkeyOperations };
}

export function processCalculations(
  monkeyValues: Map<string, number>,
  monkeyOperations: Map<string, MonkeyOperation>
): number {
  while (!monkeyValues.has("root")) {
    monkeyOperations.forEach((monkeyOperation, monkeyName) => {
      if (
        monkeyValues.has(monkeyOperation.monkeyA) &&
        monkeyValues.has(monkeyOperation.monkeyB)
      ) {
        const monkeyValue = performOperation(
          monkeyValues.get(monkeyOperation.monkeyA)!,
          monkeyValues.get(monkeyOperation.monkeyB)!,
          monkeyOperation.operation
        );
        monkeyValues.set(monkeyName, monkeyValue);
        monkeyOperations.delete(monkeyName);
      }
    });
  }

  return monkeyValues.get("root")!;
}

function performOperation(a: number, b: number, operation: Operator) {
  switch (operation) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
  }
}

export function findHumnValue(
  monkeyValues: Map<string, number>,
  monkeyOperations: Map<string, MonkeyOperation>
): number {
  const rootMatch = monkeyOperations.get("root")!;
  monkeyValues.delete("humn");

  while (
    !monkeyValues.has(rootMatch.monkeyA) &&
    !monkeyValues.has(rootMatch.monkeyB)
  ) {
    monkeyOperations.forEach((monkeyOperation, monkeyName) => {
      if (
        monkeyValues.has(monkeyOperation.monkeyA) &&
        monkeyValues.has(monkeyOperation.monkeyB)
      ) {
        const monkeyValue = performOperation(
          monkeyValues.get(monkeyOperation.monkeyA)!,
          monkeyValues.get(monkeyOperation.monkeyB)!,
          monkeyOperation.operation
        );
        monkeyValues.set(monkeyName, monkeyValue);
        monkeyOperations.delete(monkeyName);
      }
    });
  }

  const monkeyToMatch = monkeyValues.has(rootMatch.monkeyA)
    ? rootMatch.monkeyA
    : rootMatch.monkeyB;
  const valueToMatch = monkeyValues.get(monkeyToMatch)!;
  const finalMonkey = monkeyValues.has(rootMatch.monkeyA)
    ? rootMatch.monkeyB
    : rootMatch.monkeyA;
  monkeyValues.set(finalMonkey, valueToMatch);
  monkeyOperations.delete("root");

  while (!monkeyValues.has("humn")) {
    monkeyOperations.forEach((monkeyOperation, monkeyName) => {
      if (
        monkeyValues.has(monkeyName) &&
        (monkeyValues.has(monkeyOperation.monkeyA) ||
          monkeyValues.has(monkeyOperation.monkeyB))
      ) {
        const result = monkeyValues.get(monkeyName)!;

        const monkeyValue = performReverseOperation(
          result,
          monkeyValues.get(monkeyOperation.monkeyA),
          monkeyValues.get(monkeyOperation.monkeyB),
          monkeyOperation.operation
        );
        const monkeyWithoutValue = monkeyValues.has(monkeyOperation.monkeyA)
          ? monkeyOperation.monkeyB
          : monkeyOperation.monkeyA;

        monkeyValues.set(monkeyWithoutValue, monkeyValue);
        monkeyOperations.delete(monkeyName);
      }
    });
    monkeyOperations.forEach((monkeyOperation, monkeyName) => {
      if (
        monkeyValues.has(monkeyOperation.monkeyA) &&
        monkeyValues.has(monkeyOperation.monkeyB)
      ) {
        const monkeyValue = performOperation(
          monkeyValues.get(monkeyOperation.monkeyA)!,
          monkeyValues.get(monkeyOperation.monkeyB)!,
          monkeyOperation.operation
        );
        monkeyValues.set(monkeyName, monkeyValue);
        monkeyOperations.delete(monkeyName);
      }
    });
  }
  return monkeyValues.get("humn")!;
}

function performReverseOperation(
  result: number,
  a: number | undefined,
  b: number | undefined,
  operation: Operator
) {
  const knownNumber = a ?? b!;

  switch (operation) {
    case "+":
      return a !== undefined ? result - a! : result - b!;
    case "-":
      return a !== undefined ? a! - result : result + b!;
    case "*":
      return result / knownNumber;
    case "/":
      return result * knownNumber;
  }
}
