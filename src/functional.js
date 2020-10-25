import { remote, ipcRenderer } from 'electron';

let tasks = [];
let activeTask;
let uniqId = 1;
const addWindow = document.querySelector('.icon-plus');
const closeWindow = document.querySelector('.icon-cross');
const leftMenu = document.querySelector('.left-menu');
const red = document.querySelector('.red');
const yellow = document.querySelector('.yellow');
const green = document.querySelector('.green');
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
    //сюда вставить sweet alert с вопросом
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
    console.log(activeTask);
}

//--- ВНЕШНИЙ ВИД И ФУНКЦИОНАЛ ЗАДАЧИ ---
function createTasksBlock(task) {
    const newTask = document.createElement('li');
    newTask.classList.add('newTask');
    newTask.id = task.id.toString();
    const taskText = document.createElement('span');
    taskText.classList.add('taskText');
    const icons = document.createElement('div');
    icons.classList.add('icons');
    const doneTask = document.createElement('button');
    doneTask.classList.add('icon-checkmark');


    //--- отметить задачу как выполненную ---
    doneTask.onclick = (e) => {
        e.stopPropagation();
        makeTaskDone(task);
    }

    //--- активная задача / выделение задачи цветом ---
    newTask.onclick = () => {
        highlightingTask(task);
    }

    checkColorStatuses(task);
    function checkColorStatuses(task) {
        if (task.redStatus === true) {
            console.log(task.redStatus)
            console.log(task)
            newTask.classList.add('make-red');
        } else if(task.yellowStatus === true) {
            newTask.classList.add('make-yellow');
        } else if(task.greenStatus === true) {
            newTask.classList.add('make-green');
        } else {
            newTask.classList.remove('make-red');
            newTask.classList.remove('make-yellow');
            newTask.classList.remove('make-green');
        }
    }

    checkDoneStatus(task);
    function checkDoneStatus(task) {
        if(task.doneStatus === true) {
            taskText.classList.add('text-done');
            newTask.classList.add('task-done');
        } else {
            taskText.classList.remove('text-done');
            newTask.classList.remove('task-done');
        }
    }


    //--- удаление задачи ---
    const deleteTask = document.createElement('button');
    deleteTask.classList.add('icon-bin');
    deleteTask.onclick = (e) => {
        e.stopPropagation();
        deleteOneTask(task)
    };


    taskText.textContent = task.text;
    icons.append(doneTask, deleteTask)
    newTask.append(taskText, icons);
    return newTask;
}

//--- перерисовка списка задач ---
function renderApp() {
    todoList.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        let tasksList = createTasksBlock(tasks[i]);
        todoList.append(tasksList);
        console.log('Render отработал')
    }
}

function makeTaskDone(task) {
  if (task.doneStatus === false) {
    task.doneStatus = true;
    //doneTasks.push(task);
    console.log('done');
    console.log(tasks);
  } 
  else {
    task.doneStatus = false;
    console.log('not done');
    console.log(tasks);
  }
  renderApp();
}




function highlightingTask(task) {   // ДОРАБОТАТЬ!
    activeTask = task.id;

    console.log(activeTask);
    let newTask = document.getElementById(activeTask.toString());
    newTask.classList.toggle('active');
    console.log(newTask);

    red.onclick = () => {
        if (task.redStatus === false) {
            makeTaskRed();
            renderApp();
        } else {
            makeTaskDafault();
            renderApp();
        }
    }

    function makeTaskRed() {
        tasks = tasks.map(task => {
            if (task.id === activeTask) {
                task.redStatus = true;
                task.yellowStatus = false;
                task.greenStatus = false;
                activeTask = null;
                return task;
            } else {
                return task;
            }
        })
        console.log(tasks)
    }

    yellow.onclick = () => {
        if (task.yellowStatus === false) {
            makeTaskYellow();
            renderApp();
        } else {
            makeTaskDafault();
            renderApp();
        }
    }
    function makeTaskYellow() {
        tasks = tasks.map(task => {
            if (task.id === activeTask) {
                task.yellowStatus = true;
                task.redStatus = false;
                task.greenStatus = false;
                activeTask = null;
                return task;
            } else {
                return task;
            }
        })
        console.log(tasks)
    }
    green.onclick = () => {
        if (task.greenStatus === false) {
            makeTaskGreen();
            renderApp();
        } else {
            makeTaskDafault();
            renderApp();
        }
    }
    function makeTaskGreen() {
        tasks = tasks.map(task => {
            if (task.id === activeTask) {
                task.greenStatus = true;
                task.redStatus = false;
                task.yellowStatus = false;
                activeTask = null;
                return task;
            } else {
                return task;
            }
        })
        console.log(tasks)
    }

    function makeTaskDafault() {
        tasks = tasks.map(task => {
            if (task.id === activeTask) {
                task.redStatus = false;
                task.yellowStatus = false;
                task.greenStatus = false;
                activeTask = null;
                return task;
            } else {
                return task;
            }
        })
        console.log(tasks)
    }
}






function deleteOneTask(task) {
    let id = task.id;
    // сюда вставить sweet alert с вопросом
    tasks = tasks.filter(task => task.id !== id);
    renderApp();
}