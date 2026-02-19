import type { Todo } from "./types";

export let allTodos: Todo[] = JSON.parse(localStorage.getItem("todos") || "[]");

export const saveTodos = (): void => {
    localStorage.setItem("todos", JSON.stringify(allTodos));
};

export const updateAllTodos = (newList: Todo[]) => {
    allTodos = newList;
    saveTodos();
};