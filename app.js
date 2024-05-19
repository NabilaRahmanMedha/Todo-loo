const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');
const clearAllButton = document.getElementById('clear-all-button');

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit',function(e){
    e.preventDefault();
    addTodo();
});

clearAllButton.addEventListener('click', clearAllTodos);

function addTodo(){
    const todoText = todoInput.value.trim();
    if(todoText.length>0){
        const todoObject = {
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }
}

function updateTodoList() {

    todoListUL.innerHTML = "";
    if (allTodos.length === 0) {
        const noTaskItem = document.createElement("li");
        noTaskItem.textContent = "No task";
        noTaskItem.classList.add("todo-list-empty");
        todoListUL.appendChild(noTaskItem);
    } else {
        allTodos.forEach((todo, todoIndex) => {
            todoItem = createTodoItem(todo, todoIndex);
            todoListUL.append(todoItem);
        });
    }
    reorderTasks();
}

function createTodoItem(todo, todoIndex){
    const todoId = "todo-"+todoIndex;
    const todoLI =document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        <button class="edit-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
            </svg>
        </button>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `;

    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTodoItem(todoIndex);
    });

    const editButton = todoLI.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
        enableInlineEditing(todoLI, todoIndex);
    });

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
        allTodos[todoIndex].completed = checkbox.checked;
        reorderTasks();
        saveTodos();
        updateTodoList();
        if (checkbox.checked) {
            triggerConfetti();
            completionText();
        }
    });
    
    checkbox.checked = todo.completed;
    return todoLI;
}

function reorderTasks(){
    allTodos.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
    });
}

function enableInlineEditing(todoLI, todoIndex) {
    const todoTextElement = todoLI.querySelector(".todo-text");
    const todoText = todoTextElement.textContent.trim();

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = todoText;
    inputField.className = "todo-input-edit";
    todoTextElement.replaceWith(inputField);

    inputField.focus();

    inputField.addEventListener("blur", () => {
        const updatedText = inputField.value.trim();
        if (updatedText !== "") {
            allTodos[todoIndex].text = updatedText;
            saveTodos();
            updateTodoList();
        } else {
            inputField.value = todoText;
        }
    });

    inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            inputField.blur();
        }
    });
}

function completionText(){
    const levitatingText = document.createElement('div');
        levitatingText.classList.add('levitating-text');
        levitatingText.textContent = "You have completed a task";
        document.body.appendChild(levitatingText);
        setTimeout(() => {
            levitatingText.remove();
        }, 1500);
}

function triggerConfetti() {
    for (let i = 0; i < 3; i++) {
        confetti({
            particleCount: 200,
            spread: 300,
            origin: {
                x: Math.random(),
                y: Math.random() - 0.2
            }
        });
    }
}

function clearAllTodos() {
    allTodos = [];
    saveTodos();
    updateTodoList();
}

function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}


