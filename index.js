/******************************
REFERENCES
******************************/
const showTaskFormBtn = document.getElementById("show-task-form-btn");
const taskFormContainer = document.getElementById("new-task-container");
const cancelTaskBtn = document.getElementById("cancel-task-btn");
const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list"); // Add this line to reference the task list

/******************************
ADD NEW TASK TOGGLE
******************************/
showTaskFormBtn.addEventListener("click", () => {
  showTaskFormBtn.style.display = "none";
  taskFormContainer.style.display = "block";
});

cancelTaskBtn.addEventListener("click", () => {
  taskFormContainer.style.display = "none";
  showTaskFormBtn.style.display = "block";
});

/******************************
SUBMITTING THE FORM
******************************/
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;

  if (title && description) {
    const timestamp = getCurrentDateTime();
    
    // Add task to the UI
    addTaskToUI(title, description, false, timestamp);

    // Save the task in Chrome storage
    chrome.storage.sync.get("todos", (data) => {
      const todos = data.todos || [];
      todos.push({ title: title, description: description, completed: false, timestamp: timestamp });
      chrome.storage.sync.set({ todos });
    });

    // Clear the input fields
    document.getElementById("task-title").value = '';
    document.getElementById("task-desc").value = '';

    // Hide the form and show the "Add New Task" button again
    taskFormContainer.style.display = "none";
    showTaskFormBtn.style.display = "block";
  }
});

/******************************
TIME FORMAT
******************************/
function getCurrentDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/******************************
ADD TASK TO UI
******************************/
function addTaskToUI(title, description, completed, timestamp = null) {
  const li = document.createElement("li");

  // Create checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  
  // Create elements for title, description, and timestamp
  const taskTitle = document.createElement("span");
  taskTitle.textContent = title;
  taskTitle.className = "task-title";

  const taskDesc = document.createElement("span");
  taskDesc.textContent = description;
  taskDesc.className = "task-desc";

  const taskTimestamp = document.createElement("span");
  taskTimestamp.textContent = timestamp;
  taskTimestamp.className = "task-timestamp";

  // If the task is completed, apply the completed styles
  if (completed) {
    taskTitle.classList.add("completed");
    taskDesc.classList.add("completed");
  }

  // Toggle completed state on checkbox change
  checkbox.addEventListener("change", () => {
    taskTitle.classList.toggle("completed", checkbox.checked);
    taskDesc.classList.toggle("completed", checkbox.checked);
    toggleTaskCompleted(title);
  });

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = "&#10006;"; // Use an X icon for delete
  deleteBtn.addEventListener("click", () => {
    // Remove the task from the DOM
    todoList.removeChild(li);
    
    // Remove the task from chrome.storage.sync
    chrome.storage.sync.get("todos", (data) => {
      const todos = data.todos || [];
      const updatedTodos = todos.filter(t => t.title !== title); // Remove task by title
      chrome.storage.sync.set({ todos: updatedTodos });
    });
  });

  // Create a div for task actions (checkbox and delete button)
  const taskActions = document.createElement("div");
  taskActions.className = "task-actions";
  taskActions.appendChild(checkbox);
  taskActions.appendChild(deleteBtn);

  // Append elements to the list item
  li.appendChild(taskTitle);
  li.appendChild(taskDesc);
  li.appendChild(taskTimestamp);
  li.appendChild(taskActions);

  // Append list item to the task list
  todoList.appendChild(li);
}

/******************************
LOAD TASKS FROM STORAGE ON EXTENSION OPEN
******************************/
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get("todos", (data) => {
    const todos = data.todos || [];
    todos.forEach((todo) => {
      addTaskToUI(todo.title, todo.description, todo.completed, todo.timestamp);
    });
  });
});
