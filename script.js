const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        text: taskText,
        completed: false
    };

    addTaskToDOM(task);
    saveTask(task);

    taskInput.value = "";
}

function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.textContent = task.text;

    if (task.completed) {
        li.classList.add("completed");
    }

    // Toggle completed
    li.addEventListener("click", function () {
        li.classList.toggle("completed");
        updateTasks();
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation(); // prevent toggle
        li.remove();
        updateTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(addTaskToDOM);
}

function updateTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.firstChild.textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
