const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    backgroundColor: '#0b0b0f',
    title: 'DBD Tournament',
    icon: path.join(__dirname, 'Assets', 'logodbd.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'index.html'));

  // Externe Links im Standardbrowser öffnen
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

