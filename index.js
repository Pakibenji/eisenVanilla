const newTaskForm = document.querySelector(".newTaskForm");
const newTaskInput = document.querySelector(".newTaskInput");
const tasksContainer = document.querySelector(".tasksContainer");
const trashBtn = document.getElementById("trash");
const arrayCase = Array.from(document.querySelectorAll(".case"));

const categories = {
  urgentImportant: 0,
  urgentNotImportant: 1,
  importantNotUrgent: 2,
  notImportantNotUrgent: 3,
};

let draggedTask = null;
let touchStartX = 0;
let touchStartY = 0;

newTaskForm.addEventListener("submit", handleNewTaskSubmit);
tasksContainer.addEventListener("dragstart", handleDragStart);
tasksContainer.addEventListener("dragend", handleDragEnd);
tasksContainer.addEventListener("touchstart", handleTouchStart);
tasksContainer.addEventListener("touchmove", handleTouchMove);
tasksContainer.addEventListener("touchend", handleTouchEnd);

arrayCase.forEach((element) => {
  element.addEventListener("dragover", handleDragOver);
  element.addEventListener("drop", handleDrop);
});

trashBtn.addEventListener("dragover", (event) => event.preventDefault());
trashBtn.addEventListener("drop", handleDeleteTask);

loadTasksFromLocalStorage();

function handleNewTaskSubmit(event) {
  event.preventDefault();
  const newTask = newTaskInput.value.trim();
  if (isValidTask(newTask)) {
    addTask(newTask, categories.urgentImportant);
  }
  newTaskInput.value = "";
}

function addTask(taskName, categoryIndex) {
  const taskElement = createTaskElement(taskName);
  arrayCase[categoryIndex]
    .querySelector(".drop-container")
    .appendChild(taskElement);
  saveTasksToLocalStorage();
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  if (!draggedTask) return;

  const data = event.dataTransfer.getData("text/plain");
  const targetCategory = categories[event.currentTarget.classList[1]];
  const taskCategory = categories[draggedTask.parentElement.classList[1]];

  if (targetCategory !== undefined && targetCategory !== taskCategory) {
    const previousContainer = draggedTask.parentElement;
    previousContainer.removeChild(draggedTask);

    const taskElement = createTaskElement(data);
    event.currentTarget
      .querySelector(".drop-container")
      .appendChild(taskElement);

    saveTasksToLocalStorage();
    draggedTask = null;
  }
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.innerHTML);
  draggedTask = event.target;
}

function handleDragEnd() {
  draggedTask = null;
}

function handleTouchStart(event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;

  draggedTask = event.target;

  draggedTask.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  event.preventDefault();
}

function handleTouchMove(event) {
  if (!draggedTask) return;

  const touch = event.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  draggedTask.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  event.preventDefault();
}

function handleTouchEnd(event) {
  if (!draggedTask) return;

  draggedTask.style.transform = "translate(0px, 0px)";
  draggedTask.style.boxShadow = "none";

  draggedTask = null;

  event.preventDefault();
}

function createTaskElement(taskName) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.draggable = true;
  taskElement.textContent = taskName;
  taskElement.addEventListener("dragstart", handleDragStart);
  return taskElement;
}

function isValidTask(task) {
  if (task === "") {
    alert("Please enter a task");
    return false;
  }
  if (task.length < 3) {
    alert("Please enter a task of more than 3 characters");
    return false;
  }
  if (task.length > 30) {
    alert("Please enter a task of less than 30 characters");
    return false;
  }
  return true;
}

function handleDeleteTask(event) {
  event.preventDefault();
  if (draggedTask) {
    const previousContainer = draggedTask.parentElement;
    previousContainer.removeChild(draggedTask);
    saveTasksToLocalStorage();
    draggedTask = null;
  }
}

function saveTasksToLocalStorage() {
  const tasks = {};

  arrayCase.forEach((element, index) => {
    const taskContainer = element.querySelector(".drop-container");
    const taskList = Array.from(taskContainer.querySelectorAll(".task"));
    const taskNames = taskList.map((task) => task.textContent);
    tasks[`category${index}`] = taskNames;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (!tasks) return;

  arrayCase.forEach((element, index) => {
    const taskContainer = element.querySelector(".drop-container");
    const taskNames = tasks[`category${index}`];

    if (taskNames) {
      taskNames.forEach((taskName) => {
        const taskElement = createTaskElement(taskName);
        taskContainer.appendChild(taskElement);
      });
    }
  });
}
