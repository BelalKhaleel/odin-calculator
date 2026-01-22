const state = {
  previousNumber: "",
  currentNumber: "",
  // nextNumber: "",
  operator: "",
};

const MAX_NUMBER_OF_DIGITS = 12;
const screen = document.querySelector(".screen");
const buttons = document.querySelector(".buttons");
const operands = buttons.querySelectorAll(".operand");
const decimalPoint = buttons.querySelector(".decimal-point");
const isDividingByZero = state.operator === "÷" && state.currentNumber === 0;
// const hasOperator =
//   screen.textContent.includes("+") ||
//   screen.textContent.includes("-") ||
//   screen.textContent.includes("×") ||
//   screen.textContent.includes("÷");
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

function disableButtons() {
  operands.forEach((operand) => {
    operand.disabled = true;
  });
  decimalPoint.disabled = true;
}

function enableButtons() {
  operands.forEach((operand) => {
    operand.disabled = false;
  });
  decimalPoint.disabled = false;
}

function resetScreen() {
  state.previousNumber = "";
  // state.nextNumber = "";
  state.currentNumber = "";
  screen.textContent = "";
}

function getCurrentValue(e) {
  if (state.previousNumber) {
    state.currentNumber = "";
  }
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
  
  if (
    buttonClass.contains("operand") ||
    buttonClass.contains("decimal-point")
  ) {
    if (state.currentNumber.length + 1 >= MAX_NUMBER_OF_DIGITS) return;
    if (state.currentNumber.includes(".")) decimalPoint.disabled = true;
    screen.textContent = getCurrentValue(e);
    console.log(state)
  }
  if (buttonClass.contains("operator")) {
    // if no current number or previous number is present, don't operate
    if (!state.currentNumber && !state.previousNumber) return;
    // if both and the operator are present, get and display the result
    if (state.currentNumber && state.previousNumber) {
      state.currentNumber = Number(state.currentNumber);
      state.previousNumber = Number(state.previousNumber);
      if (isDividingByZero) {
        errorMessage.textContent = `Oops! Can't divide by zero dummy!
            Looks like someone wasn't paying attention during Math class 😛`;
        resetScreen();
      }
      state.currentNumber = calculator.operate(
        state.previousNumber,
        state.currentNumber,
        state.operator,
      );
      screen.textContent = state.currentNumber;
    }
    
    state.operator = getOperator(e);
    // if previous number is already present, set the current number variable to the current value
    if (state.previousNumber) {
      state.currentNumber = "";
    } else {
      state.previousNumber = state.currentNumber;
    }
      console.log(state)
    // enableButtons();

    // state.nextNumber = Number(state.nextNumber);
      // if (state.currentNumber === undefined) {
      //   errorMessage.textContent = "Please pay attention to your logic.";
      //   resetScreen();
      // } else 
        // if (String(state.currentNumber).length > MAX_NUMBER_OF_DIGITS) {
        // screen.style.fontSize = "1.9rem";
      //   errorMessage.textContent = "";
      // } else {
      //   screen.textContent = state.currentNumber;
      //   errorMessage.textContent = "";
      // }
    // state.operator = "";
  }
  if (buttonClass.contains("clear")) {
    resetScreen();
    enableButtons();
  }
  if (buttonClass.contains("backspace")) {
    state.currentNumber = state.currentNumber.split("").slice(0, -1).join("");
    screen.textContent = state.currentNumber;
  }
});
