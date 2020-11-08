const settingsButton = document.querySelector('.icon-cog');
const settingsMenu = document.querySelector('.settings-menu');
const leftMenu = document.querySelector('.left-menu');
const businesThemeIcon = document.querySelector('.icon-briefcase');
const nightThemeIcon = document.querySelector('.icon-moon-fill');
const fireThemeIcon = document.querySelector('.icon-fire');
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

function changeTheme() {
    console.log(localStorage);

    if (currentTheme === 'busines') {
        setBusinesTheme();
    } else if (currentTheme === 'night') {
        setNightTheme();
    } else if (currentTheme === 'fire') {
        setFireTheme();
    }
}

function setBusinesTheme() {
    mainBlock.classList.add('busines');
    leftMenu.classList.add('busines');
    businesThemeIcon.classList.add('briefcase-active');
    nightThemeIcon.classList.remove('moon-active');
    fireThemeIcon.classList.remove('fire-active');
    console.log('busines');
}
function setNightTheme() {
    nightThemeIcon.classList.add('moon-active');
    businesThemeIcon.classList.remove('briefcase-active');
    fireThemeIcon.classList.remove('fire-active');
    console.log('night');
}
function setFireTheme() {
    fireThemeIcon.classList.add('fire-active');
    businesThemeIcon.classList.remove('briefcase-active');
    nightThemeIcon.classList.remove('moon-active');
    console.log('fire');
}