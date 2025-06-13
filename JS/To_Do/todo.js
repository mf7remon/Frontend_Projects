const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const priorityInput = document.getElementById("priorityInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const taskCount = document.getElementById("taskCount");
const themeSwitch = document.getElementById("themeSwitch");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let currentFilter = "all";

// Dark mode
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeSwitch.checked);
  localStorage.setItem("darkMode", themeSwitch.checked);
});

if (localStorage.getItem("darkMode") === "true") {
  themeSwitch.checked = true;
  document.body.classList.add("dark-mode");
}

// Add Task
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;
  const priority = priorityInput.value;

  if (text === "") return;

  tasks.push({
    id: Date.now(),
    text,
    date,
    time,
    priority,
    completed: false,
  });

  saveAndRender();
  taskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
});

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter((task) =>
    currentFilter === "all"
      ? true
      : currentFilter === "active"
      ? !task.completed
      : task.completed
  );

  // Sort by date + time
  filtered.sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.time || "00:00"}`);
    const bDate = new Date(`${b.date}T${b.time || "00:00"}`);
    return aDate - bDate;
  });

  taskCount.textContent = `${filtered.length} task${
    filtered.length !== 1 ? "s" : ""
  }`;

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.classList.add(`priority-${task.priority}`);
    if (task.completed) li.classList.add("completed");

    const header = document.createElement("div");
    header.classList.add("task-header");

    const span = document.createElement("span");
    span.contentEditable = true;
    span.textContent = task.text;
    span.addEventListener("blur", () => {
      task.text = span.textContent.trim();
      saveAndRender();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveAndRender();
    };

    header.appendChild(span);
    header.appendChild(delBtn);

    const details = document.createElement("small");
    details.textContent = `Due: ${task.date || "N/A"} ${
      task.time || ""
    } | Priority: ${task.priority}`;

    li.appendChild(header);
    li.appendChild(details);

    li.addEventListener("click", () => {
      task.completed = !task.completed;
      saveAndRender();
    });

    // Drag & Drop support
    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      const newOrder = Array.from(taskList.children).map(
        (li) => +li.dataset.id
      );
      tasks.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
      saveAndRender();
    });

    li.dataset.id = task.id;
    taskList.appendChild(li);
  });
}

// Handle dragging
taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const siblings = [...taskList.children].filter((child) => child !== dragging);
  const after = siblings.find((sibling) => {
    const box = sibling.getBoundingClientRect();
    return e.clientY < box.top + box.height / 2;
  });
  if (after) taskList.insertBefore(dragging, after);
  else taskList.appendChild(dragging);
});

// Filters
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((f) => f.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
