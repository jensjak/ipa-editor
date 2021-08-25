const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const log = require('electron-log');

// Set env
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'IPA Editor',
    width: isDev ? 1400 : 1400,
    height: isDev ? 1000 : 900,
    frame: false, // application frame and app icon will be hidden
    autoHideMenuBar: true, // hides menu bar on top and will disable finder on
    icon: `${__dirname}/assets/icons/icon.png`,
    resizable: isDev ? true : false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'app/index.html'));


ipcMain.on(`display-app-menu`, function(e, args) {
  if (isWindows && mainWindow) {
    menu.popup({
      window: mainWindow,
      x: args.x,
      y: args.y
    });
  }
});

ipcMain.on('closeApp', () => {
  app.quit()
})

ipcMain.on('minimizeApp', () => {
  mainWindow.minimize()
})

ipcMain.on('maximizeRestoreApp', () => {
    if(mainWindow.isMaximized()){
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
})

// Check if maximized
mainWindow.on('maximize', () => {
  mainWindow.webContents.send('isMaximized')
})

// Check if restored
mainWindow.on('unmaximize', () => {
  mainWindow.webContents.send('isRestored')
})

}

app.on('ready', () => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.allowRendererProcessReuse = true
