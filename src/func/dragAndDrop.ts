import { allTodos, saveTodos } from "../state";

let draggedItem: HTMLElement | null = null;

export const dragHandlers = (updateUI: () => void) => ({
    start: (e: DragEvent) => {
        draggedItem = e.target as HTMLElement;
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
    },
    over: (e: DragEvent) => {
        e.preventDefault();
        const target = (e.target as HTMLElement).closest("li");
        if (target && target !== draggedItem) {
            target.style.borderTop = "2px solid var(--accent-color)";
        }
    },
    drop: (e: DragEvent) => {
        e.preventDefault();
        const targetItem = (e.target as HTMLElement).closest("li");
        const list = targetItem?.parentElement;
        if (!draggedItem || !targetItem || !list || draggedItem === targetItem) return;

        const listItems = Array.from(list.children);
        const draggedIdx = listItems.indexOf(draggedItem);
        const targetIdx = listItems.indexOf(targetItem);

        // Remove the item
        const movedItem = allTodos.splice(draggedIdx, 1)[0];

        // Add a check to satisfy TypeScript's strictness
        if (movedItem) {
            allTodos.splice(targetIdx, 0, movedItem);
            saveTodos();
            updateUI();
        }
    },
    end: (e: DragEvent) => {
        const li = (e.target as HTMLElement).closest("ul")?.querySelectorAll("li");
        li?.forEach(item => (item.style.borderTop = ""));
        draggedItem = null;
    }
});