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

// Add a new task to the list (used by input field and drag/drop)
function newElement(taskText = null) {
  // Modified to accept taskText for drag/drop
  const input = document.getElementById("myInput");
  let inputValue;

  if (taskText) {
    // If taskText is provided (from drag/drop)
    inputValue = taskText.trim();
  } else {
    // Otherwise, get from input field
    inputValue = input.value.trim();
  }

  // Check if the input is empty
  if (inputValue === "") {
    alert("Please enter a task!");
    return;
  }

  // Check if the input exceeds 40 characters
  if (inputValue.length > 40) {
    alert("Task cannot be more than 40 characters!");
    return;
  }

  // Capitalize the first letter and make the rest lowercase
  inputValue =
    inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();

  addTaskToDOM(inputValue); // Calls the function to add the task to the DOM
  if (!taskText) {
    // Only clear input if it wasn't from drag/drop
    input.value = "";
  }
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
  const li = document.createElement("li");
  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = text;
  li.appendChild(textSpan);

  if (checked) li.classList.add("checked");

  const span = document.createElement("SPAN");
  span.className = "close";
  span.textContent = "\u00D7";

  // Event handler for the close button
  span.onclick = function () {
    const taskItem = this.parentElement; // The <li> element

    // If the task was checked, play animation and fireworks
    if (taskItem.classList.contains("checked")) {
      taskItem.classList.add("removing"); // For spin-out animation
      triggerFireworks(); // Call the firework function
      setTimeout(() => {
        taskItem.remove(); // Remove task after animation
        saveTasks();
      }, 700); // Match spinOut animation duration
    } else {
      // If not checked, remove immediately without fireworks
      taskItem.remove();
      saveTasks();
    }
  };

  li.appendChild(span); // Adds the close button to the task
  document.getElementById("myUL").appendChild(li); // Adds the task to the unordered list (ul) with ID "myUL"
}

// Mark a task as complete or incomplete by clicking on the list item itself
document.getElementById("myUL").addEventListener("click", function (e) {
  const listItem = e.target.closest('li'); // Find the closest 'li' ancestor

  // CRITICAL: Only proceed if a list item was clicked AND it was NOT the 'close' button
  if (listItem && !e.target.classList.contains('close')) {
    listItem.classList.toggle("checked"); // Toggle the "checked" class
    saveTasks(); // Save the updated task list
    // Removed fireworks here, as they should only trigger on removal by 'x'
  }
});

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#myUL li").forEach((li) => {
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

// Function to show the new firework effect and message
function triggerFireworks() {
  const fireworkOverlay = document.getElementById("fireworkOverlay");

  if (!fireworkOverlay) {
    console.error("Firework overlay container not found!");
    return;
  }

  // Clear any existing content in the overlay first
  fireworkOverlay.innerHTML = "";

  // 1. Create and append the message
  const messageDiv = document.createElement("div");
  messageDiv.className = "firework-message";
  messageDiv.textContent = "Well done beauty! One more task out of the way!";
  fireworkOverlay.appendChild(messageDiv);

  // 2. Activate the overlay (make it visible)
  fireworkOverlay.classList.add("active");

  // Custom color sets for different firework types
  const fireworkColorSets = [
    {
      c1: "yellow",
      c2: "khaki",
      c3: "white",
      c4: "lime",
      c5: "gold",
      c6: "mediumseagreen",
    },
    {
      c1: "pink",
      c2: "violet",
      c3: "fuchsia",
      c4: "orchid",
      c5: "plum",
      c6: "lavender",
    },
    {
      c1: "cyan",
      c2: "lightcyan",
      c3: "lightblue",
      c4: "PaleTurquoise",
      c5: "SkyBlue",
      c6: "lavender",
    },
    {
      c1: "red",
      c2: "orange",
      c3: "yellow",
      c4: "gold",
      c5: "darkorange",
      c6: "salmon",
    },
    {
      c1: "greenyellow",
      c2: "lime",
      c3: "darkgreen",
      c4: "forestgreen",
      c5: "lightgreen",
      c6: "chartreuse",
    },
  ];

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Function to create and append a single firework element
  function createSingleFirework() {
    const fireworkDiv = document.createElement("div");
    fireworkDiv.className = "firework";

    const colorSet =
      fireworkColorSets[Math.floor(Math.random() * fireworkColorSets.length)];

    // Set CSS variables for colors
    fireworkDiv.style.setProperty("--color1", colorSet.c1);
    fireworkDiv.style.setProperty("--color2", colorSet.c2);
    fireworkDiv.style.setProperty("--color3", colorSet.c3);
    fireworkDiv.style.setProperty("--color4", colorSet.c4);
    fireworkDiv.style.setProperty("--color5", colorSet.c5);
    fireworkDiv.style.setProperty("--color6", colorSet.c6);

    // Randomize initial launch position (from bottom of screen)
    const launchX = Math.random() * screenWidth; // Launch from any X position
    const launchY = screenHeight + 50; // Start 50px below the viewport bottom

    // Randomize target burst position (within the screen, centered somewhat)
    const burstTargetX = Math.random() * screenWidth;
    const burstTargetY = screenHeight * (0.2 + Math.random() * 0.6); // Burst between 20% and 80% of screen height

    // Calculate the CSS variables for the animation
    fireworkDiv.style.left = `${launchX}px`; // Physical starting X for the element
    fireworkDiv.style.top = `${launchY}px`; // Physical starting Y for the element

    fireworkDiv.style.setProperty("--initialY", `-${launchY - burstTargetY}px`); // Distance up from launch point to burst point
    fireworkDiv.style.setProperty("--y", `-${launchY - burstTargetY}px`); // Same as above for translateY in animation
    fireworkDiv.style.setProperty("--x", `${burstTargetX - launchX}px`); // Horizontal shift to burst point

    // Random animation delay for staggered appearance
    fireworkDiv.style.animationDelay = `${Math.random() * 1.5}s`; // Staggered entry
    fireworkDiv.style.animationDuration = `${2 + Math.random() * 0.5}s`; // Slightly varied duration

    fireworkOverlay.appendChild(fireworkDiv);

    // Remove firework after its animation cycle
    setTimeout(() => {
      fireworkDiv.remove();
    }, 2500); // Max duration of firework animation + buffer
  }

  const numberOfFireworks = 7; // You can adjust this number
  let fireworksCreated = 0;

  const fireworkInterval = setInterval(() => {
    createSingleFirework();
    fireworksCreated++;
    if (fireworksCreated >= numberOfFireworks) {
      clearInterval(fireworkInterval);
    }
  }, 300); // Create a new firework every 300ms

  // 4. Fade out the message and then the entire overlay
  // The message has its own fadeOutMessage animation (2s duration, 1s delay)
  // So, the total time for the message to fade is 3s.
  // The overlay should disappear after all fireworks and the message are gone.
  setTimeout(() => {
    fireworkOverlay.classList.remove("active"); // Start fading out the overlay
    setTimeout(() => {
      fireworkOverlay.innerHTML = ""; // Clean up after fade out
    }, 500); // Allow time for CSS transition
  }, 4000); // Total time to display fireworks and message before fading out (adjust as needed)
}

// --- Drag and Drop Functionality ---
const addBtnDropTarget = document.getElementById("addBtnDropTarget");
const draggableCards = document.querySelectorAll(".draggable-card");
let draggedItem = null;

// Add dragstart listener to each draggable card
draggableCards.forEach((card) => {
  card.addEventListener("dragstart", (e) => {
    draggedItem = card;
    e.dataTransfer.setData("text/plain", card.dataset.task); // Store the task text
    // Add a class for styling the dragged item if needed
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    draggedItem = null;
    card.classList.remove("dragging");
  });
});

// Add dragover listener to the add button (drop target)
addBtnDropTarget.addEventListener("dragover", (e) => {
  e.preventDefault(); // Prevent default to allow drop
  addBtnDropTarget.classList.add("drag-over"); // Add visual feedback
});

// Add dragleave listener to the add button
addBtnDropTarget.addEventListener("dragleave", () => {
  addBtnDropTarget.classList.remove("drag-over"); // Remove visual feedback
});

// Add drop listener to the add button
addBtnDropTarget.addEventListener("drop", (e) => {
  e.preventDefault(); // Prevent default browser drop behavior
  addBtnDropTarget.classList.remove("drag-over"); // Remove visual feedback

  const taskText = e.dataTransfer.getData("text/plain");
  if (taskText) {
    newElement(taskText); // Use newElement to add the task
    // Optionally remove the dragged card from the DOM
    if (draggedItem) {
      draggedItem.remove();
      // You might want to save/load draggable cards if they're persistent
    }
  }
});