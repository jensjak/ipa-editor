/* eslint-disable no-undef */
// renderer.js
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer, shell } = require('electron');

const maxResBtn = document.getElementById('maxResBtn');
const maxResBtnSpan = document.querySelector('#maxResBtn > span');

// Open all links in external browser
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
});

// close button
closeBtn.addEventListener('click', () => {
  ipcRenderer.send('closeApp');
});

// maximize / resore button
function changeMaxResBtn(isMaximizedApp) {
  if (isMaximizedApp) {
    maxResBtn.title = 'Restore';
    maxResBtnSpan.innerHTML = 'close_fullscreen';
  } else {
    maxResBtn.title = 'Maximize';
    maxResBtnSpan.innerHTML = 'crop_square';
  }
}
ipcRenderer.on('isMaximized', () => { changeMaxResBtn(true); });
ipcRenderer.on('isRestored', () => { changeMaxResBtn(false); });

maxResBtn.addEventListener('click', () => {
  ipcRenderer.send('maximizeRestoreApp');
});

// minimize button
minimizeBtn.addEventListener('click', () => {
  ipcRenderer.send('minimizeApp');
});

// menu
fileMenuExit.addEventListener('click', () => {
  ipcRenderer.send('closeApp');
});

// menu
fileMenuSettings.addEventListener('click', () => {
  ipcRenderer.send('openSettings');
});
