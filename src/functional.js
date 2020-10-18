import { remote, ipcRenderer } from 'electron';

const addWindow = document.querySelector('.icon-plus');
const closeWindow = document.querySelector('.icon-cross');
//const mainBlock = document.querySelector('.main-block');
const leftMenu = document.querySelector('.left-menu');
const mainBlockInputField = document.querySelector('.main-block_input-field');
const workZone = document.querySelector('.work-zone');


document.onmouseover = function(e) {
    leftMenu.classList.remove("left-menu");
    leftMenu.classList.add("left-menu-on");
  };
  document.onmouseout = function(e) {
    leftMenu.classList.remove("left-menu-on");
    leftMenu.classList.add("left-menu");
  };

  addWindow.onclick = creatingNewWindow;

  function creatingNewWindow() {
      ipcRenderer.send('open');
  }

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
addForm.append(formInput);
  
