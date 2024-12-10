// Task Statuses
const STATUSES = {
  TODO: "todo",
  INPROCESS: "inProcess",
  DONE: "done",
  BLOCKED: "blocked",
};

// Global variables
let allTasks = [];
let isCreatingTask = false;
let taskId = 0;

// DOM Elements
const addTaskBtn = document.getElementById("addTaskBtn");
const submitBtn = document.getElementById("submitBtn");
const dialogContainer = document.querySelector(".dialog-container");
const userInput = document.getElementById("userInput");
const taskStatus = document.getElementById("status");

// Title and Number Elements
const todoTitle = document.getElementById("todoTitle");
const inProcessTitle = document.getElementById("in-Process-Title");
const doneTitle = document.getElementById("doneTitle");
const blockedTitle = document.getElementById("blockedTitle");

// Number Display Elements
let numberTodo = document.createElement("h1");
let numberBlocked = document.createElement("h1");
let numberDone = document.createElement("h1");
let numberInProcess = document.createElement("h1");

// Append number elements
todoTitle.appendChild(numberTodo);
blockedTitle.appendChild(numberBlocked);
doneTitle.appendChild(numberDone);
inProcessTitle.appendChild(numberInProcess);

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
submitBtn.addEventListener("click", submit);
dialogContainer.addEventListener("click", closeSection);

// Add Task Function
function addTask() {
  isCreatingTask = true;
  dialogContainer.classList.add("flex");
}

// Close Dialog Function
function closeSection(event) {
  if (event.target === dialogContainer) {
    dialogContainer.classList.remove("flex");
  }
}

// Submit Task Function
function submit() {
  if (isCreatingTask) {
    if (userInput.value == "" || taskStatus.value == "selected") {
      alert("Please enter task name and select status");
    } else {
      let taskName = userInput.value;
      let taskstatus = taskStatus.value;
      let id = allTasks.length;

      allTasks.push({
        taskName,
        taskstatus,
        id,
        isCompleted: false,
      });
    }
  } else {
    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i].id === taskId) {
        allTasks[i].taskName = userInput.value;
        allTasks[i].taskstatus = taskStatus.value;
      }
    }
  }
  renderData();
  dialogContainer.classList.remove("flex");
}

// Render Data Function
function renderData() {
  let todoTasks = ``;
  let inprocess = ``;
  let done = ``;
  let taskBlocked = ``;
  let todoNumber = 0;
  let processNumber = 0;
  let doneNumber = 0;
  let blockedNumber = 0;

  for (let i = 0; i < allTasks.length; i++) {
    const taskHTML = `
      <div class="task" draggable="true" data-id="${
        allTasks[i].id
      }" data-status="${allTasks[i].taskstatus}">
        <div>
       
          <span class="${allTasks[i].isCompleted ? "completed-task" : ""}">${
      allTasks[i].taskName
    }</span>
        </div>
        <div class="">
          <i class="fa-solid fa-pencil" onclick="edit(${allTasks[i].id})"></i>
          <i class="fa-solid fa-trash red" onclick="erase(${
            allTasks[i].id
          })"></i>
        </div>
      </div>
    `;

    switch (allTasks[i].taskstatus) {
      case STATUSES.TODO:
        todoTasks += taskHTML;
        todoNumber++;
        break;
      case STATUSES.INPROCESS:
        inprocess += taskHTML;
        processNumber++;
        break;
      case STATUSES.DONE:
        done += taskHTML;
        doneNumber++;
        break;
      case STATUSES.BLOCKED:
        taskBlocked += taskHTML;
        blockedNumber++;
        break;
    }
  }

  // Update number displays
  numberTodo.textContent = `${todoNumber}`;
  numberInProcess.innerText = `${processNumber}`;
  numberDone.innerText = `${doneNumber}`;
  numberBlocked.innerText = `${blockedNumber}`;

  // Update task containers
  document.getElementById("tasksTodo").innerHTML = todoTasks;
  document.querySelector(".tasksInProcess").innerHTML = inprocess;
  document.querySelector(".tasksDone").innerHTML = done;
  document.getElementById("tasksBlocked").innerHTML = taskBlocked;

  // Reset dialog and flags
  isCreatingTask = false;
  taskId = 0;
  userInput.value = "";
  taskStatus.value = "selected";

  // Add checkbox event listeners

  // Initialize drag events after rendering
  initializeDragEvents();
}

// Handle Task Completion
function handleTaskCompletion(event) {
  const taskId = parseInt(event.target.dataset.id);
  const isChecked = event.target.checked;

  // Find the task and update its completion status
  allTasks = allTasks.map((task) =>
    task.id === taskId ? { ...task, isCompleted: isChecked } : task
  );

  // Re-render to update task appearance
  renderData();
}

// Edit Task Function
function edit(id) {
  taskId = id;
  dialogContainer.classList.add("flex");
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].id === taskId) {
      document.getElementById("userInput").value = allTasks[i].taskName;
      document.getElementById("status").value = allTasks[i].taskstatus;
    }
  }
}

// Erase Task Function
function erase(id) {
  allTasks = allTasks.filter((task) => task.id !== id);
  renderData();
}

// Drag and Drop Functions
function dragStart(event) {
  const taskElement = event.target.closest(".task");
  if (!taskElement) return;

  event.dataTransfer.clearData();
  event.dataTransfer.setData("text/plain", taskElement.dataset.id);

  taskElement.classList.add("dragging");
}

function dragEnd(event) {
  const taskElement = event.target.closest(".task");
  if (taskElement) {
    taskElement.classList.remove("dragging");
  }
}

function dragOver(event) {
  event.preventDefault();
}

function dragDrop(event) {
  event.preventDefault();

  const dropZone = event.target.closest(".card");
  if (!dropZone) return;

  const taskId = event.dataTransfer.getData("text/plain");
  if (!taskId) return;

  const newStatus = dropZone.dataset.status;
  if (!newStatus) return;

  allTasks = allTasks.map((task) =>
    task.id === parseInt(taskId) ? { ...task, taskstatus: newStatus } : task
  );

  renderData();
}

// Initialize Drag Events
function initializeDragEvents() {
  const tasks = document.querySelectorAll(".task");
  const dropZones = document.querySelectorAll(".card");

  tasks.forEach((task) => {
    task.removeEventListener("dragstart", dragStart);
    task.removeEventListener("dragend", dragEnd);

    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);
  });

  dropZones.forEach((zone) => {
    zone.removeEventListener("dragover", dragOver);
    zone.removeEventListener("drop", dragDrop);

    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("drop", dragDrop);
  });
}

// Initial Setup
renderData();
