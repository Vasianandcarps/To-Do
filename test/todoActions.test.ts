import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { addTodo, deleteTodoItem } from "../src/func/todoActions.js";
import { allTodos, updateAllTodos } from "../src/state.js";

// ... the rest of your code
describe('FEATURE: Todo List Management', () => {
    
    let mockInput: HTMLInputElement;
    const mockUpdateUI = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        updateAllTodos([]); // Reset global state
        mockInput = document.createElement('input');
    });

    describe('SCENARIO: Adding a new task', () => {
        test('GIVEN an empty list, WHEN a user adds "Buy Milk", THEN the list should have 1 item', () => {
            // GIVEN
            expect(allTodos.length).toBe(0);
            mockInput.value = "Buy Milk";

            // WHEN
            addTodo(mockInput, mockUpdateUI);

            // THEN
            expect(allTodos.length).toBe(1);
            expect(allTodos[0].text).toBe("Buy Milk");
            expect(allTodos[0].completed).toBe(false);
            
            // AND the UI should be refreshed and input cleared
            expect(mockUpdateUI).toHaveBeenCalled();
            expect(mockInput.value).toBe("");
        });
    });

    describe('SCENARIO: Attempting to add an empty task', () => {
        test('GIVEN an empty input, WHEN the user tries to add, THEN the list should remain empty', () => {
            // GIVEN
            mockInput.value = "";

            // WHEN
            addTodo(mockInput, mockUpdateUI);

            // THEN
            expect(allTodos.length).toBe(0);
            expect(mockUpdateUI).not.toHaveBeenCalled();
        });
    });

    describe('SCENARIO: Deleting a task', () => {
        test('GIVEN a list with one item, WHEN the user deletes it, THEN the list should be empty', () => {
            // GIVEN
            allTodos.push({ text: "Delete Me", completed: false });
            
            // WHEN
            deleteTodoItem(0, mockUpdateUI);

            // THEN
            expect(allTodos.length).toBe(0);
            expect(mockUpdateUI).toHaveBeenCalled();
        });
    });
});