const { CANCELLED } = require('dns');
const { app, BrowserWindow, BrowserView, ipcMain, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');
const { sandboxed } = require('process');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  
  const menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Connect",
          click: () => {
            dialog.showOpenDialog( options = { 
              defaultPath: path.join(app.getAppPath(), 'src\\Maps'),
              filters: [
                {
                  name: 'json',
                  extensions: ['json']}
              ]
            }).then((fileName) => {
              const win = new BrowserView({
                webPreferences: {
                  nodeIntegration: true,
                  contextIsolation: false
                }
              });
              mainWindow.setBrowserView(win)
              win.setBounds({ x: 0, y: 0, width: 300, height: 300 })
              win.webContents.loadFile('./3D Renderer/main.html');
              win.webContents.send('load', fileName.filePaths[0]);
            }).catch(err => {
              console.log(err);
            })
          }
        },
      ]
    }
  ])

  Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.



/*ipcMain.on('get-change', async (event, result) => {
  change = await result;
  view.webContents.loadFile(result)
});*/

ipcMain.on('save-sheet', async (event, data) => {
   sheet = await JSON.stringify(data);
   console.log(app.getAppPath())
   dialog.showSaveDialog(options = {
    defaultPath: path.join(app.getAppPath(), 'src\\Character Sheets'),
    filters: [
      {
        name: 'json',
        extensions: ['json']}
    ]
   }).then((fileName) => {
    if(!fileName.canceled){fs.writeFile(fileName.filePath.toString(), sheet, 'utf8', (err) => {
      dialog.showErrorBox*('Save failed');
    })}
  }).catch(err => {
    console.log(err);
  })
})


async function readSheet(){
  const {canceled, filePaths} = await dialog.showOpenDialog( options = { 
    defaultPath: path.join(app.getAppPath(), 'src\\Character Sheets'),
    filters: [
      {
        name: 'json',
        extensions: ['json']}
    ]
  })
  console.log(filePaths[0])
  const sheet = JSON.parse(fs.readFileSync(filePaths[0].toString(), 'utf8'));
  console.log(sheet);
  return sheet;
}





ipcMain.handle("open-sheet", readSheet)





