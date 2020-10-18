import { remote, ipcRenderer } from 'electron';

let tasks = [];
const addWindow = document.querySelector('.icon-plus');
const closeWindow = document.querySelector('.icon-cross');
const leftMenu = document.querySelector('.left-menu');
const mainBlockInputField = document.querySelector('.main-block_input-field');
//const workZone = document.querySelector('.work-zone');
const todoList = document.querySelector('.todo-list');

//--- появление / исчезновение левого меню ---
document.onmouseover = function(e) {
    leftMenu.classList.remove("left-menu");
    leftMenu.classList.add("left-menu-on");
  };
  document.onmouseout = function(e) {
    leftMenu.classList.remove("left-menu-on");
    leftMenu.classList.add("left-menu");
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
        text: formInput.value,
    }

    tasks.push(task);
}

function createTasksBlock(task, index) {
    const newTask = document.createElement('li');
    newTask.classList.add('newtTask');
    const taskText = document.createElement('span');
    taskText.classList.add('taskText');
    const doneTask = document.createElement('button');
    doneTask.classList.add('doneTask');
    //doneTask.onclick = 

    const deleteTask = document.createElement('button');
    deleteTask.classList.add('deleteTask');
    deleteTask.onclick = function() {
		tasks.splice(index, 1);
		renderApp();
	}

    taskText.textContent = task.text;
    newTask.append(taskText, doneTask, deleteTask);

    return newTask;
}
  
function renderApp() {
	ul.innerHTML = '';

	for (let i = 0; i < tasks.length; i++) {
		let block = createPetsBlock(tasks[i], i);
		ul.append(block);
	}
}