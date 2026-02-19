import { allTodos, saveTodos } from "./state";
import { addTodo, deleteTodoItem } from "./func/todoActions";
import { dragHandlers } from "./func/dragAndDrop";


const todoForm = document.querySelector('form')!;
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoListUL = document.getElementById('todo-list') as HTMLUListElement;

const handlers = dragHandlers(updateTodoList);

function updateTodoList(): void {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, index) => {
        const li = createTodoItem(todo, index);
        todoListUL.append(li);
    });
}

function createTodoItem(todo: { text: string, completed: boolean }, index: number): HTMLLIElement {
    const li = document.createElement("li");
    li.className = "todo";
    li.draggable = true;

    // Attach Drag Events
    li.addEventListener("dragstart", handlers.start);
    li.addEventListener("dragover", handlers.over);
    li.addEventListener("drop", handlers.drop);
    li.addEventListener("dragend", handlers.end);

    li.innerHTML = `
        <input type="checkbox" id="todo-${index}" ${todo.completed ? 'checked' : ''}>
        <label for="todo-${index}" class="todo-text">${todo.text}</label>
        <button class="delete-button">❌</button>
    `;

    const checkbox = li.querySelector('input');
if (checkbox) {
    checkbox.addEventListener('change', (e) => {
        // We use 'as HTMLInputElement' because e.target is generic
        const target = e.target as HTMLInputElement;
        if (allTodos[index]) {
            allTodos[index].completed = target.checked;
            saveTodos();
        }
    });
}

const deleteBtn = li.querySelector('.delete-button');
if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        deleteTodoItem(index, updateTodoList);
    });
}
    return li;
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(todoInput, updateTodoList);
});

// Initial Render
updateTodoList();