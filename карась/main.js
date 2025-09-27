document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();
  if (taskText === '') return;

  createTaskElement(taskText, false);
  input.value = '';
  saveTasks();
}

function createTaskElement(text, completed) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.onchange = function () {
    li.classList.toggle('underlined', this.checked);
    saveTasks();
  };

  const span = document.createElement('span');
  span.textContent = ' ' + text;
  span.contentEditable = true;
  span.onblur = saveTasks;

  li.appendChild(checkbox);
  li.appendChild(span);
  document.getElementById('taskList').appendChild(li);

  if (completed) li.classList.add('underlined');
}

function removeLastTask() {
  const list = document.getElementById('taskList');
  if (list.lastChild) {
    list.removeChild(list.lastChild);
    saveTasks();
  }
}

function clearAllTasks() {
  document.getElementById('taskList').innerHTML = '';
  saveTasks();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    const text = li.querySelector('span').textContent.trim();
    const completed = li.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    const tasks = JSON.parse(saved);
    tasks.forEach(task => createTaskElement(task.text, task.completed));
  }
}

document.getElementById('taskInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      addTask();
    }
  });
  