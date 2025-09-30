const input = document.getElementById('input_to_list');
const parentElement = document.getElementById('task_list');

// Добавление задачи по Enter
input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    toDoList();
  }
});

// Загрузка сохранённых задач
window.addEventListener('DOMContentLoaded', () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => renderTask(task.text, task.completed));
});

// Добавление новой задачи
function toDoList() {
  const taskText = input.value.trim();
  if (taskText === '') return;
  renderTask(taskText, false);
  saveTask(taskText, false);
  input.value = '';
}

// Отображение задачи
function renderTask(text, completed) {
  const taskContainer = document.createElement('div');
  taskContainer.classList.add('task-container');

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('task-buttons');

  const rightSide = document.createElement('div');
  rightSide.classList.add('task-right');

  const newDiv = document.createElement('p');
  newDiv.textContent = text;
  newDiv.classList.add('task-text');
  if (completed) newDiv.classList.add('completed');

  const statusButton = document.createElement('button');
  statusButton.classList.add('task-status');
  updateStatusButton(statusButton, completed);
  statusButton.addEventListener('click', function () {
    const isCompleted = newDiv.classList.toggle('completed');
    updateStatusButton(statusButton, isCompleted);
    updateStorage();
  });

  const editButton = document.createElement('button');
  editButton.textContent = 'Редактировать';
  editButton.classList.add('task-edit');
  editButton.addEventListener('click', function () {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = newDiv.textContent;
    editInput.classList.add('task-edit-input');

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';
    saveButton.classList.add('task-save');
    saveButton.addEventListener('click', function () {
      newDiv.textContent = editInput.value;
      rightSide.replaceChild(newDiv, editInput);
      buttonContainer.replaceChild(editButton, saveButton);
      updateStorage();
    });

    rightSide.replaceChild(editInput, newDiv);
    buttonContainer.replaceChild(saveButton, editButton);
    editInput.focus(); // автофокус
  });

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Удалить';
  removeButton.classList.add('task-remove');
  removeButton.addEventListener('click', function () {
    taskContainer.remove();
    updateStorage();
  });

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(removeButton);
  rightSide.appendChild(newDiv);
  rightSide.appendChild(statusButton);
  taskContainer.appendChild(buttonContainer);
  taskContainer.appendChild(rightSide);
  parentElement.appendChild(taskContainer);
}

// Обновление кнопки статуса
function updateStatusButton(button, completed) {
  button.innerHTML = completed
  ? '<span class="icon-box icon-round icon-check"></span>'
  : '<span class="icon-box icon-round icon-cross"></span>';
  button.classList.toggle('completed', completed);
}

// Сохранение задачи
function saveTask(text, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text, completed });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Обновление хранилища
function updateStorage() {
  const tasks = [];
  document.querySelectorAll('.task-container').forEach(container => {
    const text = container.querySelector('.task-text')?.textContent || '';
    const completed = container.querySelector('.task-text')?.classList.contains('completed') || false;
    tasks.push({ text, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Сортировка: Все
document.querySelector('.sort-all').addEventListener('click', () => {
  document.querySelectorAll('.task-container').forEach(el => el.style.display = 'flex');
});

// Сортировка: Выполнено
document.querySelector('.sort-completed').addEventListener('click', () => {
  document.querySelectorAll('.task-container').forEach(el => {
    const isDone = el.querySelector('.task-text').classList.contains('completed');
    el.style.display = isDone ? 'flex' : 'none';
  });
});

// Сортировка: Осталось
document.querySelector('.sort-pending').addEventListener('click', () => {
  document.querySelectorAll('.task-container').forEach(el => {
    const isDone = el.querySelector('.task-text').classList.contains('completed');
    el.style.display = !isDone ? 'flex' : 'none';
  });
});
