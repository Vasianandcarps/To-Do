import { allTodos, saveTodos } from "../state.js";

export function addTodo(inputEl: HTMLInputElement, onSuccess: () => void): void {
    const text = inputEl.value.trim();
    if (text.length > 0) {
        allTodos.push({ text, completed: false });
        saveTodos();
        inputEl.value = "";
        onSuccess();
    }
}

export function deleteTodoItem(index: number, onSuccess: () => void): void {
    allTodos.splice(index, 1);
    saveTodos();
    onSuccess();
}