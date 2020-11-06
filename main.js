const {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
  ipcMain,
} = require("electron");
const path = require("path");
const clipboardExt = require("electron-clipboard-extended");

let mainWindow = {};
const listClip = [];

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    x: width - 400,
    y: height - 580,
    width: 400,
    height: 600,
    resizable: false,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools();
}

function eventClipboard() {
  clipboardExt
    .on("text-changed", () => {
      let currentText = clipboardExt.readText();
      if (clipboardExt.readText() !== null) {
        if (!listClip.includes(currentText)) {
          listClip.push(currentText);
        }
        mainWindow.webContents.send("store-data", listClip);
      }
    })
    .startWatching();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    mainWindow.webContents.send("store-data", listClip);
  });
}

app.whenReady().then(() => {
  // shortcut to open window
  globalShortcut.register("CommandOrControl+M", () => {
    mainWindow.webContents.send("store-data", listClip);
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
  createWindow();
  eventClipboard();
  ipcMain.on("pinned", () => {
    if (mainWindow.isAlwaysOnTop()) {
      mainWindow.setAlwaysOnTop(false, "floating", 1);
    } else {
      mainWindow.setAlwaysOnTop(true, "floating", 1);
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
