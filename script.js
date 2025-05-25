// Toggle light/dark theme
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
  });
}

// Create new task
function newElement() {
  const input = document.getElementById("myInput");
  const inputValue = input.value.trim();

  if (inputValue === "") {
    alert("Please enter a task!");
    return;
  }

  if (inputValue.length > 40) {
    alert("Task cannot be more than 40 characters!");
    return;
  }

  const li = document.createElement("li");
  li.textContent = inputValue;

  const closeBtn = document.createElement("span");
  closeBtn.className = "close";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = function () {
    this.parentElement.remove();
  };

  li.appendChild(closeBtn);
  document.getElementById("myUL").appendChild(li);
  input.value = "";
}

// Mark task as complete
document.getElementById("myUL").addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
  }
});

function newElement() {
  const li = document.createElement("li");
  const input = document.getElementById("myInput");
  const inputValue = input.value.trim();

  if (inputValue === "") {
    alert("Please enter a task!");
    return;
  }

  if (inputValue.length > 40) {
    alert("Task cannot be more than 40 characters!");
    return;
  }

  const text = document.createTextNode(inputValue);
  li.appendChild(text);
  document.getElementById("myUL").appendChild(li);
  input.value = "";

  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  span.onclick = function () {
    const div = this.parentElement;
    div.remove();
  };
}
