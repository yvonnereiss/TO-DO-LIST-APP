document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    createTaskElement(taskText, false);
    saveTasks();
    taskInput.value = '';
    sortTasks(); // Sort after adding
}

function createTaskElement(taskText, isCompleted) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    const textSpan = document.createElement('span');
    textSpan.textContent = taskText;
    li.appendChild(textSpan);

    if (isCompleted) {
        li.classList.add('completed');
    }

    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = isCompleted ? 'Undo' : 'Done';
    toggleBtn.className = 'toggle';
    toggleBtn.onclick = () => {
        li.classList.toggle('completed');
        toggleBtn.textContent = li.classList.contains('completed') ? 'Undo' : 'Done';
        saveTasks();
    };

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit';
    editBtn.onclick = () => {
        const newText = prompt('Edit task:', textSpan.textContent);
        if (newText !== null && newText.trim() !== '') {
            textSpan.textContent = newText.trim();
            saveTasks();
            sortTasks(); // Sort after editing
        }
    };

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete';
    deleteBtn.onclick = () => {
        li.remove();
        saveTasks();
    };

    li.appendChild(toggleBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskElement(task.text, task.completed));
    sortTasks(); // Sort on load
}

function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        document.getElementById('taskList').innerHTML = '';
        localStorage.removeItem('tasks');
    }
}

function sortTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.getElementsByTagName('li'));
    tasks.sort((a, b) => {
        const textA = a.querySelector('span').textContent.toLowerCase();
        const textB = b.querySelector('span').textContent.toLowerCase();
        return textA.localeCompare(textB);
    });
    taskList.innerHTML = '';
    tasks.forEach(task => taskList.appendChild(task));
}