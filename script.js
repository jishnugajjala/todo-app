const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

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
    updateEmptyState();
}

function updateTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        const textNode = Array.from(li.childNodes).find(node => node.nodeType === 3);
        const taskText = textNode ? textNode.textContent.trim() : "";
        tasks.push({
            text: taskText,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateEmptyState();
}

function updateEmptyState() {
    const emptyMsg = document.getElementById("emptyMsg");
    const hasItems = document.querySelectorAll("#taskList li").length > 0;
    if (emptyMsg) {
        emptyMsg.style.display = hasItems ? "none" : "block";
    }
}
