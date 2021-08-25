/* eslint-disable no-undef */
// renderer.js
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

const maxResBtn = document.getElementById('maxResBtn');
const maxResBtnSpan = document.querySelector('#maxResBtn > span');

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
