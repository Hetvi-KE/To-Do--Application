document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.querySelector(".search-bar input");
    const addButton = document.querySelector(".btn");
    const taskList = document.getElementById("task-list");

    const categoryFilter = document.createElement("select");
categoryFilter.id = "category-filter"; // Assign an ID for styling

categoryFilter.innerHTML = `
    <option value="all">All Categories</option>
    <option value="work">Work</option>
    <option value="personal">Personal</option>
    <option value="shopping">Shopping</option>
    <option value="urgent">Urgent</option>
`;

const searchContainer = document.createElement("div");
searchContainer.classList.add("search-container");
searchContainer.appendChild(categoryFilter);
document.body.insertBefore(searchContainer, taskList);

    document.body.insertBefore(categoryFilter, taskList);

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const taskItem = document.createElement("li");
            taskItem.classList.add("task-item");
            taskItem.setAttribute("draggable", true);

            let subtasksHtml = "";
            if (task.subtasks && task.subtasks.length) {
                subtasksHtml = `<ul class='subtask-list'>` +
                    task.subtasks.map((subtask, i) => `
                        <li>
                            <input type='checkbox' ${subtask.done ? "checked" : ""} onchange='toggleSubtask(${index}, ${i})'> 
                            ${subtask.text}
                        </li>
                    `).join("") + "</ul>";
            }

            taskItem.innerHTML = `
                <span class="task-number">${index + 1}.</span>
                <span>${task.text} (${task.category})</span>
                <span class="task-time">${task.date}</span>
                ${subtasksHtml}
                <div class="icons">
                    <i class="fa-solid fa-edit" onclick="editTask(${index})"></i>
                    <i class="fa-solid fa-trash" onclick="deleteTask(${index})"></i>
                    <i class="fa-solid fa-list" onclick="addSubtask(${index})"></i>
                </div>
            `;

            taskItem.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", index);
            });
            taskItem.addEventListener("dragover", (e) => e.preventDefault());
            taskItem.addEventListener("drop", (e) => {
                e.preventDefault();
                const draggedIndex = e.dataTransfer.getData("text/plain");
                const droppedIndex = index;

                const temp = tasks[draggedIndex];
                tasks[draggedIndex] = tasks[droppedIndex];
                tasks[droppedIndex] = temp;
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(taskItem);
        });
    }

    function addTask() {
        if (taskInput.value.trim() === "") return;
        const newTask = {
            text: taskInput.value,
            category: categoryFilter.value,
            date: new Date().toLocaleString(),
            subtasks: []
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = "";
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const newText = prompt("Edit task:", tasks[index].text);
        if (newText) {
            tasks[index].text = newText;
            saveTasks();
            renderTasks();
        }
    }

    function addSubtask(index) {
        const subtaskText = prompt("Enter subtask:");
        if (subtaskText) {
            tasks[index].subtasks.push({ text: subtaskText, done: false });
            saveTasks();
            renderTasks();
        }
    }

    function toggleSubtask(taskIndex, subtaskIndex) {
        tasks[taskIndex].subtasks[subtaskIndex].done = !tasks[taskIndex].subtasks[subtaskIndex].done;
        saveTasks();
        renderTasks();
    }

    // Dark Mode Toggle
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    // Create Dark Mode Icon
    const darkModeIcon = document.createElement("i");
    darkModeIcon.classList.add("fa-solid", "fa-moon"); // Moon icon for dark mode
    darkModeIcon.id = "dark-mode-toggle";
    
    darkModeIcon.addEventListener("click", () => {
        toggleDarkMode();
        darkModeIcon.classList.toggle("fa-moon");
        darkModeIcon.classList.toggle("fa-sun"); // Toggle between moon & sun icons
    });

    document.body.appendChild(darkModeIcon);

    addButton.addEventListener("click", addTask);
    renderTasks();
});
