const display = document.getElementById("display");

function append(value) {
  if (value === "pi") value = "Math.PI";
  if (value === "e") value = "Math.E";
  if (value === "√(") value = "Math.sqrt(";
  if (value === "log(") value = "Math.log10(";
  if (value === "ln(") value = "Math.log(";
  if (value === "sin(") value = "Math.sin(";
  if (value === "cos(") value = "Math.cos(";
  if (value === "tan(") value = "Math.tan(";
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    const result = eval(display.value);
    display.value = result;
  } catch (err) {
    display.value = "Error";
  }
}
