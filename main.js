const {
  app, BrowserWindow, ipcMain, globalShortcut,
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('electron');
const path = require('path');

// Set env
process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'IPA Editor',
    width: isDev ? 550 : 900,
    minWidth: 550,
    height: isDev ? 750 : 900,
    frame: false, // application frame and app icon will be hidden
    autoHideMenuBar: true, // hides menu bar on top and will disable finder on
    icon: `${__dirname}/assets/icons/icon.png`,
    resizable: true,
    // backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'app/index.html'));

  ipcMain.on('closeApp', () => {
    app.quit();
  });

  globalShortcut.register('CommandOrControl+P', () => {
    app.quit();
  });

  ipcMain.on('minimizeApp', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximizeRestoreApp', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });

  // Check if maximized
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('isMaximized');
  });

  // Check if restored
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('isRestored');
  });
};

ipcMain.on('openSettings', () => {
  console.log('settings');
});

app.on('ready', () => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.allowRendererProcessReuse = true;
