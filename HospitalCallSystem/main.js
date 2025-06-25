//将页面加载进应用窗口中
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron');

const path = require('path')
const url = require('url')
//const {dialog} = require ('electron').remote;

let win

const createWindow = () => {
    win = new BrowserWindow({
      width: 420,
      height: 350,
    //   webPreferences: {
    //     preload: path.join(__dirname, 'preload.js')
    //   }
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      },
      icon: path.join(__dirname,'./img/logo.png')
    })
    require('@electron/remote/main').initialize()  //添加语句
    require('@electron/remote/main').enable(win.webContents)   //添加语句
   
    
    win.loadFile('menu.html')

    ipcMain.on('openWindow', () => {
      const mainWin = new BrowserWindow({
          width: 860,
          height: 800,
          webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
          },
          icon: path.join(__dirname,'./img/logo.png')
      })
    
     
      require('@electron/remote/main').enable(mainWin.webContents)   //添加语句
      mainWin.loadFile('index.html')
    })

    ipcMain.on('closeWindow', () => {
      app.quit()
    });
  win.setMenu(null);
  win.on('closed', () => {
      win = null
  })
}


app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })