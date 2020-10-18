//import { ipcRenderer } from 'electron';
const {ipcRenderer} = require('electron')

const addWindow = document.querySelector('.icon-plus');
const closeWindow = document.querySelector('.icon-cross');
const mainBlock = document.querySelector('.main-block');
const leftMenu = document.querySelector('.left-menu');


document.onmouseover = function(e) {
    leftMenu.style.display='flex';

  };
  document.onmouseout = function(e) {
    leftMenu.style.display='none';
  };

  addWindow.onclick = creatingNewWindow;

  function creatingNewWindow() {
      ipcRenderer.send('open');
  }

closeWindow.onclick = closingWindow;
function closingWindow() {
    alert('loser')
    ipcRenderer.send('close');
}

//const addForm = document.createElement('form')
  