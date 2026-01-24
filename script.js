const state = {
  previousNumber: "",
  currentNumber: "0",
  operator: "",
};

const MAX_NUMBER_OF_DIGITS = 12;
const DECIMAL_PRECISION = 8;
const SCIENTIFIC_NOTATION_PRECISION = 2;

const screen = document.querySelector(".screen");
const buttons = document.querySelector(".buttons");
const operands = buttons.querySelectorAll(".operand");
const operators = buttons.querySelectorAll(".operator");
const errorMessage = document.querySelector(".error-message");

const calculator = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
  multiply(a, b) {
    return a * b;
  },
  divide(a, b) {
    if (b === 0) {
      handleDividingByZero();
      return;
    }
    return a / b;
  },
  operate(a, b, operator) {
    switch (operator) {
      case "+":
        return this.add(a, b);
      case "-":
        return this.subtract(a, b);
      case "*":
        return this.multiply(a, b);
      case "/":
        return this.divide(a, b);
    }
  },
};

screen.textContent = state.currentNumber;

function resetScreen() {
  screen.textContent = "0";
}

function resetErrorMsg() {
  errorMessage.textContent = "";
}

function resetState() {
  state.operator = "";
  state.previousNumber = "";
  state.currentNumber = "0";
}

function getEventValue(e) {
  let value = "";
  if (e instanceof MouseEvent) {
    value = e.target.value;
  } else if (e instanceof KeyboardEvent) {
    value = e.key;
  }
  return value;
}

function getCurrentValue(e) {
  const value = getEventValue(e);
  if (state.currentNumber === "0" && value === "0") {
    state.currentNumber = value;
  } else {
    state.currentNumber += value;
  }
  if (!state.currentNumber.includes(".") && state.currentNumber.length > 1)
    state.currentNumber = state.currentNumber.replace(/^0+/, "");
  return state.currentNumber;
}

function getOperator(e) {
  if (state.previousNumber === "" && state.currentNumber === "0") return;
  state.operator = getEventValue(e);
  return state.operator;
}

function getResult(operand1, operand2, operator) {
  operand1 = Number(operand1);
  operand2 = Number(operand2);
  return calculator.operate(operand1, operand2, operator);
}

function getAndDisplayResult() {
  removeOperatorActiveClass();
  // if no current number or previous number is present, don't operate
  if (!state.currentNumber || !state.previousNumber || !state.operator) return;
  // if both and the operator are present, get and display the result
  const result = getResult(
    state.previousNumber,
    state.currentNumber,
    state.operator,
  );
  displayResult(result);
  state.previousNumber = result;
  state.currentNumber = "";
}

function displayNumberOnScreen(e) {
  if (!state.operator) removeOperatorActiveClass();
  if (state.currentNumber.length + 1 >= MAX_NUMBER_OF_DIGITS) return;
  // if a result is displayed and the user clicks another button, the calculations should reset
  if (state.currentNumber === "0" && state.operator === "")
    state.previousNumber = "";
  const key = getEventValue(e);
  if (state.currentNumber.includes(".") && key === ".") return;
  screen.textContent = getCurrentValue(e);
}

function displayResult(result) {
  // check if result is a decimal
  if (result % 1 !== 0) result = parseFloat(result.toFixed(DECIMAL_PRECISION));
  // use scientific notation to handle large numbers
  if (String(result).length > MAX_NUMBER_OF_DIGITS)
    result = result.toExponential(SCIENTIFIC_NOTATION_PRECISION);
  screen.textContent = result;
}

function addOperatorActiveClass(e) {
  let operator = e.target;
  if (operator === document.querySelector("body")) {
    const keyPressed = e.key;
    operator = document.querySelector(`[data-key="${keyPressed}"]`);
  }
  operator.classList.add("operator-active");
}

function removeOperatorActiveClass() {
  operators.forEach((operator) => operator.classList.remove("operator-active"));
}

function handleDividingByZero() {
  errorMessage.textContent = `Oops! Can't divide by zero!
  Looks like someone wasn't paying attention during Math class 😛`;
  resetScreen();
  resetState();
}

function handleBackspaceClick() {
  state.currentNumber = state.currentNumber.split("").slice(0, -1).join("");
  screen.textContent = state.currentNumber;
  if (state.currentNumber.length === 0) {
    resetState();
    resetScreen();
  }
}

function handleOperatorClick(e) {
  getAndDisplayResult();
  addOperatorActiveClass(e);
  state.operator = getOperator(e);
  // if previous number is already present, set the current number variable to the current value
  if (state.currentNumber) {
    state.previousNumber = state.currentNumber;
    state.currentNumber = "";
  }
}

buttons.addEventListener("click", (e) => {
  const buttonClass = e.target.classList;
  if (errorMessage.textContent) resetErrorMsg();

  if (
    buttonClass.contains("operand") ||
    buttonClass.contains("decimal-point")
  ) {
    displayNumberOnScreen(e);
  }

  if (buttonClass.contains("operator")) handleOperatorClick(e);

  if (buttonClass.contains("equal")) getAndDisplayResult();

  if (buttonClass.contains("clear")) {
    resetScreen();
    resetState();
    removeOperatorActiveClass();
  }

  if (buttonClass.contains("backspace")) handleBackspaceClick();
});

document.addEventListener("keydown", (e) => {
  const keyPressed = e.key;
  const operators = ["+", "-", "*", "/"];
  const allowedKeys = [...operators, ".", "=", "Backspace", "Delete", "Enter"];
  if (isNaN(keyPressed) && !allowedKeys.includes(keyPressed)) return;
  if (errorMessage.textContent) resetErrorMsg();
  if (!isNaN(keyPressed) || keyPressed === ".") {
    displayNumberOnScreen(e);
  }

  if (operators.includes(keyPressed)) handleOperatorClick(e);
  if (keyPressed === "=") getAndDisplayResult();
  if (keyPressed === "Backspace") handleBackspaceClick();
  if (keyPressed === "Delete") {
    resetScreen();
    resetState();
    removeOperatorActiveClass();
  }
});
