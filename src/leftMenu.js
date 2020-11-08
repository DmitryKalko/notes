const settingsButton = document.querySelector('.icon-cog');
const settingsMenu = document.querySelector('.settings-menu');
const leftMenu = document.querySelector('.left-menu');
const businesThemeIcon = document.querySelector('.icon-briefcase');
const nightThemeIcon = document.querySelector('.icon-moon-fill');
const fireThemeIcon = document.querySelector('.icon-fire');
const waterThemeIcon = document.querySelector('.icon-droplet');
const mainBlock = document.querySelector('.main-block');

//--- появление / исчезновение левого меню ---
document.onmouseenter = onmouseOver;
function onmouseOver(e) {
    leftMenu.classList.remove('left-menu');
    leftMenu.classList.add('left-menu-on');
};

document.onmouseleave = mouseOut;
function mouseOut(e) {
    leftMenu.classList.remove('left-menu-on');
    leftMenu.classList.add('left-menu');
    settingsMenuStatus = false;
    settingsButton.classList.add('icon-cog-close');
    settingsButton.classList.remove('icon-cog-open');
    settingsMenu.classList.add('settings-menu-close');
    settingsMenu.classList.remove('settings-menu-open');
};

let settingsMenuStatus = false;

settingsButton.onclick = () => {
    settings();
}
function settings() {
    if (settingsMenuStatus === false) {
        settingsMenuStatus = true;
        settingsButton.classList.add('icon-cog-open');
        settingsButton.classList.remove('icon-cog-close');
        settingsMenu.classList.add('settings-menu-open');
        settingsMenu.classList.remove('settings-menu-close');
    } else {
        settingsMenuStatus = false;
        settingsButton.classList.add('icon-cog-close');
        settingsButton.classList.remove('icon-cog-open');
        settingsMenu.classList.add('settings-menu-close');
        settingsMenu.classList.remove('settings-menu-open');
    }
}

let currentTheme = JSON.parse(window.localStorage.getItem('currentTheme')) || 'busines';
changeTheme();

businesThemeIcon.onclick = () => {
    currentTheme = 'busines';
    window.localStorage.setItem('currentTheme', JSON.stringify(currentTheme));
    changeTheme();
}
nightThemeIcon.onclick = () => {
    currentTheme = 'night';
    window.localStorage.setItem('currentTheme', JSON.stringify(currentTheme));
    changeTheme();
}
fireThemeIcon.onclick = () => {
    currentTheme = 'fire';
    window.localStorage.setItem('currentTheme', JSON.stringify(currentTheme));
    changeTheme();
}
waterThemeIcon.onclick = () => {
    currentTheme = 'water';
    window.localStorage.setItem('currentTheme', JSON.stringify(currentTheme));
    changeTheme();
}

function changeTheme() {
    console.log(localStorage);

    if (currentTheme === 'busines') {
        setBusinesTheme();
    } else if (currentTheme === 'night') {
        setNightTheme();
    } else if (currentTheme === 'fire') {
        setFireTheme();
    } else if (currentTheme === 'water') {
        setWaterTheme();
    }
}

function setBusinesTheme() {
    //removeStars();
    mainBlock.classList.add('busines');
    leftMenu.classList.add('busines');
    mainBlock.classList.remove('night');
    leftMenu.classList.remove('night');
    mainBlock.classList.remove('fire');
    leftMenu.classList.remove('fire');
    mainBlock.classList.remove('water');
    leftMenu.classList.remove('water');
    businesThemeIcon.classList.add('briefcase-active');
    nightThemeIcon.classList.remove('moon-active');
    fireThemeIcon.classList.remove('fire-active');
    waterThemeIcon.classList.remove('water-active');
    console.log('busines');
}
function setNightTheme() {
    mainBlock.classList.add('night');
    leftMenu.classList.add('night');
    mainBlock.classList.remove('fire');
    leftMenu.classList.remove('fire');
    mainBlock.classList.remove('busines');
    leftMenu.classList.remove('busines');
    mainBlock.classList.remove('water');
    leftMenu.classList.remove('water');
    //stars();
    nightThemeIcon.classList.add('moon-active');
    businesThemeIcon.classList.remove('briefcase-active');
    fireThemeIcon.classList.remove('fire-active');
    waterThemeIcon.classList.remove('water-active');
    console.log('night');
}
function setFireTheme() {
    mainBlock.classList.add('fire');
    leftMenu.classList.add('fire');
    mainBlock.classList.remove('busines');
    leftMenu.classList.remove('busines');
    mainBlock.classList.remove('night');
    leftMenu.classList.remove('night');
    mainBlock.classList.remove('water');
    leftMenu.classList.remove('water');
    fireThemeIcon.classList.add('fire-active');
    businesThemeIcon.classList.remove('briefcase-active');
    nightThemeIcon.classList.remove('moon-active');
    waterThemeIcon.classList.remove('water-active');
    console.log('fire');
}
function setWaterTheme() {
    mainBlock.classList.add('water');
    leftMenu.classList.add('water');
    mainBlock.classList.remove('busines');
    leftMenu.classList.remove('busines');
    mainBlock.classList.remove('night');
    leftMenu.classList.remove('night');
    mainBlock.classList.remove('fire');
    leftMenu.classList.remove('fire');
    waterThemeIcon.classList.add('water-active');
    businesThemeIcon.classList.remove('briefcase-active');
    nightThemeIcon.classList.remove('moon-active');
    fireThemeIcon.classList.remove('fire-active');
    console.log('water');
}

// function stars() {
//     let count = 300;
//     let i = 0;
//     while(i < count) {
//         let star = document.createElement('i');
//         let x = Math.floor(Math.random() * window.innerWidth);
//         let y = Math.floor(Math.random() * window.innerHeight);
//         let size = Math.random() * 2;

//         star.style.left = x + 'px';
//         star.style.top = y + 'px';
//         star.style.width = 1 + size + 'px';
//         star.style.height = 1 + size + 'px';

//         mainBlock.append(star);
//         i++;

//     }
// }
// function removeStars() { 
//     let stars = document.getElementsByTagName('i');
    
//     while (stars.length > 0) {
//         stars[0].parentNode.removeChild(stars[0]);
//     }
// }