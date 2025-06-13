const display = document.getElementById("display");
let currentExpression = "";

// Show the current expression in red
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

    // For display: add spaces between numbers and operators
    const formattedExpression = currentExpression
      .replace(/([+\-*/()])/g, " $1 ")
      .replace(/\s+/g, " ") // Replace multiple spaces with one
      .trim();

    const newLine = `<span style="color:red;">${formattedExpression}</span><span style="color:white;"> = ${result}</span><br/>`;
    display.dataset.history = (display.dataset.history || "") + newLine;
  } catch (err) {
    const formattedExpression = currentExpression
      .replace(/([+\-*/()])/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim();

    const newLine = `<span style="color:red;">${formattedExpression}</span><span style="color:white;"> = Error</span><br/>`;
    display.dataset.history = (display.dataset.history || "") + newLine;
  }

  currentExpression = "";
  updateDisplay();
  display.scrollTop = display.scrollHeight;
}
