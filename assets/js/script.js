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
  localStorage.setItem("theme", mode);
}

lightBtn.addEventListener("click", () => setTheme("light"));
darkBtn.addEventListener("click", () => setTheme("dark"));

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || savedTheme === "light") {
  setTheme(savedTheme);
} else {
  setTheme("light");
}

function newElement(taskText = null) {
  const input = document.getElementById("myInput");
  const inputValue = input.value.trim();

  if (!taskText && inputValue === "") {
    showEmptyTaskMessage();
    return;
  }

  const taskContent = taskText || inputValue;
  const formattedValue =
    taskContent.charAt(0).toUpperCase() + taskContent.slice(1).toLowerCase();

  // Prevent duplicate tasks
  const tasks = Array.from(document.querySelectorAll("#myUL .task-text")).map(
    (el) => el.textContent.trim()
  );
  if (tasks.includes(formattedValue)) {
    return; // Task already exists, do not add again
  }

  addTaskToDOM(formattedValue);
  if (!taskText) {
    input.value = "";
  }
  saveTasks();

  // Hide the card if it was added via drag-and-drop
  if (taskText) {
    const card = Array.from(document.querySelectorAll(".draggable-card")).find(
      (el) => el.dataset.task === taskText
    );
    if (card) card.style.display = "none";
  }
}

function showEmptyTaskMessage() {
  const messageContainer = document.getElementById("emptyTaskMessage");
  messageContainer.textContent =
    "Empty tasks are like invisible unicorns... magical, but they won't get anything done! Please add some words!";
  messageContainer.classList.add("active");

  setTimeout(() => {
    messageContainer.classList.remove("active");
  }, 3000);
}

document.getElementById("myInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    newElement();
  }
});

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
        showConfettiMessage();
      }, 700);
    } else {
      taskItem.remove();
      saveTasks();
    }
  };

  li.appendChild(span);
  document.getElementById("myUL").appendChild(li);
}

document.getElementById("myUL").addEventListener("click", function (e) {
  const listItem = e.target.closest("li");
  if (listItem && !e.target.classList.contains("close")) {
    listItem.classList.toggle("checked");
    saveTasks();
  }
});

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#myUL li").forEach((li) => {
    const text = li.querySelector(".task-text").textContent.trim();
    const checked = li.classList.contains("checked");
    tasks.push({ text, checked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    const tasks = JSON.parse(saved);
    tasks.forEach((task) => addTaskToDOM(task.text, task.checked));
  }
}

loadTasks();

function showFireworkMessage() {
  const messageContainer = document.getElementById("emptyTaskMessage");
  messageContainer.textContent =
    "Task completed! Great job! Keep up the momentum!";
  messageContainer.classList.add("active");

  setTimeout(() => {
    messageContainer.classList.remove("active");
  }, 3000);
}

const addBtnDropTarget = document.getElementById("addBtnDropTarget");
const draggableCards = document.querySelectorAll(".draggable-card");
let draggedItem = null;

draggableCards.forEach((card) => {
  card.addEventListener("dragstart", (e) => {
    draggedItem = card;
    e.dataTransfer.setData("text/plain", card.dataset.task);
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    draggedItem = null;
    card.classList.remove("dragging");
  });
});

addBtnDropTarget.addEventListener("dragover", (e) => {
  e.preventDefault();
  addBtnDropTarget.classList.add("drag-over");
});

addBtnDropTarget.addEventListener("dragleave", () => {
  addBtnDropTarget.classList.remove("drag-over");
});

addBtnDropTarget.addEventListener("drop", (e) => {
  e.preventDefault();
  addBtnDropTarget.classList.remove("drag-over");
  const taskText = e.dataTransfer.getData("text/plain");
  if (taskText) {
    newElement(taskText);
    addBtnDropTarget.classList.add("success");

    setTimeout(() => {
      addBtnDropTarget.classList.remove("success");
    }, 500);
  }
});

// Consolidated and corrected confetti functions
function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio, opts) {
    if (typeof confetti === "function") {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    } else {
      console.warn(
        "Confetti function not found. Ensure tsparticles.confetti.bundle.min.js is loaded."
      );
    }
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function showConfettiMessage() {
  const messageContainer = document.querySelector(".confetti-message");

  if (!messageContainer) {
    console.error("Confetti message container not found!");
    return;
  }

  messageContainer.textContent =
    "Task completed beauty! Great job! Keep up the momentum!";
  messageContainer.classList.add("active");

  setTimeout(() => {
    messageContainer.classList.remove("active");
  }, 3000);

  if (typeof triggerConfetti === "function") {
    triggerConfetti();
  }
}

const dragHeading = document.querySelector(".babel-effect");
if (dragHeading) {
  dragHeading.addEventListener("mouseenter", () => {
    gsap.to(".distort feDisplacementMap", {
      duration: 1,
      attr: { scale: 100 },
      ease: "circ.out",
    });
    gsap.to(".distort feTurbulence", {
      duration: 1,
      attr: { baseFrequency: "2.08 .08" },
      ease: "circ.out",
    });
  });
  dragHeading.addEventListener("mouseleave", () => {
    gsap.to(".distort feDisplacementMap", {
      duration: 1,
      attr: { scale: 0 },
      ease: "circ.out",
    });
    gsap.to(".distort feTurbulence", {
      duration: 1,
      attr: { baseFrequency: "2.01 .01" },
      ease: "circ.out",
    });
  });

  dragHeading.addEventListener("touchstart", () => {
    gsap.to(".distort feDisplacementMap", {
      duration: 1,
      attr: { scale: 100 },
      ease: "circ.out",
    });
    gsap.to(".distort feTurbulence", {
      duration: 1,
      attr: { baseFrequency: "2.08 .08" },
      ease: "circ.out",
    });
  });
  dragHeading.addEventListener("touchend", () => {
    gsap.to(".distort feDisplacementMap", {
      duration: 1,
      attr: { scale: 0 },
      ease: "circ.out",
    });
    gsap.to(".distort feTurbulence", {
      duration: 1,
      attr: { baseFrequency: "2.01 .01" },
      ease: "circ.out",
    });
  });
  dragHeading.addEventListener("touchcancel", () => {
    gsap.to(".distort feDisplacementMap", {
      duration: 1,
      attr: { scale: 0 },
      ease: "circ.out",
    });
    gsap.to(".distort feTurbulence", {
      duration: 1,
      attr: { baseFrequency: "2.01 .01" },
      ease: "circ.out",
    });
  });
}
