const { app, BrowserWindow } = require('electron')

const isDev = !app.isPackaged

// 你的 Vercel 部署地址
const PRODUCTION_URL = 'https://synro.vercel.app'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (isDev) {
    // 开发模式：本地服务器
    mainWindow.loadURL('http://localhost:3000')
  } else {
    // 生产模式：加载 Vercel 线上地址
    mainWindow.loadURL(PRODUCTION_URL)
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
