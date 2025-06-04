/* jshint esversion: 6 */

// Toggle light/dark theme
const body = document.body;
const lightBtn = document.getElementById("lightMode");
const darkBtn = document.getElementById("darkMode");

function setTheme(mode) {
  if (mode === "dark") {
    body.classList.add("dark");
    body.classList.remove("light");
    darkBtn.classList.add("active");
    lightBtn.classList.remove("active");
  } else {
    body.classList.add("light");
    body.classList.remove("dark");
    lightBtn.classList.add("active");
    darkBtn.classList.remove("active");
  }
  localStorage.setItem("theme", mode); // Optional: Save preference
}

// Event listeners
lightBtn.addEventListener("click", () => setTheme("light"));
darkBtn.addEventListener("click", () => setTheme("dark"));

// Load saved theme on startup
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || savedTheme === "light") {
  setTheme(savedTheme);
} else {
  setTheme("light"); // default
}

// Add a new task to the list
function newElement() {
  const input = document.getElementById("myInput"); // Gets the input field with ID "myInput" from the HTML
  let inputValue = input.value.trim(); // Removes extra spaces from the input value

  // Check if the input is empty
  if (inputValue === "") {
    alert("Please enter a task!"); // Show an alert if no task is entered
    return;
  }

  // Check if the input exceeds 40 characters
  if (inputValue.length > 40) {
    alert("Task cannot be more than 40 characters!"); // Show an alert if the task is too long
    return;
  }

  // Capitalize the first letter and make the rest lowercase
  inputValue =
    inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();

  addTaskToDOM(inputValue); // Calls the function to add the task to the DOM
  input.value = ""; // Clears the input field
  saveTasks(); // Calls the function to save the updated task list to localStorage
}

// Add a task when the Enter key is pressed
document.getElementById("myInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    newElement(); // Calls the function to add a new task
  }
});

// Helper function: Create and insert a task into the DOM
function addTaskToDOM(text, checked = false) {
  const li = document.createElement("li"); // Creates a new list item (li) element
  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = text;
  li.appendChild(textSpan);

  if (checked) li.classList.add("checked"); // Adds the "checked" class if the task is marked as complete

  const span = document.createElement("SPAN"); // Creates a close button (span element)
  span.className = "close"; // Assigns the "close" class for styling
  span.textContent = "\u00D7"; // Unicode for the "×" symbol
  span.onclick = function () {
    const taskItem = this.parentElement; // Gets the parent list item (li)

    // If the task is marked as complete
    if (taskItem.classList.contains("checked")) {
      taskItem.classList.add("removing"); // Adds the "removing" class for animation

      // Show a firework message
      showFireworkMessage(); // Calls the function to display a congratulatory message

      // Remove the task after the animation
      setTimeout(() => {
        taskItem.remove(); // Removes the task from the DOM
        saveTasks(); // Calls the function to save the updated task list
      }, 700);
    } else {
      taskItem.remove(); // Removes the task immediately
      saveTasks(); // Calls the function to save the updated task list
    }
  };

  li.appendChild(span); // Adds the close button to the task
  document.getElementById("myUL").appendChild(li); // Adds the task to the unordered list (ul) with ID "myUL"
}

// Mark a task as complete or incomplete
document.getElementById("myUL").addEventListener("click", function (e) {
  // Find the closest 'li' ancestor of the clicked element
  const listItem = e.target.closest('li');

  // If an 'li' was found and the click was not on the 'close' button
  if (listItem && !e.target.classList.contains('close')) {
    listItem.classList.toggle("checked"); // Toggle the "checked" class on the LI
    saveTasks(); // Save the updated task list
  }
});

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#myUL li").forEach((li) => {
    // CORRECTED LINE: Get the text content from the span with class 'task-text'
    const text = li.querySelector(".task-text").textContent.trim();
    const checked = li.classList.contains("checked");
    tasks.push({ text, checked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const saved = localStorage.getItem("tasks"); // Gets tasks from localStorage
  if (saved) {
    const tasks = JSON.parse(saved); // Parses the saved tasks
    tasks.forEach((task) => addTaskToDOM(task.text, task.checked)); // Adds each task to the DOM
  }
}

loadTasks(); // Calls the function to load tasks when the page loads

// Show a firework message when a task is removed
function showFireworkMessage() {
  const container = document.createElement("div"); // Creates a container for the firework
  container.className = "firework-container"; // Assigns the "firework-container" class for styling

  const message = document.createElement("div"); // Creates a message element
  message.className = "firework-message"; // Assigns the "firework-message" class for styling
  message.textContent = "Well done beauty! One more task out of the way!"; // Sets the congratulatory message
  container.appendChild(message); // Adds the message to the container

  // Create animated firework dots
  for (let i = 0; i < 12; i++) {
    const dot = document.createElement("div"); // Creates a new div element for the firework dot
    dot.className = "firework-dot"; // Assigns the "firework-dot" class for styling and animation

    const angle = Math.random() * 2 * Math.PI; // Generates a random angle (in radians) for the dot's direction
    const distance = 80 + Math.random() * 40; // Generates a random distance for how far the dot will travel
    const x = Math.cos(angle) * distance; // Calculates the horizontal offset using cosine
    const y = Math.sin(angle) * distance; // Calculates the vertical offset using sine

    dot.style.setProperty("--x", `${x}px`); // Sets the horizontal position as a CSS custom property
    dot.style.setProperty("--y", `${y}px`); // Sets the vertical position as a CSS custom property

    container.appendChild(dot); // Adds the dot to the firework container
  }

  document.body.appendChild(container); // Adds the firework container to the document body

  // Remove the firework container after 2 seconds to clean up the DOM
  setTimeout(() => {
    container.remove(); // Removes the container and its child elements
  }, 2000); // Delay of 2000 milliseconds (2 seconds)
}