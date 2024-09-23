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
  const reminder = document.getElementById("task-reminder").value;

  if (title && description) {
    const timestamp = getCurrentDateTime();
    
    // Add task to the UI
    addTaskToUI(title, description, false, timestamp, reminder);

    // Save the task in Chrome storage
    chrome.storage.sync.get("todos", (data) => {
      const todos = data.todos || [];
      todos.push({ title: title, description: description, completed: false, timestamp: timestamp, reminder: reminder });
      chrome.storage.sync.set({ todos });

      if (reminder) {
        scheduleReminderNotification(title, description, reminder);
      }
    });

    // Clear the input fields
    document.getElementById("task-title").value = '';
    document.getElementById("task-desc").value = '';
    document.getElementById("task-reminder").value = '';

    // Hide the form and show the "Add New Task" button again
    taskFormContainer.style.display = "none";
    showTaskFormBtn.style.display = "block";
  }
});

/******************************
NOTIFICATION
******************************/
  function scheduleReminderNotification(title, description, reminder) {
    const reminderTime = new Date(reminder).getTime();
    const now = new Date().getTime();
    const timeDifference = (reminderTime - now) / 1000; // Time difference in seconds
  
    if (timeDifference > 0) {
      chrome.alarms.create(title, { delayInMinutes: timeDifference / 60 });
    }
  }

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

function toggleTaskCompleted(title) {
    chrome.storage.sync.get("todos", (data) => {
      const todos = data.todos || [];
      const updatedTodos = todos.map((t) => {
        if (t.title === title) {
          return {
            ...t,
            completed: !t.completed, // Toggle the completed state
          };
        }
        return t;
      });
      chrome.storage.sync.set({ todos: updatedTodos });
    });
  }
  

/******************************
ADD TASK TO UI
******************************/
function addTaskToUI(title, description, completed, timestamp = null, reminder) {
    const li = document.createElement("li");
  
    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    
    // Create a container for task details (title, description, timestamp)
    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";
    
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

    const taskReminder = document.createElement("span");
    taskReminder.textContent = reminder ? `Reminder set for: ${new Date(reminder).toLocaleString()}` : 'No reminder set';
    taskReminder.className = "task-reminder";
  
    // Append title, description, and timestamp to the task info container
    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(taskDesc);
    taskInfo.appendChild(taskTimestamp);
    taskInfo.appendChild(taskReminder);
  
    // If the task is completed, apply the completed styles
    if (completed) {
      taskTitle.classList.add("completed");
      taskDesc.classList.add("completed");
      taskTimestamp.classList.add("completed");
      taskReminder.classList.add("completed");
    }
  
    // Toggle completed state on checkbox change
    checkbox.addEventListener("change", () => {
      taskTitle.classList.toggle("completed", checkbox.checked);
      taskDesc.classList.toggle("completed", checkbox.checked);
      taskTimestamp.classList.toggle("completed", checkbox.checked);
      toggleTaskCompleted(title);
    });

    // Create edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = "🖊";
    // Add functionality to edit the task
    editBtn.addEventListener("click", () => {
        if (editBtn.innerHTML === "🖊") {
        // Switch to editable mode
        taskTitle.contentEditable = true;
        taskDesc.contentEditable = true;
        taskTitle.focus();
        editBtn.innerHTML = "💾"; // Change the button to "Save"
        } else {
        // Save changes
        taskTitle.contentEditable = false;
        taskDesc.contentEditable = false;
        editBtn.innerHTML = "🖊"; // Switch back to "Edit"

        // Save the updated task in chrome.storage.sync
        chrome.storage.sync.get("todos", (data) => {
            const todos = data.todos || [];
            const updatedTodos = todos.map(t => {
            if (t.title === title) {
                return {
                ...t,
                title: taskTitle.textContent,
                description: taskDesc.textContent,
                };
            }
            return t;
            });
            chrome.storage.sync.set({ todos: updatedTodos });
        });
        }
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
  
    // Append elements to the list item
    li.appendChild(checkbox);   // Column 1: Checkbox
    li.appendChild(taskInfo);   // Column 2: Task details (title, description, timestamp)
    li.appendChild(editBtn);    // Column 3: Edit button
    li.appendChild(deleteBtn);  // Column 3: Delete button
  
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
      addTaskToUI(todo.title, todo.description, todo.completed, todo.timestamp, todo.reminder);
    });
  });
});
