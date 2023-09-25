const newTaskForm = document.querySelector(".newTaskForm");
const newTaskInput = document.querySelector(".newTaskInput");
const tasksContainer = document.querySelector(".tasksContainer");
const cases = document.querySelectorAll(".case");
const trashBtn = document.getElementById("trash");
const arrayCase = Array.from(cases);

// Objet contenant les catégories
const categories = {
  urgentImportant: 0,
  urgentNotImportant: 1,
  importantNotUrgent: 2,
  notImportantNotUrgent: 3,
};

let draggedTask = null;

// Écouteur d'événement pour le formulaire de nouvelle tâche
newTaskForm.addEventListener("submit", handleNewTaskSubmit);

// Gestionnaire d'événement pour le formulaire de nouvelle tâche
function handleNewTaskSubmit(event) {
  event.preventDefault();
  const newTask = newTaskInput.value.trim();
  const task = {
    name: newTask,
  };
  if (isValidTask(task)) {
    addTask(task, categories.urgentImportant); // Par défaut, ajoutez à "urgent/important"
  }
  newTaskInput.value = "";
}

function addTask(task, categoryIndex) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.draggable = true;
  taskElement.textContent = task.name;

  // Ajoutez la nouvelle tâche à la catégorie spécifiée
  arrayCase[categoryIndex].querySelector(".drop-container").appendChild(taskElement);

  // Ajoutez à nouveau un gestionnaire d'événements "dragstart" à la tâche ajoutée
  taskElement.addEventListener("dragstart", handleDragStart);

  // Sauvegardez toutes les tâches dans le localStorage
  saveTasksToLocalStorage();
}

// Gestionnaire d'événement pour les conteneurs de catégorie
arrayCase.forEach((element) => {
  element.addEventListener("dragover", handleDragOver);
  element.addEventListener("drop", handleDrop);
});

// Gestionnaire d'événement pour les tâches en cours de déplacement
tasksContainer.addEventListener("dragstart", handleDragStart);
tasksContainer.addEventListener("dragend", handleDragEnd);

// Gestionnaire d'événement "dragover" pour les conteneurs de catégorie
function handleDragOver(event) {
  event.preventDefault();
}

// Gestionnaire d'événement "drop" pour les conteneurs de catégorie
function handleDrop(event) {
  event.preventDefault();
  if (!draggedTask) return;

  const data = event.dataTransfer.getData("text/plain");
  const targetCategory = categories[event.currentTarget.classList[1]];
  const taskCategory = categories[draggedTask.parentElement.classList[1]];

  if (targetCategory !== undefined && targetCategory !== taskCategory) {
    // Supprimez l'élément de tâche de son emplacement précédent
    const previousContainer = draggedTask.parentElement;
    previousContainer.removeChild(draggedTask);

    // Créez un élément de tâche dans la catégorie cible
    const taskElement = createTaskElement(data);

    // Ajoutez l'élément de tâche à la catégorie cible
    event.currentTarget.querySelector(".drop-container").appendChild(taskElement);

    // Sauvegardez les tâches dans le localStorage
    saveTasksToLocalStorage();

    // Réinitialisez la tâche en cours de déplacement
    draggedTask = null;
  }
}

// Gestionnaire d'événement "dragstart" pour les tâches
function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.innerHTML);
  draggedTask = event.target;
}

// Gestionnaire d'événement "dragend" pour les tâches
function handleDragEnd() {
  draggedTask = null;
}

// Fonction pour créer un élément de tâche
function createTaskElement(taskName) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.draggable = true;
  taskElement.textContent = taskName;

  // Ajoutez à nouveau un gestionnaire d'événements "dragstart" à la tâche ajoutée
  taskElement.addEventListener("dragstart", handleDragStart);

  return taskElement;
}

// Fonction pour valider une tâche
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

// Fonction pour sauvegarder les tâches dans le localStorage
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

// Fonction pour charger les tâches depuis le localStorage au chargement de la page
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
// Appel de la fonction pour charger les tâches depuis le localStorage au chargement de la page
loadTasksFromLocalStorage();

// Fonction pour charger les tâches depuis le localStorage
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

trashBtn.addEventListener("dragover", (event) => {
  event.preventDefault();
});

// Écoutez l'événement "drop" sur la corbeille pour supprimer la tâche
trashBtn.addEventListener("drop", (event) => {
  event.preventDefault();

  // Assurez-vous qu'il y a une tâche en cours de déplacement
  if (draggedTask) {
    // Supprimez l'élément de tâche de son emplacement précédent
    const previousContainer = draggedTask.parentElement;
    previousContainer.removeChild(draggedTask);

    // Mettez à jour le localStorage pour refléter la suppression
    saveTasksToLocalStorage();

    // Réinitialisez la tâche en cours de déplacement
    draggedTask = null;
  }
});