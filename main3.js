let input = document.getElementById('input_to_list');
let parentElement = document.getElementById('task_list');
input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    toDoList();
  }
});
window.addEventListener('DOMContentLoaded', () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => renderTask(task.text, task.completed));
});
function toDoList() {
  const taskText = input.value.trim();
  if (taskText === '') return;
  renderTask(taskText, false);
  saveTask(taskText, false);
  input.value = '';
}
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
function updateStatusButton(button, completed) {
  if (completed) {
    button.textContent = 'Выполнено';
    button.classList.add('completed');
  } else {
    button.textContent = 'Не выполнено';
    button.classList.remove('completed');
  }
}
function saveTask(text, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text, completed });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function updateStorage() {
  const tasks = [];
  document.querySelectorAll('.task-container').forEach(container => {
    const text = container.querySelector('.task-text')?.textContent || '';
    const completed = container.querySelector('.task-text')?.classList.contains('completed') || false;
    tasks.push({ text, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
