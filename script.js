// Toggle light/dark theme
const themeBtn = document.getElementById("themeToggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

// Create a new task
function newElement() {
  const li = document.createElement("li");
  const inputValue = document.getElementById("myInput").value;
  const text = document.createTextNode(inputValue);

  if (inputValue === '') {
    alert("Please enter a task!");
    return;
  }

  li.appendChild(text);
  document.getElementById("myUL").appendChild(li);
  document.getElementById("myInput").value = "";

  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  span.onclick = function () {
    const div = this.parentElement;
    div.remove();
  }
}

// Mark task as completed
const list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

