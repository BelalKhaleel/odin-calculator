const state = {
  previousNumber: "",
  currentNumber: "",
  operator: "",
  numberOfTimesOperatorClickedSuccessively: 0,
};

const MAX_NUMBER_OF_DIGITS = 12;
const screen = document.querySelector(".screen");
const buttons = document.querySelector(".buttons");
const operands = buttons.querySelectorAll(".operand");
const decimalPoint = buttons.querySelector(".decimal-point");
let errorMessage = document.querySelector(".error-message");

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
    if (b == 0) return;
    return a / b;
  },
  operate(a, b, operator) {
    switch (operator) {
      case "+":
        return this.add(a, b);
      case "-":
        return this.subtract(a, b);
      case "×":
        return this.multiply(a, b);
      case "÷":
        return this.divide(a, b);
    }
  },
};

function resetScreen() {
  screen.textContent = "";
}

function getCurrentValue(e) {
  state.currentNumber += e.target.value;
  return state.currentNumber;
}

function getOperator(e) {
  if (state.previousNumber === "" && state.currentNumber === "") return;
  state.operator = e.target.value;
  return state.operator;
}

buttons.addEventListener("click", (e) => {
  const buttonClass = e.target.classList;
  if (!buttonClass.contains("operator"))
    state.numberOfTimesOperatorClickedSuccessively = 0;
  errorMessage.textContent = "";

  if (
    buttonClass.contains("operand") ||
    buttonClass.contains("decimal-point")
  ) {
    if (state.currentNumber.length + 1 >= MAX_NUMBER_OF_DIGITS) return;
    // if a result is displayed and the user clicks another button, the calculations should reset
    if (state.currentNumber === "" && state.operator === "")
      state.previousNumber = "";
    screen.textContent = getCurrentValue(e);
    if (state.currentNumber.includes(".")) decimalPoint.disabled = true;
  }
  if (buttonClass.contains("operator")) {
    decimalPoint.disabled = false;
    // if no current number or previous number is present, don't operate
    if (!state.currentNumber && !state.previousNumber) return;
    // if both and the operator are present, get and display the result
    if (state.currentNumber && state.previousNumber) {
      state.currentNumber = Number(state.currentNumber);
      state.previousNumber = Number(state.previousNumber);
      if (state.operator === "÷" && state.currentNumber === 0) {
        errorMessage.textContent = `Oops! Can't divide by zero dummy!
            Looks like someone wasn't paying attention during Math class 😛`;
        resetScreen();
        return;
      }
      let result = calculator.operate(
        state.previousNumber,
        state.currentNumber,
        state.operator,
      );
      // check if result is a decimal
      if (result % 1 != 0) result = parseFloat(result.toFixed(8));
      // use scientific notation to handle large numbers
      if (String(result).length > MAX_NUMBER_OF_DIGITS) result = result.toExponential(2);
      screen.textContent = result;
      state.previousNumber = result;
      state.currentNumber = "";
    }

    state.operator = getOperator(e);
    // if previous number is already present, set the current number variable to the current value
    if (state.currentNumber) {
      state.previousNumber = state.currentNumber;
      state.currentNumber = "";
    }
    console.log(state);
  }
  if (buttonClass.contains("clear")) {
    resetScreen();
    enableButtons();
    state.previousNumber = "";
    state.currentNumber = "";
  }
  if (buttonClass.contains("backspace")) {
    state.currentNumber = state.currentNumber.split("").slice(0, -1).join("");
    screen.textContent = state.currentNumber;
  }
});
