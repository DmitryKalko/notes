import { remote, ipcRenderer } from 'electron';

let tasks = [];
const addWindow = document.querySelector('.icon-plus');
const closeWindow = document.querySelector('.icon-cross');
const leftMenu = document.querySelector('.left-menu');
const mainBlockInputField = document.querySelector('.main-block_input-field');
const todoList = document.querySelector('.todo-list');


//--- появление / исчезновение левого меню ---
document.onmouseover = onmouseOver;
function onmouseOver(e) {
    leftMenu.classList.remove('left-menu');
    leftMenu.classList.add('left-menu-on');
    newTask.classList.remove('full-space');
  };
document.onmouseout = mouseOut;
function mouseOut(e) {
    leftMenu.classList.remove('left-menu-on');
    leftMenu.classList.add('left-menu');
    newTask.classList.add('full-space');
  };


//--- открытие нового окна ---
  addWindow.onclick = creatingNewWindow;
  function creatingNewWindow() {
      ipcRenderer.send('open');
  }

//--- закрытие окна ---
closeWindow.onclick = closingWindow;
function closingWindow() {
    alert('Вы уверены, что хотите закрыть это окно?');
    //сюда вставить sweet alert с вопросом
    remote.getCurrentWindow().close();
}

//--- разметка формы добавления задач ---
const addForm = document.createElement('form');
addForm.classList.add('addForm');
mainBlockInputField.append(addForm);
const formInput = document.createElement('input');
formInput.classList.add('formInput');
formInput.setAttribute('placeholder','добавить задачу');
formInput.setAttribute('type','text');
formInput.setAttribute('value','');
formInput.value = '';
addForm.append(formInput);


addForm.onsubmit = submitForm;
function submitForm(e) {
    e.preventDefault();

    let task = {
        id: 0,
        text: formInput.value,
        doneStatus: false,
        redStatus: false,
        yellowStatus: false,
        greenStatus: false,
    }

    tasks.push(task);
    addForm.reset();
	renderApp();
}

//--- внешний вид и функционал задачи ---
function createTasksBlock(task, index) {
    const newTask = document.createElement('li');
    newTask.classList.add('newTask');
    const taskText = document.createElement('span');
    taskText.classList.add('taskText');
    const icons = document.createElement('div');
    icons.classList.add('icons');
    const doneTask = document.createElement('button');
    doneTask.classList.add('icon-checkmark');

    //doneTask.onclick = 

    const deleteTask = document.createElement('button');
    deleteTask.classList.add('icon-bin');

    deleteTask.onclick = function() {
		tasks.splice(index, 1);
		renderApp();
    }

    taskText.textContent = task.text;
    icons.append(doneTask, deleteTask)
    newTask.append(taskText, icons);

    return newTask;
}

//--- перерисовка списка задач ---  
function renderApp() {
	todoList.innerHTML = '';

	for (let i = 0; i < tasks.length; i++) {
		let tasksBlock = createTasksBlock(tasks[i], i);
		todoList.append(tasksBlock);
    }
}


