const newTaskForm = document.querySelector(".newTaskForm");
const newTaskInput = document.querySelector(".newTaskInput");
const tasksContainer = document.querySelector(".tasksContainer");
const task = document.querySelector(".task");
const cases = document.querySelectorAll(".case");
const arrayCase = Array.from(cases);

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
    alert("Veuillez entrer une tâche");
    return false;
  }
  if (task.name.length < 3) {
    alert("Veuillez entrer une tâche de plus de 3 caractères");
    return false;
  }
  if (task.name.length > 30) {
    alert("Veuillez entrer une tâche de moins de 30 caractères");
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
