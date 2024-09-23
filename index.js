/******************************
REFERENCES
******************************/
const showTaskFormBtn = document.getElementById("show-task-form-btn");
const taskFormContainer = document.getElementById("new-task-container");
const cancelTaskBtn = document.getElementById("cancel-task-btn");
const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list");
const allFilterBtn = document.getElementById("filter-all");
const completeFilterBtn = document.getElementById("filter-complete");
const incompleteFilterBtn = document.getElementById("filter-incomplete");

// Categories
const categories = [];
let selectedCategories = []; // Store the selected categories for a task
const categoriesList = document.getElementById("categories-list");
const newCategoryInput = document.getElementById("new-category-name");
const addNewCategoryBtn = document.getElementById("add-new-category-btn");

// Icons Menu
const categoryBtn = document.getElementById('open-category-menu-btn');
const reminderBtn = document.getElementById('open-reminder-menu-btn');
const colorBtn = document.getElementById('open-color-menu-btn');
const taskReminderInput = document.getElementById('task-reminder');
const taskCategorySection = document.querySelector(".task-section-categories");
const taskColorSection = document.querySelector(".task-section-color");
const priorityBtn = document.getElementById('open-priority-menu-btn');
const prioritySection = document.getElementById('priority-section');
const prioritySelect = document.getElementById('task-priority');

// Color Options for Category Creation
const colorDropdown = document.getElementById('color-dropdown');
const colorOptionsList = document.getElementById('color-options');
const colorOptions = [
    { name: 'Red', value: '#FF5733' },
    { name: 'Green', value: '#33FF57' },
    { name: 'Blue', value: '#3357FF' },
    { name: 'Pink', value: '#FF33A1' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Purple', value: '#9B30FF' },
    { name: 'Turquoise', value: '#00CED1' },
    { name: 'Brown', value: '#A52A2A' },
    { name: 'Slate Gray', value: '#708090' }
];

// Tooltip Event Listeners
const tooltips = {
    category: document.getElementById('tooltip-category'),
    reminder: document.getElementById('tooltip-reminder'),
    color: document.getElementById('tooltip-color')
};

// Hover Event Listeners for Showing Tooltips
categoryBtn.addEventListener('mouseenter', () => showTooltip(tooltips.category));
categoryBtn.addEventListener('mouseleave', () => hideTooltip(tooltips.category));
reminderBtn.addEventListener('mouseenter', () => showTooltip(tooltips.reminder));
reminderBtn.addEventListener('mouseleave', () => hideTooltip(tooltips.reminder));
colorBtn.addEventListener('mouseenter', () => showTooltip(tooltips.color));
colorBtn.addEventListener('mouseleave', () => hideTooltip(tooltips.color));

function showTooltip(tooltip) {
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
}

function hideTooltip(tooltip) {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
}

/******************************
BACKGROUND COLOR PICKER
******************************/
const colorCircles = document.querySelectorAll('.color-circle');
let selectedBgColor = ''; // Default background color

colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
        // Remove the border from all circles
        colorCircles.forEach(c => c.style.border = '2px solid transparent');
        
        // Set the selected border to the clicked circle
        circle.style.border = '2px solid #000';
        
        // Get the selected color
        selectedBgColor = circle.getAttribute('data-color');
    });
});

/******************************
CATEGORY, REMINDER, AND COLOR MENU TOGGLES
******************************/
categoryBtn.addEventListener("click", () => {
    taskCategorySection.style.display = taskCategorySection.style.display === "none" ? "block" : "none";
});

reminderBtn.addEventListener("click", () => {
    taskReminderInput.style.display = taskReminderInput.style.display === "none" ? "block" : "none";
});

colorBtn.addEventListener("click", () => {
    taskColorSection.style.display = taskColorSection.style.display === "none" ? "block" : "none";
});

priorityBtn.addEventListener("click", () => {
    prioritySection.style.display = prioritySection.style.display === "none" ? "block" : "none";
});


/******************************
CATEGORY SELECTION AND CREATION
******************************/
addNewCategoryBtn.addEventListener("click", () => {
    const newCategory = newCategoryInput.value.trim();

    if (newCategory && !categories.some(cat => cat.name === newCategory)) {
        // Add new category to the list
        categories.push({ name: newCategory, selected: false });
        renderCategories();
        newCategoryInput.value = ''; // Clear the input field
    }
});

function renderCategories() {
    categoriesList.innerHTML = ''; // Clear current categories

    categories.forEach((category, index) => {
        // Create checkbox for each category
        const categoryItem = document.createElement("div");
        categoryItem.classList.add("category-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = category.selected;
        checkbox.addEventListener("change", () => {
            category.selected = checkbox.checked;
            updateSelectedCategories();
        });

        const label = document.createElement("label");
        label.textContent = category.name;

        // Create edit and delete buttons for the category
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-category-btn";
        editBtn.addEventListener("click", () => editCategory(index));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-category-btn";
        deleteBtn.addEventListener("click", () => deleteCategory(index));

        categoryItem.appendChild(checkbox);
        categoryItem.appendChild(label);
        categoryItem.appendChild(editBtn);
        categoryItem.appendChild(deleteBtn);

        categoriesList.appendChild(categoryItem);
    });
}

function updateSelectedCategories() {
    selectedCategories = categories.filter(cat => cat.selected).map(cat => cat.name);
}

function editCategory(index) {
    const newCategoryName = prompt("Edit category name:", categories[index].name);

    if (newCategoryName && newCategoryName.trim() !== '') {
        categories[index].name = newCategoryName.trim();
        renderCategories();
    }
}

function deleteCategory(index) {
    categories.splice(index, 1); // Remove the category
    renderCategories();
}
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
FILTER TASKS
******************************/
function filterTasks(filter) {
    const tasks = todoList.querySelectorAll("li"); // Select all tasks (li elements)

    // Remove active class from all buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    // Add active class to the selected filter button
    if (filter === "all") {
        allFilterBtn.classList.add("active");
    } else if (filter === "complete") {
        completeFilterBtn.classList.add("active");
    } else if (filter === "incomplete") {
        incompleteFilterBtn.classList.add("active");
    }

    // Get tasks from Chrome storage and apply the filter
    chrome.storage.sync.get("todos", (data) => {
        const todos = data.todos || [];
        
        // Loop through each task and show/hide based on the filter
        tasks.forEach((task, index) => {
            const taskCheckbox = task.querySelector("input[type='checkbox']");
            const isCompleted = taskCheckbox.checked;

            if (filter === "all") {
                task.style.display = "flex"; // Show all tasks
            } else if (filter === "complete") {
                task.style.display = isCompleted ? "flex" : "none"; // Show only completed tasks
            } else if (filter === "incomplete") {
                task.style.display = !isCompleted ? "flex" : "none"; // Show only incomplete tasks
            }
        });
    });
}


function updateFilterVisibility() {
    const taskCount = todoList.children.length; // Count the tasks in the list
    const filterContainer = document.getElementById("filter-container");

    if (taskCount > 0) {
        filterContainer.style.display = "flex"; // Show filter buttons if there are tasks
    } else {
        filterContainer.style.display = "none"; // Hide filter buttons if no tasks
    }
}

allFilterBtn.addEventListener("click", () => {
    filterTasks("all");
});

completeFilterBtn.addEventListener("click", () => {
    filterTasks("complete");
});

incompleteFilterBtn.addEventListener("click", () => {
    filterTasks("incomplete");
});
/******************************
UPDATE PROGRESS BAR
******************************/
function updateProgressBar() {
    chrome.storage.sync.get("todos", (data) => {
        const todos = data.todos || [];
        const totalTasks = todos.length;
        const completedTasks = todos.filter(task => task.completed).length;

        // Calculate the percentage of completed tasks
        const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        // Update the progress bar and percentage display
        const progressBar = document.getElementById("progress-bar");
        const progressPercent = document.getElementById("progress-percent");
        progressBar.style.width = `${completionPercentage}%`;
        progressPercent.textContent = `${completionPercentage}%`;
    });
}
/******************************
SORT TASKS BY PRIORITY
******************************/
function sortTasksByPriority() {
    // Get all the tasks from the DOM
    const tasks = Array.from(todoList.children);

    // Define a priority order
    const priorityOrder = {
        "blocker": 1,
        "critical": 2,
        "major": 3,
        "minor": 4,
        "none": 5
    };

    // Sort tasks based on priority
    tasks.sort((a, b) => {
        const priorityA = priorityOrder[a.getAttribute('data-priority')] || 5;
        const priorityB = priorityOrder[b.getAttribute('data-priority')] || 5;
        return priorityA - priorityB;
    });

    // Clear the list and re-append tasks in the new order
    todoList.innerHTML = '';
    tasks.forEach(task => {
        todoList.appendChild(task);
    });
}

/******************************
SUBMITTING THE FORM
******************************/
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const reminder = document.getElementById("task-reminder").value;
    const priority = prioritySelect.value;
    const backgroundColor = selectedBgColor || '#fff';

    const associatedCategories = categories.filter(cat => cat.selected);

    if (title && description) {
        const timestamp = getCurrentDateTime();

        // Add task to the UI
        addTaskToUI(
            title,
            description,
            associatedCategories,
            priority,
            backgroundColor,
            false,
            timestamp,
            reminder
        );

        // Save the task in Chrome storage
        chrome.storage.sync.get("todos", (data) => {
            const todos = data.todos || [];
            todos.push({
                title: title,
                description: description,
                categories: associatedCategories,
                priority: priority,
                backgroundColor: backgroundColor,
                completed: false,
                timestamp: timestamp,
                reminder: reminder
            });
            chrome.storage.sync.set({ todos });

            if (reminder) {
                scheduleReminderNotification(title, description, reminder);
            }

            updateProgressBar();
        });

        // Clear the input fields
        document.getElementById("task-title").value = '';
        document.getElementById("task-desc").value = '';
        document.getElementById("task-reminder").value = '';
        selectedCategories = [];
        prioritySelect.value = 'none';
        selectedBgColor = '';
        renderCategories();
        updateFilterVisibility();

        // Hide the form and show the "Add New Task" button again
        taskFormContainer.style.display = "none";
        showTaskFormBtn.style.display = "block";
        
        sortTasksByPriority();
    }
});


/******************************
DELETE TASK (Update Progress Bar)
******************************/
function deleteTask(title) {
    chrome.storage.sync.get("todos", (data) => {
        const todos = data.todos || [];
        const updatedTodos = todos.filter(task => task.title !== title); // Remove the task by title
        chrome.storage.sync.set({ todos: updatedTodos });

        // Update the progress bar after task deletion
        updateProgressBar();
    });
}

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
        updateProgressBar();
    });
}
/******************************
EDIT TASK
******************************/
function enableTaskEditing(taskElement, taskData) {
    const editBtn = taskElement.querySelector('.edit-btn');
    
    if (taskData.completed) {
        editBtn.style.display = 'none'; // Hide edit button if task is completed
        return;
    }

    editBtn.addEventListener("click", () => {
        // Switch between 'Edit' and 'Save'
        if (editBtn.textContent === "🖊") {
            // Switch to editable mode
            enableTaskFormEditing(taskElement, taskData);
            editBtn.textContent = "💾"; // Change the button to "Save"
        } else {
            // Save changes
            saveTaskEdits(taskElement, taskData);
            editBtn.textContent = "🖊"; // Change the button back to "Edit"
        }
    });
}

function saveTaskEdits(taskElement, taskData) {
    const taskTitle = taskElement.querySelector(".task-title").textContent;
    const taskDesc = taskElement.querySelector(".task-desc").textContent;
    
    // Update the task object
    taskData.title = taskTitle;
    taskData.description = taskDesc;
    taskData.priority = prioritySelect.value;
    taskData.backgroundColor = selectedBgColor;
    taskData.categories = selectedCategories; // Use the updated selected categories
    
    // Update in Chrome storage
    chrome.storage.sync.get("todos", (data) => {
        const todos = data.todos || [];
        const updatedTodos = todos.map(t => {
            if (t.title === taskData.originalTitle) { // originalTitle to identify the task before editing
                return {
                    ...t,
                    title: taskData.title,
                    description: taskData.description,
                    priority: taskData.priority,
                    backgroundColor: taskData.backgroundColor,
                    categories: taskData.categories
                };
            }
            return t;
        });
        chrome.storage.sync.set({ todos: updatedTodos });
    });

    // Reflect the updates in the UI
    taskElement.querySelector(".task-title").textContent = taskTitle;
    taskElement.querySelector(".task-desc").textContent = taskDesc;

    // Disable editable mode
    taskElement.querySelector(".task-title").contentEditable = false;
    taskElement.querySelector(".task-desc").contentEditable = false;
}

function updateCategoryCheckboxes(currentCategories) {
    categories.forEach(cat => {
        cat.selected = currentCategories.some(selectedCat => selectedCat.name === cat.name);
    });
    renderCategories(); // Re-render the categories with the updated selections
}

function updateBackgroundColorPicker(currentColor) {
    const colorCircles = document.querySelectorAll('.color-circle');
    colorCircles.forEach(circle => {
        circle.style.border = '2px solid transparent'; // Reset the borders

        // If the color matches, highlight the circle
        if (circle.getAttribute('data-color') === currentColor) {
            circle.style.border = '2px solid #000';
        }
    });
}

function enableTaskFormEditing(taskElement, taskData) {
    // Title and Description become editable
    const taskTitle = taskElement.querySelector(".task-title");
    const taskDesc = taskElement.querySelector(".task-desc");
    taskTitle.contentEditable = true;
    taskDesc.contentEditable = true;

    // Populate the task form with the current values (categories, priority, background color)
    prioritySelect.value = taskData.priority || "none";
    selectedBgColor = taskData.backgroundColor;
    updateBackgroundColorPicker(taskData.backgroundColor); // Update the background color selection
    updateCategoryCheckboxes(taskData.categories); // Mark the associated categories
}


/******************************
ADD TASK TO UI (WITH PRIORITY)
******************************/

function addTaskToUI(title, description, categories, priority = 'none', backgroundColor, completed, timestamp = null, reminder) {
    const li = document.createElement("li");
    li.setAttribute('data-priority', priority);
    li.style.backgroundColor = backgroundColor; 

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    // Create a container for task details (title, description, timestamp)
    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";

    if (categories.length > 0) {
        const taskCategories = document.createElement("span");
        taskCategories.textContent = "Categories: " + categories.map(cat => cat.name).join(', ');
        taskCategories.className = "task-categories";
        taskInfo.appendChild(taskCategories);
    }

    if (priority !== 'none') {
        const taskPriority = document.createElement("span");
        taskPriority.textContent = `Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`;
        taskPriority.className = "task-priority";
        taskInfo.appendChild(taskPriority);
    }

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
        taskReminder.classList.toggle("completed", checkbox.checked);

        // Call the function to update the task's completed status in storage
        toggleTaskCompleted(title);
    });

    // Create edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = "🖊";

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

        updateFilterVisibility();
    });

    // Append elements to the list item
    li.appendChild(checkbox);   // Column 1: Checkbox
    li.appendChild(taskInfo);   // Column 2: Task details (title, description, timestamp)
    li.appendChild(editBtn);    // Column 3: Edit button
    li.appendChild(deleteBtn);  // Column 3: Delete button

    // Append list item to the task list
    todoList.appendChild(li);

    enableTaskEditing(li, {
        originalTitle: title, // Save the original title for identification
        title,
        description,
        priority,
        backgroundColor,
        categories,
        completed
    });
    sortTasksByPriority();
}

/******************************
LOAD TASKS FROM STORAGE ON EXTENSION OPEN
******************************/
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get("todos", (data) => {
        const todos = data.todos || [];
        todos.forEach((todo) => {
            addTaskToUI(
                todo.title,
                todo.description,
                todo.categories,
                todo.priority,
                todo.backgroundColor,
                todo.completed,
                todo.timestamp,
                todo.reminder
            );
        });
        updateProgressBar();
    });

    updateFilterVisibility();
});
