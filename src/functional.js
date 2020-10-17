const addWindow = document.querySelector('.icon-plus');

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


// addWindow.onclick = createNewWindow;
   
    

// function createNewWindow () {
//     //   let newWindow = window.open('', 'modal');
//     // newWindow.loadURL(`file://${__dirname}/index.html`);
//     //alert('хуйло')
//     //window.open(`file://${__dirname}/index.html`, '_blank', 'nodeIntegration=no')
//  const win = new BrowserWindow({ width: 800, height: 600 })
//  win.loadURL(`file://${__dirname}/app/index.html`)
// }



