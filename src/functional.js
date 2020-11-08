import { remote } from 'electron';
import Swal from 'sweetalert2';


//достаем данные из хранилища
let tasks = JSON.parse(window.localStorage.getItem('tasks')) || [];

let activeTask;
let uniqId = JSON.parse(window.localStorage.getItem('uniqId')) || 1;
//const addWindow = document.querySelector('.icon-plus');
const closeWindow = document.querySelector('.icon-cross');
//const leftMenu = document.querySelector('.left-menu');
const red = document.querySelector('.red');
const yellow = document.querySelector('.yellow');
const green = document.querySelector('.green');
const mainBlockInputField = document.querySelector('.main-block_input-field');
const todoList = document.querySelector('.todo-list');
const title = document.querySelector('.main-block_title');
title.value = JSON.parse(window.localStorage.getItem('title')) || '';
renderApp();

//--- появление / исчезновение левого меню ---
// document.onmouseover = onmouseOver;
// function onmouseOver(e) {
//     leftMenu.classList.remove('left-menu');
//     leftMenu.classList.add('left-menu-on');
// };
// document.onmouseout = mouseOut;
// function mouseOut(e) {
//     leftMenu.classList.remove('left-menu-on');
//     leftMenu.classList.add('left-menu');
// };

//--- закрытие окна ---
closeWindow.onclick = closingWindow;
function closingWindow() {
    Swal.fire({
        title: 'Закрыть это окно?',
        showCancelButton: true,
        confirmButtonText: 'Закрыть',
        cancelButtonText: 'Нет',
        customClass: {
            popup: 'my-popup',
            header: 'my-header',
            title: 'my-title',
            confirmButton: 'my-confirm-button',
            cancelButton: 'my-cancel-button',
          }
    }).then((result) => {
        if (result.isConfirmed) {
            remote.getCurrentWindow().close();
            localStorage.removeItem('tasks');
            localStorage.removeItem('uniqId');
            localStorage.removeItem('title');
            localStorage.removeItem('coords');
        }
    })
}

// --- перетаскивание задачи ---
todoList.ondragover = allowDrop;
function allowDrop(e) {
    e.preventDefault();
    const draggingTask = todoList.querySelector(`.selected`);
    const currentTask = e.target;
    // Проверяем, что событие сработало:
    // 1. не на том элементе, который мы перемещаем,
    // 2. именно на элементе списка
    const isMoveable = draggingTask !== currentTask &&
        currentTask.classList.contains('newTask');
    // Если нет, прерываем выполнение функции
    if (!isMoveable) {
        return;
    }
    const nextTask = getNextElement(e.clientY, currentTask);
    //console.log(nextTask)
    // Проверяем, нужно ли менять элементы местами
    if (
        nextTask &&
        draggingTask === nextTask.previousElementSibling ||
        draggingTask === nextTask
    ) {
        // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
        return;
    }
    todoList.insertBefore(draggingTask, nextTask);
    //console.log(tasks)
};
let nextTaskindex;
const getNextElement = (cursorPosition, currentTask) => {
    // Получаем объект с размерами и координатами
    const currentTaskCoord = currentTask.getBoundingClientRect();
    // Находим вертикальную координату центра текущего элемента
    const currentTaskCenter = currentTaskCoord.y + currentTaskCoord.height / 2;
    // Если курсор выше центра элемента, возвращаем текущий элемент
    // В ином случае — следующий DOM-элемент
    const nextTask = (cursorPosition < currentTaskCenter) ?
        currentTask :
        currentTask.nextElementSibling;
    //console.log(nextTask);
    if (nextTask !== null) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id == nextTask.id) {
                nextTaskindex = tasks.indexOf(tasks[i]);
            }
        }
    }
    else {
        nextTaskindex = tasks.length + 1;
    }
    //console.log(nextTaskindex);
    return nextTask;
};

todoList.ondrop = drop;
function drop(e) {
    let draggingTaskIndex;
    const draggingTask = todoList.querySelector(`.selected`);
    //console.log(draggingTask.id);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == draggingTask.id) {
            draggingTaskIndex = tasks.indexOf(tasks[i]);
        }
    }
    let moovingTask = tasks[draggingTaskIndex];
    //console.log(moovingTask);
    //console.log(draggingTaskIndex);
    tasks.splice(draggingTaskIndex, 1);
    //console.log(tasks);
    tasks.splice(nextTaskindex - 1, 0, moovingTask)
   // console.log(tasks);
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
    renderApp();
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
        activeStatus: false,
    }

    task.id = uniqId
    uniqId++;
    window.localStorage.setItem('uniqId', JSON.stringify(uniqId));
    tasks.unshift(task);
    addForm.reset();
    tasks = tasks.map(task => {
        task.activeStatus = false;
        return task;
    })

    renderApp();
}

//--- ВНЕШНИЙ ВИД И ФУНКЦИОНАЛ ЗАДАЧИ ---
function createTasksBlock(task) {
    const newTask = document.createElement('li');
    newTask.classList.add('newTask');
    newTask.id = task.id.toString();
    newTask.setAttribute('draggable', 'true');
    const taskText = document.createElement('span');
    taskText.classList.add('taskText');
    const icons = document.createElement('div');
    icons.classList.add('icons');
    const doneTask = document.createElement('button');
    doneTask.classList.add('icon-checkmark');
    const deleteTask = document.createElement('button');
    deleteTask.classList.add('icon-bin');

    //--- отметить задачу как выполненную ---
    doneTask.onclick = (e) => {
        e.stopPropagation();
        makeTaskDone(task);
    }

    //--- активная задача / выделение задачи цветом ---
    newTask.onclick = () => {
        makeTaskActive(task);
        highlightingTask(task);
    }

    // --- проверка статуса активности ---     
    checkActiveStatus(task);
    function checkActiveStatus(task) {
        if (task.activeStatus === true) {
            newTask.classList.add('active');
        } else {
            newTask.classList.remove('active');
        }
    }

    // --- проверка цветовых статусов ---
    checkColorStatuses(task);
    function checkColorStatuses(task) {
        if (task.redStatus === true) {
            newTask.classList.add('make-red');
        } else if (task.yellowStatus === true) {
            newTask.classList.add('make-yellow');
        } else if (task.greenStatus === true) {
            newTask.classList.add('make-green');
        } else {
            newTask.classList.remove('make-red');
            newTask.classList.remove('make-yellow');
            newTask.classList.remove('make-green');
        }
    }

    // --- проверка статуса выполнения ---
    checkDoneStatus(task);
    function checkDoneStatus(task) {
        if (task.doneStatus === true) {
            taskText.classList.add('text-done');
            newTask.classList.add('task-done');
        } else {
            taskText.classList.remove('text-done');
            newTask.classList.remove('task-done');
        }
    }

    //--- удаление задачи ---
    deleteTask.onclick = (e) => {
        e.stopPropagation();
        deleteOneTask(task);
    };

    // --- редактирование задачи ---
    newTask.ondblclick = (e) => {
        e.stopPropagation();
        taskText.style.opacity = 0.1;
        editThisTask(task);
    }

    // --- перетаскивание задачи ---
    todoList.addEventListener('dragstart', (e) => {
        e.target.classList.add('selected');
        e.dataTransfer.setData('id', e.target.id);
    })

    todoList.addEventListener('dragend', (e) => {
        e.target.classList.remove('selected');
    });

    taskText.textContent = task.text;
    icons.append(doneTask, deleteTask)
    newTask.append(taskText, icons);
    return newTask;
}

//--- перерисовка списка задач ---
function renderApp() {
    // отправляем данные в хранилище
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
    window.localStorage.setItem('title', JSON.stringify(title.value));
    //console.log(localStorage)
    todoList.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        let tasksList = createTasksBlock(tasks[i]);
        todoList.append(tasksList);
    }
    activeTask = null;
}

function makeTaskDone(task) {
    if (task.doneStatus === false) {
        task.doneStatus = true;
    }
    else {
        task.doneStatus = false;
    }
    renderApp();
}

function makeTaskActive(task) {
    activeTask = task.id;

    if (task.activeStatus === false) {
        task.activeStatus = true;
        tasks = tasks.map(task => {
            if (task.id !== activeTask) {
                task.activeStatus = false;
                return task;
            }
            return task;
        })
    } else {
        task.activeStatus = false;
    }
    renderApp();
}

function highlightingTask(task) {

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
            if (task.activeStatus === true) {
                task.redStatus = true;
                task.yellowStatus = false;
                task.greenStatus = false;
                task.activeStatus = false;
                return task;
            } else {
                return task;
            }
        })
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
            if (task.activeStatus === true) {
                task.yellowStatus = true;
                task.redStatus = false;
                task.greenStatus = false;
                task.activeStatus = false;
                return task;
            } else {
                return task;
            }
        })
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
            if (task.activeStatus === true) {
                task.greenStatus = true;
                task.redStatus = false;
                task.yellowStatus = false;
                task.activeStatus = false;
                return task;
            } else {
                return task;
            }
        })
    }

    function makeTaskDafault() {
        tasks = tasks.map(task => {
            if (task.activeStatus === true) {
                task.redStatus = false;
                task.yellowStatus = false;
                task.greenStatus = false;
                task.activeStatus = false;
                return task;
            } else {
                return task;
            }
        })
    }
}

function deleteOneTask(task) {
    let id = task.id;
    Swal.fire({
        title: 'Удалить задачу?',
        showCancelButton: true,
        confirmButtonText: 'Удалить!',
        cancelButtonText: 'Нет',
        customClass: {
            popup: 'my-popup',
            header: 'my-header',
            title: 'my-title',
            confirmButton: 'my-confirm-button',
            cancelButton: 'my-cancel-button',
          }
    }).then((result) => {
        if (result.isConfirmed) {
            tasks = tasks.filter(task => task.id !== id);
            renderApp();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Задача удалена!',
                showConfirmButton: false,
                timer: 1200,
                customClass: {
                    popup: 'my-popup-result',
                    title: 'my-title',
                    header: 'my-header',
                  }
              })
        }
    })
}
function editThisTask(task) {
    formInput.value = task.text;
    let id = task.id;
    tasks = tasks.filter(task => task.id !== id);
    renderApp();
}