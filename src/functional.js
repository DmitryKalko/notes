import { remote, ipcRenderer } from 'electron';
import Swal from 'sweetalert2';

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
  Swal.fire({
    title: 'Точно закрыть это окно?',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Закрыть',
    cancelButtonText: 'Нет',
  }).then((result) => {
    if (result.isConfirmed) {
      remote.getCurrentWindow().close();
    }
  })
}

 // --- перетаскивание задачи ---
 todoList.ondragover = allowDrop;
 function allowDrop(e) {
   e.preventDefault();
 }
 todoList.ondrop = drop;
 function drop(e) {
   let taskId = e.dataTransfer.getData('id');
   console.log(taskId)
   e.target.append(document.getElementById(taskId))
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
  tasks.push(task);
  addForm.reset();
  tasks = tasks.map(task => {
    task.activeStatus = false;
    return task;
  })
    
  renderApp();
  console.log(tasks);
  console.log(activeTask);
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
    deleteOneTask(task)
  };
  // --- перетаскивание задачи ---
  newTask.ondragstart = drag;
  function drag(e) {
    e.dataTransfer.setData('id', task.id);
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
    let tasksList = createTasksBlock(tasks[i]);
    todoList.append(tasksList);
    console.log('Render отработал')
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
  console.log(activeTask)

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
  console.log(tasks);
  renderApp();
}

function highlightingTask(task) {   

  console.log(task)
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
    console.log(tasks)
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
    console.log(tasks)
  }
}

function deleteOneTask(task) {
  let id = task.id;
  Swal.fire({
    title: 'Точно удалить задачу?',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Удалить!',
    cancelButtonText: 'Нет',
  }).then((result) => {
    if (result.isConfirmed) {
      tasks = tasks.filter(task => task.id !== id);
      renderApp();
      Swal.fire(
        'Задача удалена!',
        '',
        'success'
      )
    }
  })
}

