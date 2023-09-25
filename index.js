const newTaskForm = document.querySelector(".newTaskForm");
const newTaskInput = document.querySelector(".newTaskInput");
const tasksContainer = document.querySelector(".tasksContainer");
const task = document.querySelector(".task");
const cases = document.querySelectorAll(".case");
const arrayCase = Array.from(cases);
const urgentImportant = document.querySelector(".urgentImportant");
const urgentNotImportant = document.querySelector(".urgentNotImportant");
const importantNotUrgent = document.querySelector(".importantNotUrgent");
const notImportantNotUrgent = document.querySelector(".notImportantNotUrgent");


newTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTask = newTaskInput.value.trim();
  const task = {
    name: newTask,
    id: Date.now(),
  };
  if (isValidTask(task)) {
    addTask(task);
  }
  newTaskInput.value = "";
});

function isValidTask(task) {
  if (task.name === "") {
    alert("Please enter a task");
    return false;
  }
  if (task.name.length < 3) {
    alert("Please enter a task of more than 3 characters");
    return false;
  }
  if (task.name.length > 30) {
    alert("Please enter a task of less than 30 characters");
    return false;
  }
  return true;
}

function addTask(task) {
  let tasks = [];
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  if (!tasks.includes(task)) {
    tasks.push(task);
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function displayTasks() {
  let tasks = [];
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  tasksContainer.innerHTML = "";
  tasks.map((task) => {
    tasksContainer.innerHTML += `
            <div class="task"  draggable="true" >${task.name}</div>
        `;
  });
}

tasksContainer.addEventListener("dragstart", (event) => {
  event.dataTransfer.setData("text/plain", event.target.innerHTML);
});

arrayCase.map((element) => { 
  element.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  element.addEventListener("drop", (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    event.target.innerHTML = data;
  });
});

if (localStorage.getItem("tasks")) {
  displayTasks();
}