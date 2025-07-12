const MAX_CHAR_SIZE = 15;
let num1 = null;
let num2 = null;
let result = null;
let currentInput = null;
let prevInput = null;
let currentOp = null;
let prevOp = null;
let currentNumToSaveTo = 1;
let displayElement = document.querySelector('.calc-display');

let switchNumFlag = false;
let twoOpsInRowFlag = false;
let clearDisplayFlag = false;
displayElement.innerText = '0';

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  if (y === 0) {
    return 'Divide By 0';
  }
  return x / y;
}

function modulo(x, y) {
  return x % y;
}

function negative(x) {
  return -x;
}

function clearAll() {
  num1 = null;
  num2 = null;
  result = null;
  currentInput = null;
  prevInput = null;
  currentOp = null;
  prevOp = null;
  currentNumToSaveTo = 1; 

  switchNumFlag = false;
  twoOpsInRowFlag = false;
  clearDisplayFlag = false;
  displayElement.innerText = '0';

  return displayElement.innerText;
}

function isMaxDisplayLen() {
  if(displayElement.innerText.length >= MAX_CHAR_SIZE) {
    return true;
  } else {
    return false;
  }
}

function setVarsOnOutput() {
  num1 = result;
  num2 = null;
  result = null;
  //currentInput = null;
  //prevInput = 'num';
  currentNumToSaveTo = 1; // this line and line below will make it so that the next num entered will be saved to num2
  switchNumFlag = true;
  towOpsInRowFlag = false;
  clearDisplayFlag = false;
}

function outputResult(x) {
  displayElement.innerText = result.toString();
  truncate();
  setVarsOnOutput();
  return displayElement.innerText; 
}

function truncate() {
  if (isMaxDisplayLen()) {
    displayElement.innerText = displayElement.innerText.slice(0, MAX_CHAR_SIZE); 
  }
}

function clearDisplay() {
  displayElement.innerText = '';
  return;
}

function numEntered() {
  currentInput = 'num';
}

function operate(x, y, op) {
  if(x !== null && y !== null && op !== null) {
    if (op === '+') return add(x, y);
    else if (op === '-') return subtract(x, y);
    else if (op === '*') return multiply(x, y);
    else if (op === '/') return divide(x, y);
    else if (op === '%') return modulo(x, y);
  }
  if (displayElement.innerText !== '0' && !isMaxDisplayLen()) {
    if (op === '+/-') return negative(+displayElement.innerText);
  }
  if (op === 'AC') return clearAll();

  return null;
}

function isNegativeOp(op) {
  if(op === '+/-') {
    if(!isMaxDisplayLen()) {
      displayElement.innerText = negative(+displayElement.innerText).toString();
      saveCurrentNum(+displayElement.innerText); 
      switchNumFlag = false;
      clearDisplayFlag = false;
      return true;
    }
  }
  return;
}

function isACop(op) {
  if(op === 'AC') {
    clearAll();
    return true;
  }
}

function saveCurrentNum() {
  if(currentNumToSaveTo === 1) {
    num1 = +displayElement.innerText;
  } else if (currentNumToSaveTo === 2) {
    num2 = +displayElement.innerText;
  }

  return currentNumToSaveTo;
}

function switchNumToSaveTo() {
  if(currentNumToSaveTo === 1) {
    currentNumToSaveTo = 2;
  } else if (currentNumToSaveTo === 2) {
    currentNumToSaveTo = 1;
  }
  return currentNumToSaveTo;
}

function twoOps(op) {
  let clearedFlag = false;
  if(prevInput === 'op' && currentInput === 'op') { // add op !== '-' ???
    clearAll();
    clearedFlag = true;
  } else if (prevInput === 'equal' && currentInput === 'equal') {
    clearAll();
    clearedFlag = true;
  }

  return clearedFlag;
}

function addDecimal() {
  if(switchNumFlag) {
    switchNumToSaveTo();
    clearDisplay();
    switchNumFlag = false;
  }
  if(displayElement.innerText === '0') { // may need to remove
    clearDisplay();
  }
  if(!isMaxDisplayLen() && !displayElement.innerText.includes('.')) {
    displayElement.innerText += '.';
  }

  return;
}

function deletePrev() {
  displayElement.innerText = displayElement.innerText.slice(0, -1);
  saveCurrentNum();
  return;
}

function inputNumFromBtn(e) {
  if(switchNumFlag) { //save to new num (var num1 or num2)
      switchNumToSaveTo();
      clearDisplay();
      switchNumFlag = false;
  }

  if(!isMaxDisplayLen()) {  
    if(displayElement.innerText === '0') {
      if(e.target.innerText !== '0') {
        displayElement.innerText = e.target.innerText;
      }
    }
    else {
      displayElement.innerText += e.target.innerText;
    }
    saveCurrentNum();
  } 
  prevInput = 'num'; //used to reset display if two operators are entered in a row (except +/- or =,result, then new op)
  return;
}

function inputOpFromBtn(e) {
  currentOp = e.target.innerText;
  switchNumFlag = true;  
  
  // if two equals in a row clear, if two ops in a row clear, if two +/- do nothing
  if(currentOp === '=') {
    currentInput = 'equal';
  } else if(currentOp === '+/-') {
    currentInput = 'negative'
  } else {
    currentInput = 'op';
  }
  twoOps(currentOp);

  if(isACop(currentOp)) return; // AC button
  if(isNegativeOp(currentOp)) return;  // +/- button
  result = operate(+num1, +num2, prevOp); // an normal mathematical operator (+, -, *, /, %, or =)
  if(result !== null) {
    outputResult(result);
  }
   
  prevOp = currentOp;
  currentOp = null;
  prevInput = currentInput;
  currentInput = null;
}

let numElements = document.querySelectorAll('.number');
numElements.forEach(numElement => {
  numElement.addEventListener('click', inputNumFromBtn);
});

let opElements = document.querySelectorAll('.operator');
opElements.forEach(opElement => {
  opElement.addEventListener('click', inputOpFromBtn);
});

let decimalElement = document.querySelector('#decimal');
decimalElement.addEventListener('click', addDecimal);

let backspaceElement = document.querySelector('#backspace');
backspaceElement.addEventListener('click', deletePrev);

function inputKey(e) {
  let currentButton;
  if(e.shiftKey && e.code === 'Equal'){
    currentButton = document.querySelector(`button[data-key=KeyPlus]`);
  } else if(e.shiftKey && e.code === 'Digit5'){ // modulo (%)
    currentButton = document.querySelector(`button[data-key=KeyPercent]`);
  } else if(e.shiftKey && e.code === 'Digit8'){ // multiplication (*)
    currentButton = document.querySelector(`button[data-key=KeyStar]`);
  } else {
    console.log("e.code = " + e.code);
    currentButton = document.querySelector(`button[data-key="${e.code}"]`);
  }
  console.log('test');
  console.log(currentButton);
  if(!currentButton) return;
  currentButton.click();  
  
  return;
}
window.addEventListener('keydown', inputKey);

