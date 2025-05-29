// Toggle light/dark theme
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
  });
}

// Add new task
function newElement() {
  const input = document.getElementById("myInput");
  let inputValue = input.value.trim();

  if (inputValue === "") {
    alert("Please enter a task!");
    return;
  }

  if (inputValue.length > 40) {
    alert("Task cannot be more than 40 characters!");
    return;
  }

  // Capitalize first letter, rest lowercase
  inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();

  addTaskToDOM(inputValue);
  input.value = "";
  saveTasks();
}

// Add task when Enter is pressed
document.getElementById("myInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    newElement();
  }
});


// Helper: Create and insert task
function addTaskToDOM(text, checked = false) {
  const li = document.createElement("li");
  li.textContent = text;
  if (checked) li.classList.add("checked");

  const span = document.createElement("SPAN");
  span.className = "close";
  span.textContent = "\u00D7";
  span.onclick = function () {
    this.parentElement.remove();
    saveTasks();
  };

  li.appendChild(span);
  document.getElementById("myUL").appendChild(li);
}

// Mark as complete
document.getElementById("myUL").addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveTasks();
  }
});

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#myUL li").forEach((li) => {
    const text = li.firstChild.nodeValue.trim();
    const checked = li.classList.contains("checked");
    tasks.push({ text, checked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    const tasks = JSON.parse(saved);
    tasks.forEach(task => addTaskToDOM(task.text, task.checked));
  }
}

loadTasks();




  