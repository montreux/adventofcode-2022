export function decimalToSnafu(value: number): string {
  let snafuValue = "";

  while (value > 0) {
    const digit = value % 5;
    value = (value - digit) / 5;

    switch (digit) {
      case 0:
      case 1:
      case 2:
        snafuValue = `${digit}${snafuValue}`;
        break;
      case 3:
        value += 1;
        snafuValue = `=${snafuValue}`;
        break;
      case 4:
        value += 1;
        snafuValue = `-${snafuValue}`;
        break;
      default:
        throw new Error(`Hit default case for digit ${digit}`);
    }
  }

  return snafuValue;
}

export function snafuToDecimal(snafuValue: string): number {
  const snafuDigits = [...snafuValue];
  let decimalValue = 0;

  snafuDigits.forEach((snafuDigit, index) => {
    const power = snafuDigits.length - (index + 1);
    const units = Math.pow(5, power);
    let decimalDigit = 0;
    switch (snafuDigit) {
      case "=":
        decimalDigit = -2;
        break;
      case "-":
        decimalDigit = -1;
        break;
      default:
        decimalDigit = parseInt(snafuDigit);
        break;
    }
    decimalValue += decimalDigit * units;
  });

  return decimalValue;
}
