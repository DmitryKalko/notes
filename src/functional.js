import { remote, ipcRenderer } from 'electron';

let tasks = [];
let activeTask;
let uniqId = 1;
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
};
document.onmouseout = mouseOut;
function mouseOut(e) {
    leftMenu.classList.remove('left-menu-on');
    leftMenu.classList.add('left-menu');
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
    //TODO: сюда вставить sweet alert с вопросом
    remote.getCurrentWindow().close();
}

//--- разметка формы добавления задач ---
const addForm = document.createElement('form');
addForm.classList.add('addForm');
mainBlockInputField.append(addForm);
const formInput = document.createElement('input');
formInput.classList.add('formInput');
formInput.setAttribute('placeholder', 'добавить задачу');
formInput.setAttribute('type', 'text');
formInput.setAttribute('value', '');
formInput.value = '';
addForm.append(formInput);


addForm.onsubmit = submitForm;
function submitForm(e) {
    e.preventDefault();

    let task = {
        id: null,
        text: formInput.value,
        doneStatus: false,
        redStatus: false,
        yellowStatus: false,
        greenStatus: false,
    }
    task.id = uniqId
    uniqId++;
    tasks.push(task);
    addForm.reset();
    renderApp();
    console.log(tasks);
}

//--- ВНЕШНИЙ ВИД И ФУНКЦИОНАЛ ЗАДАЧИ ---
function createTasksBlock(task) {
    const newTask = document.createElement('li');
    newTask.classList.add('newTask');
    const taskText = document.createElement('span');
    taskText.classList.add('taskText');
    const icons = document.createElement('div');
    icons.classList.add('icons');
    const doneTask = document.createElement('button');
    doneTask.classList.add('icon-checkmark');


    //--- отметить задачу как выполненную ---
    doneTask.onclick = function (e) {
        e.stopPropagation();
        let id = task.id;
        if (task.doneStatus === false) {
            task.doneStatus = true;

            taskText.classList.add('text-done');
            newTask.classList.add('task-done');
            doneTask.classList.add('done-icon');

            console.log('done');
            console.log(tasks);
        }
        else {
            task.doneStatus = false;

            taskText.classList.remove('text-done');
            newTask.classList.remove('task-done');
            doneTask.classList.remove('done-icon');

            console.log('not done');
            console.log(tasks);
        }
        renderApp();
    }

    //--- активная задача / выделение задачи цветом ---
    newTask.onclick = () => makeTaskActive(task.id, newTask);

    //--- удаление задачи ---
    const deleteTask = document.createElement('button');
    deleteTask.classList.add('icon-bin');
    deleteTask.onclick = () => deleteOneTask(task);


    taskText.textContent = task.text;
    icons.append(doneTask, deleteTask)
    newTask.append(taskText, icons);
    return newTask;
}

//--- перерисовка списка задач ---  
function renderApp() {
    //tasks.map(task => task.id++)
    todoList.innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        let tasksBlock = createTasksBlock(tasks[i], i);
        todoList.append(tasksBlock);
    }
}

function makeTaskActive(id, newTask) {
    activeTask = id;
    newTask.style.background = 'green';
    console.log(activeTask);


}

function deleteOneTask(task) {
    let id = task.id;
    tasks = tasks.filter(task => task.id !== id);
    renderApp();
}

