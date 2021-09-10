const { app } = require("electron");
const { env } = process;

let win;

async function createWindow() {
  const { BrowserWindow } = require("electron");
  const { hideBin } = require("yargs/helpers");
  const path = require("path");
  const yargs = require("yargs/yargs");
  const argv = yargs(hideBin(process.argv)).command(
    "$0 <url>",
    "start a web page in the Footron web shell"
  ).argv;
  win = new BrowserWindow({
    frame: false,
    show: false,
    width: 2162,
    height: 1216,
    backgroundColor: "black",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.once("ready-to-show", () => {
    win.show();
  });
  win.setAlwaysOnTop(true, "floating");

  await win.loadURL(argv.url);
}

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
app.commandLine.appendSwitch("disable-web-security");
app.commandLine.appendSwitch("force-dark-mode");
app.commandLine.appendSwitch("enable-features", "WebUIDarkMode");

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
