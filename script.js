const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const API_BASE = '/api';

document.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

async function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: taskText })
        });
        
        const task = await response.json();
        addTaskToDOM(task);
        taskInput.value = "";
        updateEmptyState();
    } catch (error) {
        alert('Error adding task');
    }
}

function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.dataset.id = task.id;

    if (task.completed) {
        li.classList.add("completed");
    }

    li.addEventListener("click", async function () {
        const isCompleted = li.classList.toggle("completed");
        await updateTaskStatus(task.id, isCompleted);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", async function (e) {
        e.stopPropagation();
        await deleteTask(task.id);
        li.remove();
        updateEmptyState();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(addTaskToDOM);
        updateEmptyState();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function updateTaskStatus(id, completed) {
    try {
        await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function updateEmptyState() {
    const emptyMsg = document.getElementById("emptyMsg");
    const hasItems = document.querySelectorAll("#taskList li").length > 0;
    if (emptyMsg) {
        emptyMsg.style.display = hasItems ? "none" : "block";
    }
}
