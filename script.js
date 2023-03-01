// The following caches are frequently accessed DOM elements

const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.slice(0, -1);
  }

  // The following avoids unnecessary type conversions

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    if (this.resultDisplayed) {
      this.clear();
    }
    this.currentOperand += number;
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    switch (operation) {
      case "+":
        this.operation = "+";
        break;
      case "-":
        this.operation = "-";
        break;
      case "*":
        this.operation = "*";
        break;
      case "/":
        this.operation = "/";
        break;
      case "^":
        this.operation = "^";
        break;
      default:
        return;
    }
    this.previousOperand = this.getDisplayNumber(this.currentOperand);
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      case "^":
        computation = Math.pow(prev, current);
        break;
      default:
        return;
    }
    this.currentOperand = computation.toString();
    if (this.operation != null) {
      this.previousOperand =
        this.getDisplayNumber(prev) +
        " " +
        this.operation +
        " " +
        this.getDisplayNumber(current) +
        "=";
    }
    this.operation = undefined;
    this.resultDisplayed = true;
  }

  getDisplayNumber(number) {
    if (isNaN(number) || typeof number === "undefined") {
      return "";
    }

    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  // More efficient variable storage
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
    this.resultDisplayed = false; // set resultDisplayed to false
  }
}

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

document.querySelectorAll("[data-number]").forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

document.querySelectorAll("[data-operation]").forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

document.querySelector("[data-equals]").addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

document.querySelector("[data-clear]").addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

document.querySelector("[data-delete]").addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});
