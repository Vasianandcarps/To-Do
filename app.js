const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false
        };
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }
}

function updateTodoList() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });
}

function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    todoLI.className = "todo";
    todoLI.draggable = "true";
    todoLI.dataset.index = todoIndex;

    todoLI.addEventListener("dragstart", dragstartHandler);
    todoLI.addEventListener("dragover", dragoverHandler);
    todoLI.addEventListener("drop", dropHandler);
    todoLI.addEventListener("dragend", dragendHandler);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = todoId;
    input.checked = todo.completed;

    const labelText = document.createElement("label");
    labelText.setAttribute("for", todoId);
    labelText.classList.add("todo-text");
    labelText.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    });

    input.addEventListener("change", () => {
        allTodos[todoIndex].completed = input.checked;
        saveTodos();
    });

    todoLI.appendChild(input);
    todoLI.appendChild(labelText);
    todoLI.appendChild(deleteButton);

    return todoLI;
}

function deleteTodoItem(todoIndex) {
    allTodos.splice(todoIndex, 1);
    saveTodos();
    updateTodoList();
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(allTodos));
}

function getTodos() {
    return JSON.parse(localStorage.getItem("todos") || "[]");
}

// --- Drag and Drop Logic ---
let draggedItem = null;

function dragstartHandler(event) {
    draggedItem = event.target;
    event.dataTransfer.effectAllowed = "move";
}

function dragoverHandler(event) {
    event.preventDefault();
    const target = event.target.closest("li");
    if (target && target !== draggedItem) {
        // Подсветка элемента, на который перетаскиваем
        const listItems = Array.from(todoListUL.children);
        listItems.forEach(item => item.style.borderTop = ""); // Убираем старую подсветку
        target.style.borderTop = "2px solid var(--accent-color)"; // Подсвечиваем цель
    }
}

function dropHandler(event) {
    event.preventDefault();

    const targetItem = event.target.closest("li");
    if (!draggedItem || !targetItem || draggedItem === targetItem) return;

    const listItems = Array.from(todoListUL.children);
    const draggedIdx = listItems.indexOf(draggedItem); // Индекс перетаскиваемого элемента
    const targetIdx = listItems.indexOf(targetItem); // Индекс целевого элемента

    // Перемещаем элемент в новый индекс
    const movedItem = allTodos.splice(draggedIdx, 1)[0];
    allTodos.splice(targetIdx, 0, movedItem);

    saveTodos();
    updateTodoList();
}

function dragendHandler(event) {
    const listItems = todoListUL.querySelectorAll("li");
    listItems.forEach(item => {
        item.style.borderTop = ""; // Убираем визуальную подсветку
    });
    draggedItem = null;
}

// --- Theme Toggle ---
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null) {
        return localStorageTheme;
    }

    if (systemSettingDark.matches) {
        return "dark";
    }

    return "light";
}

function updateButton({ buttonEl, isDark }) {
    const iconEl = buttonEl.querySelector('i');
    if (!iconEl) return;

    if (isDark) {
        iconEl.className = "fas fa-sun";
        buttonEl.setAttribute("aria-label", "Change to light theme");
    } else {
        iconEl.className = "fas fa-moon";
        buttonEl.setAttribute("aria-label", "Change to dark theme");
    }
}

function updateThemeOnHtmlEl({ theme }) {
    document.querySelector("html").setAttribute("data-theme", theme);
}

const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

button.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    updateButton({ buttonEl: button, isDark: newTheme === "dark" });
    updateThemeOnHtmlEl({ theme: newTheme });

    currentThemeSetting = newTheme;
});
