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
  const input = document.getElementById("myInput");
  const inputValue = input.value.trim();

  // Check if the input is empty and not triggered by drag-and-drop
  if (!taskText && inputValue === "") {
    showEmptyTaskMessage(); // Show the styled message
    return;
  }

  // Use the provided taskText or the input value
  const taskContent = taskText || inputValue;

  // Capitalize the first letter and make the rest lowercase
  const formattedValue =
    taskContent.charAt(0).toUpperCase() + taskContent.slice(1).toLowerCase();

  addTaskToDOM(formattedValue); // Add the task to the DOM
  if (!taskText) {
    input.value = ""; // Clear the input field
  }
  saveTasks(); // Save the updated task list
}

// Function to show the empty task message
function showEmptyTaskMessage() {
  const messageContainer = document.getElementById("emptyTaskMessage");
  messageContainer.textContent =
    "Empty tasks are like invisible unicorns... magical, but they won't get anything done! Please add some words!";
  messageContainer.classList.add("active");

  // Hide the message after 3 seconds
  setTimeout(() => {
    messageContainer.classList.remove("active");
  }, 3000);
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
  if (checked) li.classList.add("checked");

  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = text;
  li.appendChild(textSpan);

  const span = document.createElement("SPAN");
  span.className = "close";
  span.textContent = "\u00D7";

  span.onclick = function () {
    const taskItem = this.parentElement;
    const wasCompleted = taskItem.classList.contains("checked");

    if (wasCompleted) {
      taskItem.classList.add("removing");
      setTimeout(() => {
        taskItem.remove();
        saveTasks();
        showConfettiMessage(); // <-- This must be called here!
      }, 700); // Match your animation duration
    } else {
      taskItem.remove();
      saveTasks();
    }
  };

  li.appendChild(span);
  document.getElementById("myUL").appendChild(li);
}

// Mark a task as complete or incomplete by clicking on the list item itself
document.getElementById("myUL").addEventListener("click", function (e) {
  const listItem = e.target.closest("li");
  if (listItem && !e.target.classList.contains("close")) {
    listItem.classList.toggle("checked");
    saveTasks();
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

// Keep only the logic for the firework message
function showFireworkMessage() {
  const messageContainer = document.getElementById("emptyTaskMessage");
  messageContainer.textContent =
    "Task completed! Great job! Keep up the momentum!";
  messageContainer.classList.add("active");

  // Hide the message after 3 seconds
  setTimeout(() => {
    messageContainer.classList.remove("active");
  }, 3000);
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
  e.preventDefault(); // Allow dropping
  addBtnDropTarget.classList.add("drag-over"); // Add visual feedback for drag over
});

// Remove drag-over class when the drag leaves the button
addBtnDropTarget.addEventListener("dragleave", () => {
  addBtnDropTarget.classList.remove("drag-over"); // Remove visual feedback
});

// Add drop listener to the add button
addBtnDropTarget.addEventListener("drop", (e) => {
  e.preventDefault();
  addBtnDropTarget.classList.remove("drag-over"); // Remove drag-over class
  const taskText = e.dataTransfer.getData("text/plain"); // Get the dragged task text
  if (taskText) {
    newElement(taskText); // Add the dropped task
    addBtnDropTarget.classList.add("success"); // Add success feedback

    // Remove the success class after a short delay
    setTimeout(() => {
      addBtnDropTarget.classList.remove("success");
    }, 500);
  }
});

// Initialize tsParticles for the confetti effect
tsParticles.load("tsparticles", {
  fullScreen: {
    zIndex: 1, // Ensure it appears behind the confetti message
  },
  particles: {
    number: {
      value: 0,
    },
    color: {
      value: ["#00FFFC", "#FC00FF", "#fffc00"],
    },
    shape: {
      type: ["circle", "triangle"],
    },
    opacity: {
      value: { min: 0, max: 1 },
      animation: {
        enable: true,
        speed: 2,
        startValue: "max",
        destroy: "min",
      },
    },
    size: {
      value: { min: 2, max: 4 },
    },
    links: {
      enable: false,
    },
    life: {
      duration: {
        sync: true,
        value: 5,
      },
      count: 1,
    },
    move: {
      enable: true,
      gravity: {
        enable: true,
        acceleration: 10,
      },
      speed: { min: 10, max: 20 },
      decay: 0.1,
      direction: "none",
      straight: false,
      outModes: {
        default: "destroy",
        top: "none",
      },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      move: true,
      animation: {
        enable: true,
        speed: 60,
      },
    },
    tilt: {
      direction: "random",
      enable: true,
      move: true,
      value: { min: 0, max: 360 },
      animation: {
        enable: true,
        speed: 60,
      },
    },
    roll: {
      darken: {
        enable: true,
        value: 25,
      },
      enable: true,
      speed: { min: 15, max: 25 },
    },
    wobble: {
      distance: 30,
      enable: true,
      move: true,
      speed: { min: -15, max: 15 },
    },
  },
  emitters: {
    life: {
      count: 0,
      duration: 0.1,
      delay: 0.4,
    },
    rate: {
      delay: 0.1,
      quantity: 150,
    },
    size: {
      width: 0,
      height: 0,
    },
  },
});

// Function to trigger the confetti effect
function triggerConfetti() {
  tsParticles.load("tsparticles", {
    emitters: {
      life: {
        count: 1, // Emit confetti once
        duration: 0.1,
        delay: 0.4,
      },
      rate: {
        delay: 0.1,
        quantity: 150,
      },
      size: {
        width: 0,
        height: 0,
      },
    },
  });
}

// Function to show the confetti message and trigger the confetti effect
function showConfettiMessage() {
  const messageContainer = document.querySelector(".confetti-message");
  if (!messageContainer) return; // Prevent errors if not found

  messageContainer.textContent = "Task completed beauty! Great job! Keep up the momentum!";
  messageContainer.classList.add("active");

  // Hide the message after 3 seconds
  setTimeout(() => {
    messageContainer.classList.remove("active");
  }, 3000);

  // Optionally trigger confetti effect if you use tsParticles
  if (typeof triggerConfetti === "function") {
    triggerConfetti();
  }
}

// Make sure GSAP is loaded via CDN in your HTML: 
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

const dragHeading = document.querySelector(".babel-effect");
if (dragHeading) {
  // Mouse events
  dragHeading.addEventListener("mouseenter", () => {
    gsap.to(".distort feDisplacementMap", {
      duration: 1,
      attr: { scale: 100 },
      ease: "circ.out"
    });
    gsap.to(".distort feTurbulence", {
      duration: 1,
      attr: { baseFrequency: '2.08 .08' },
      ease: "circ.out"
    });
  });
  dragHeading.addEventListener("mouseleave", () => {
    gsap.to(".distort feDisplacementMap", {
      duration: 1,
      attr: { scale: 0 },
      ease: "circ.out"
    });
    gsap.to(".distort feTurbulence", {
      duration: 1,
      attr: { baseFrequency: '2.01 .01' },
      ease: "circ.out"
    });
  });

  // Touch events for mobile
  dragHeading.addEventListener("touchstart", () => {
    gsap.to(".distort feDisplacementMap", {
      duration: 1,
      attr: { scale: 100 },
      ease: "circ.out"
    });
    gsap.to(".distort feTurbulence", {
      duration: 1,
      attr: { baseFrequency: '2.08 .08' },
      ease: "circ.out"
    });
  });
  dragHeading.addEventListener("touchend", () => {
    gsap.to(".distort feDisplacementMap", {
      duration: 1,
      attr: { scale: 0 },
      ease: "circ.out"
    });
    gsap.to(".distort feTurbulence", {
      duration: 1,
      attr: { baseFrequency: '2.01 .01' },
      ease: "circ.out"
    });
  });
}