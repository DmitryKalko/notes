//const addWindow = document.querySelector('.left-menu_add-window');

const mainBlock = document.querySelector('.main-block');
const leftMenu = document.querySelector('.left-menu');


document.onmouseover = function(e) {
    leftMenu.style.display='flex';

  };
  document.onmouseout = function(e) {
    leftMenu.style.display='none';
  };


//   let newWindow;
//   addWindow.onclick = function createWindow(){
//         newWindow = new BrowserWindow({
//       width: 300,
//       height: 400,
//       minWidth: 300,
//       minHeight: 400,
//       frame: false, 
//     });
//   };
  
// newWindow.loadURL(`file://${__dirname}/index.html`);