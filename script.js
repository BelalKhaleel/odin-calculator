let previousNumber = "";
let nextNumber = "";
let operator = "";
let currentNumber = "";
let errorMessage = document.querySelector(".error-message");

const MAX_NUMBER_OF_DIGITS = 10;
const screen = document.querySelector(".screen");
const buttons = document.querySelector(".buttons");
const operands = buttons.querySelectorAll(".operand");
const decimalPoint = buttons.querySelector(".decimal-point");

function operate(previousNumber, nextNumber, operator) {
  switch (operator) {
    case "+":
      return previousNumber + nextNumber;
    case "-":
      return previousNumber - nextNumber;
    case "×":
      return previousNumber * nextNumber;
    case "÷":
      if (nextNumber) {
        return previousNumber / nextNumber;
      }
    case "%":
      return previousNumber % nextNumber;
  }
}

function changeButtonsStatus(action) {
  if (action === 'disable') {
    if (currentNumber.length > MAX_NUMBER_OF_DIGITS) {
      operands.forEach((operand) => {
        operand.disabled = true;
      });
      decimalPoint.disabled = true;
    }
  } else if (action === 'enable') {
    operands.forEach((operand) => {
      operand.disabled = false;
    });
    decimalPoint.disabled = false;
  }
}

function resetScreen() {
  previousNumber = "";
  nextNumber = "";
  currentNumber = "";
  screen.textContent = "";
  screen.style.fontSize = '2.5rem';
}

buttons.addEventListener("click", e => {

  let buttonClass = e.target.classList;

  if (buttonClass.contains("operand") || buttonClass.contains("decimal-point")) {
    currentNumber += e.target.value;
    changeButtonsStatus('disable');
    screen.textContent = currentNumber;
    if (currentNumber.includes('.')) {
      decimalPoint.disabled = true;
    }
  }
  if (buttonClass.contains("operator")) {
    previousNumber = Number(currentNumber);
    currentNumber = "";
    operator = e.target.value;
    changeButtonsStatus('enable');
  }
  if (buttonClass.contains("equal")) {
    if(currentNumber) {
      nextNumber = Number(currentNumber);
        if (operator === "÷" && nextNumber === 0) {
          errorMessage.textContent = `Oops! Can't divide by zero dummy!
          Looks like someone wasn't paying attention during Math class 😛`;
          resetScreen();
        } else {
          currentNumber = operate(previousNumber, nextNumber, operator);
          if (currentNumber === undefined) {
            errorMessage.textContent = 'Please pay attention to your logic.';
            resetScreen();
          } else if (String(currentNumber).length > MAX_NUMBER_OF_DIGITS) {
            screen.textContent = currentNumber;
            screen.style.fontSize = '1.9rem';
            errorMessage.textContent = '';
          } else {
            screen.textContent = currentNumber;
            errorMessage.textContent = '';
          }
      }
    }
  }
  if (buttonClass.contains("clear")) {
    resetScreen();
    changeButtonsStatus('enable');;
  }
  if (buttonClass.contains("backspace")) {
    currentNumber = currentNumber.split("").slice(0, -1).join("");
    screen.textContent = currentNumber;
  }

});
