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

let draggedItem = null;

function dragstartHandler(event) {
    draggedItem = event.target;
    event.dataTransfer.effectAllowed = "move";
}

function dragoverHandler(event) {
    event.preventDefault();
    const target = event.target.closest("li");
    if (target && target !== draggedItem) {
        target.style.borderTop = "2px solid #f9bd08";  // Визуальное выделение
    }
}

function dropHandler(event) {
    event.preventDefault();
    const targetItem = event.target.closest("li");
    if (!draggedItem || !targetItem || draggedItem === targetItem) return;

    const draggedIndex = Number(draggedItem.dataset.index);
    const targetIndex = Number(targetItem.dataset.index);

    // Удаляем перетаскиваемый элемент и вставляем его в нужную позицию
    const movedItem = allTodos.splice(draggedIndex, 1)[0];
    allTodos.splice(targetIndex, 0, movedItem);

    saveTodos();
    updateTodoList();
}
