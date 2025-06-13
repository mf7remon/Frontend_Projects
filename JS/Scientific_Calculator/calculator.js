const display = document.getElementById("display");
let currentExpression = "";

// Show the current expression in red
function updateDisplay() {
  const history = display.dataset.history || "";
  // Show the history plus current input exactly as typed
  display.innerHTML =
    history + `<span style="color:red;">${currentExpression}</span>`;
}

// Append input to expression
function append(value) {
  if (value === "pi") value = "Math.PI";
  else if (value === "e") value = "Math.E";
  else if (value === "√(") value = "Math.sqrt(";
  else if (value === "log(") value = "Math.log10(";
  else if (value === "ln(") value = "Math.log(";
  else if (value === "sin(") value = "Math.sin(";
  else if (value === "cos(") value = "Math.cos(";
  else if (value === "tan(") value = "Math.tan(";

  currentExpression += value;
  updateDisplay();
}

// Clear everything
function clearDisplay() {
  currentExpression = "";
  display.dataset.history = "";
  display.innerHTML = "";
}

// Backspace one character
function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    const result = eval(currentExpression);

    const newLine =
      `<div style="color:red; white-space: pre;">${currentExpression}</div>` + // preserve spaces
      `<div style="color:white; font-weight:bold; margin-left:10px;">Ans: ${result}</div><br/>`;

    display.dataset.history = (display.dataset.history || "") + newLine;
  } catch (e) {
    const newLine =
      `<div style="color:red; white-space: pre;">${currentExpression}</div>` +
      `<div style="color:white; font-weight:bold; margin-left:10px;">Ans: Error</div><br/>`;

    display.dataset.history = (display.dataset.history || "") + newLine;
  }

  currentExpression = "";
  updateDisplay();
  display.scrollTop = display.scrollHeight;
}

function updateDisplay() {
  const history = display.dataset.history || "";
  display.innerHTML =
    history +
    `<div style="color:red; white-space: pre;">${currentExpression}</div>`;
}
