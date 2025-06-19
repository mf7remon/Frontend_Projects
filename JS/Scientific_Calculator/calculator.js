const display = document.getElementById("display");
let currentExpression = "";

function updateDisplay() {
  const history = display.dataset.history || "";

  // Add spaces between operators and operands for better readability
  const formattedExpression = currentExpression
    .replace(/([+\-*/()])/g, " $1 ")
    .replace(/\s+/g, " ") // remove extra spaces
    .trim();

  display.innerHTML =
    history + `<span style="color:red;">${formattedExpression}</span>`;
}

function toRad(degree) {
  return degree * (Math.PI / 180);
}

function append(value) {
  if (value === "pi") value = "Math.PI";
  else if (value === "e") value = "Math.E";
  else if (value === "√(") value = "Math.sqrt(";
  else if (value === "log(") value = "Math.log10(";
  else if (value === "ln(") value = "Math.log(";
  else if (value === "sin(") value = "Math.sin(toRad(";
  else if (value === "cos(") value = "Math.cos(toRad(";
  else if (value === "tan(") value = "Math.tan(toRad(";

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

    // Append expression and answer on separate lines
    const newLine =
      `<div style="color:red;">${currentExpression}</div>` +
      `<div style="color:white; font-weight:bold; margin-left:10px;">Ans: ${result}</div><br/>`;

    display.dataset.history = (display.dataset.history || "") + newLine;
  } catch (e) {
    const newLine =
      `<div style="color:red;">${currentExpression}</div>` +
      `<div style="color:white; font-weight:bold; margin-left:10px;">Ans: Error</div><br/>`;

    display.dataset.history = (display.dataset.history || "") + newLine;
  }

  currentExpression = "";
  updateDisplay();
  display.scrollTop = display.scrollHeight;
}
