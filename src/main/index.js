import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let filePickerWindow = null
let mainWindow = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  //Continue to original code below

  ipcMain.handle('openFilePickerWindow', () => {
    if (!filePickerWindow || filePickerWindow.isDestroyed()) {
      filePickerWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        show: false,
        width: 600,
        height: 900,
        title: 'File Picker',
        webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false
        },
        frame: false
      })
      filePickerWindow.setMenuBarVisibility(false)
      filePickerWindow.on('ready-to-show', () => {
        filePickerWindow.show()
      })
      filePickerWindow.on('closed', () => {
        filePickerWindow = null
      })

      const urlToLoad =
        is.dev && process.env['ELECTRON_RENDERER_URL']
          ? new URL('#fpick', process.env['ELECTRON_RENDERER_URL']).toString()
          : `file://${resolve(__dirname, process.platform === 'win32' ? '..\\renderer\\index.html#fpick' : '../renderer/index.html#/fpick')}`

      filePickerWindow.loadURL(urlToLoad)
    }
  })

  ipcMain.handle('closeFilePickerWindow', () => {
    filePickerWindow.close()
    mainWindow.maximize()
    const urlToLoad =
      is.dev && process.env['ELECTRON_RENDERER_URL']
        ? new URL('#learn', process.env['ELECTRON_RENDERER_URL']).toString()
        : `file://${resolve(__dirname, process.platform === 'win32' ? '..\\renderer\\index.html#learn' : '../renderer/index.html#/learn')}`

        mainWindow.loadURL(urlToLoad)
  })

  let sharedData = {}

  // Handler to set data
  ipcMain.handle('set-shared-data', (key, value) => {
    sharedData[key] = value
  })

  // Handler to get data
  ipcMain.handle('get-shared-data', (key) => {
    return sharedData[key]
  })

  ipcMain.handle('reset-shared-data', () => {
    sharedData = {}
  })

  ipcMain.handle('openFilePicker', async () => {
    const result = await dialog.showOpenDialog({
      filters: [{ name: 'Lerning File', extensions: ['json'] }]
    })
    return result
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
