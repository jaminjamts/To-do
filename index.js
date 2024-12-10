const STATUSES = {
  TODO: "todo",
  INPROCESS: "inProcess",
  DONE: "done",
  BLOCKED: "blocked",
};
//
let allTasks = [];
//
const addTaskBtn = document.getElementById("addTaskBtn");
const submitBtn = document.getElementById("submitBtn");
const dialogContainer = document.querySelector("div.dialog-container");
const userInput = document.getElementById("userInput");
const taskStatus = document.getElementById("status");
//
const todoTitle = document.getElementById("todoTitle");
const inProcessTitle = document.getElementById("in-Process-Title");
const doneTitle = document.getElementById("doneTitle");
const blockedTitle = document.getElementById("blockedTitle");
//
const tasksTodo = document.getElementById("tasksTodo");
const tasksInProcess = document.querySelector("div.tasksInProcess");
const tasksDone = document.querySelector("div.tasksDone");
const tasksBlocked = document.getElementById("tasksBlocked");
//
//
let isCreatingTask = false;
let taskId = 0;
//
let todoNumber = 0;
let processNumber = 0;
let doneNumber = 0;
let blockedNumber = 0;
//
let numberTodo = document.createElement("h1");
let numberBlocked = document.createElement("h1");
let numberDone = document.createElement("h1");
let numberInProcess = document.createElement("h1");
//
todoTitle.appendChild(numberTodo);
blockedTitle.appendChild(numberBlocked);
doneTitle.appendChild(numberDone);
inProcessTitle.appendChild(numberInProcess);

addTaskBtn.addEventListener("click", addTask);
submitBtn.addEventListener("click", submit);
dialogContainer.addEventListener("click", closeSection);

//
function addTask() {
  isCreatingTask = true;
  dialogContainer.classList.add("flex");
}
//
function closeSection(event) {
  if (event.target === dialogContainer) {
    dialogContainer.classList.remove("flex");
    // stopPropagation()
  }
}

function dragStart(event) {
  dragAbleTodo = this;
  event.dataTransfer.setData(
    "text/plain",
    dragAbleTodo.getAttribute("data-id")
  );
}

function dragDrop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");
  const newStatus = this.getAttribute("data-status");

  allTasks = allTasks.map((task) => {
    if (task.id === parseInt(taskId)) {
      task.taskstatus = newStatus;
    }
    return task;
  });

  renderData();
}

function submit() {
  if (isCreatingTask) {
    if (userInput.value == "" || taskStatus.value == "selected") {
      alert("taskname bolon tuluwiig shalgana uu");
    } else {
      let taskName = userInput.value;
      let taskstatus = taskStatus.value;
      let id = allTasks.length;
      allTasks.push({ taskName, taskstatus, id });
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

function renderData() {
  let todoTasks = ``;
  let inprocess = ``;
  let done = ``;
  let taskBlocked = ``;
  todoNumber = 0;
  processNumber = 0;
  doneNumber = 0;
  blockedNumber = 0;

  tasksTodo.innerHTML = todoTasks;
  tasksInProcess.innerHTML = inprocess;
  tasksDone.innerHTML = done;
  tasksBlocked.innerHTML = taskBlocked;

  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.setAttribute("draggable", true);
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);
  });

  const allStatus = document.querySelectorAll(".card");
  allStatus.forEach((status) => {
    status.addEventListener("dragover", dragOver);
    status.addEventListener("drop", dragDrop);
  });

  for (let i = 0; i < allTasks.length; i++) {
    switch (allTasks[i].taskstatus) {
      case STATUSES.TODO:
        todoTasks += `
        <div class="task" draggable="true">
        <div>
        <input type="checkbox" id="" />
        <span>${allTasks[i].taskName}</span>
        </div>
        <div class="">
        <i class="fa-solid fa-pencil" onclick="edit(${allTasks[i].id})"></i>
        <i class="fa-solid fa-trash red" onclick="erase(${allTasks[i].id})"></i>
        </div>
        </div>
        `;
        todoNumber++;
        break;
      case STATUSES.INPROCESS:
        inprocess += `
          <div class="task" draggable="true">
          <div>
          <input type="checkbox" id="" />
          <span>${allTasks[i].taskName}</span>
          </div>
          <div class="">
          <i class="fa-solid fa-pencil" onclick="edit(${allTasks[i].id})"></i>
          <i class="fa-solid fa-trash red" onclick="erase(${allTasks[i].id})"></i>
          </div>
          </div>
          `;
        processNumber++;
        break;
      case STATUSES.DONE:
        done += `
            <div class="task" draggable="true">
            <div>
            <input type="checkbox" id="" />
            <span>${allTasks[i].taskName}</span>
            </div>
            <div class="">
            <i class="fa-solid fa-pencil" onclick="edit(${allTasks[i].id})"></i>
            <i class="fa-solid fa-trash red" onclick="erase(${allTasks[i].id})"></i>
            </div>
            </div>
            `;
        doneNumber++;
        break;
      case STATUSES.BLOCKED:
        taskBlocked += `
              <div class="task" draggable="true">
              <div>
              <input type="checkbox" id="" />
              <span>${allTasks[i].taskName}</span>
              </div>
              <div class="">
              <i class="fa-solid fa-pencil" onclick="edit(${allTasks[i].id})"></i>
              <i class="fa-solid fa-trash red" onclick="erase(${allTasks[i].id})"></i>
              </div>
              </div>
              `;
        blockedNumber++;
        break;
    }
  }
  numberTodo.textContent = `${todoNumber}`;
  numberInProcess.innerText = `${processNumber}`;
  numberDone.innerText = `${doneNumber}`;
  numberBlocked.innerText = `${blockedNumber}`;
  tasksTodo.innerHTML = todoTasks;
  tasksInProcess.innerHTML = inprocess;
  tasksDone.innerHTML = done;
  tasksBlocked.innerHTML = taskBlocked;
  isCreatingTask = false;
  taskId = 0;
  userInput.value = "";
  taskStatus.value = "selected";
}
//
function erase(id) {
  let filteredArray = [];
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].id !== id) {
      filteredArray.push(allTasks[i]);
    }
  }
  allTasks = filteredArray;
  renderData();
}
//
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

renderData();
//
const tasks = document.querySelectorAll("div.task");
const allStatus = document.querySelectorAll("div.card");
let dragAbleTodo = null;

tasks.forEach((task) => {
  task.addEventListener("click", dragStart);
  task.addEventListener("click", dragEnd);
});
function dragStart() {
  dragAbleTodo = this;
}
function dragEnd() {
  dragAbleTodo = null;
}
//

allStatus.forEach((status) => {
  status.addEventListener("dragover", dragOver);
  status.addEventListener("dragenter", dragEnter);
  status.addEventListener("dragleave", dragLeave);
  status.addEventListener("drop", dragDrop);
});
//

function dragStart(event) {
  dragAbleTodo = this;
  event.dataTransfer.setData(
    "text/plain",
    dragAbleTodo.getAttribute("data-id")
  );
}

function dragOver(event) {
  event.preventDefault(); // Allows the drop event to occur
}

function dragEnter(event) {
  event.preventDefault();
  this.classList.add("drag-over"); // Add visual feedback for drop zones
}

function dragLeave() {
  this.classList.remove("drag-over"); // Remove visual feedback
}

function dragDrop(event) {
  event.preventDefault();
  const taskId = parseInt(event.dataTransfer.getData("text/plain"));
  const newStatus = this.getAttribute("data-status");

  // Update task status
  allTasks = allTasks.map((task) => {
    if (task.id === taskId) {
      task.taskstatus = newStatus;
    }
    return task;
  });

  renderData();
}
