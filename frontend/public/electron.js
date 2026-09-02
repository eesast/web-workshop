const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const windowOptions = {
    width: 1280,
    height: 720,
  };
  const mainWindow = new BrowserWindow(windowOptions);
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  // 打开新窗口时的配置
  mainWindow.webContents.setWindowOpenHandler(() => {
    return {
      action: "allow",
      overrideBrowserWindowOptions: windowOptions,
    };
  });
}

app.whenReady().then(() => {
  createWindow();
  // 如果没有窗口打开则打开一个窗口 (macOS)
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
// 关闭所有窗口时退出应用 (Windows & Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
