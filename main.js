if (require('electron-squirrel-startup')) return;
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const spawn = require('child_process').spawn;
const ngrok = require('ngrok');
const Discord = require('discord.js');
const discordKey = require('./discordSecret.json');
const path = require('path');
const fs = require('fs');

var client = undefined;
var minecraftServerProcess = undefined;

const userDataPath = app.getPath('userData');
const configFilePath = path.join(userDataPath, 'config.json');
var config;
if (!fs.existsSync(configFilePath)) {
  config = {
    jar: "",
    cwd: "",
    flags: "",
    ngrokToken: "",
    port: "",
    discordChannel: ""
  };
  fs.writeFileSync(configFilePath, JSON.stringify(config));
} else {
  const jsonString = fs.readFileSync(configFilePath);
  config = JSON.parse(jsonString);
}

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.removeMenu();

  win.on('close', (e) => {
    if (minecraftServerProcess) minecraftServerProcess.kill();
  });

  if (config.jar.length == 0) win.loadFile('./public/config.html');
  else {
    win.loadFile('./public/console.html');
    start(win, config);
  }
  // win.webContents.openDevTools();
  ipcMain.on("pick-file", () => {
    dialog.showOpenDialog({properties: ['openFile'] }).then(function (response) {
      if (!response.canceled) {
        // handle fully qualified file name
        var jar = response.filePaths[0]; 
        console.log(jar);
        win.webContents.send('jar-path', jar);
      } else {
        console.log("no file selected");
      }
    });
  });

  ipcMain.on("start-server", (event, config) => {
    fs.writeFileSync(configFilePath, JSON.stringify(config));
    win.loadFile('./public/console.html');
    start(win, config);
  });

  ipcMain.on("open-config", (event) => {
    win.loadFile('./public/config.html');
    win.webContents.once('dom-ready', () => {
      win.webContents.send('config', config);
    });
  });

  ipcMain.on("save-config", (event, config) => {
    const userDataPath = app.getPath('userData');
    var filePath = path.join(userDataPath, 'custom.json');
    console.log(filePath);
    fs.writeFileSync(filePath, JSON.stringify(config));
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (client) client.destroy();
    ngrok.disconnect();
    if (minecraftServerProcess) minecraftServerProcess.kill();
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

function start(win, config) {
  win.webContents.send("server-started");
  var flags = config.flags.split(' ');
  flags.push(config.jar);
  flags.push('nogui');
  minecraftServerProcess = spawn('java', flags, { cwd: config.cwd });

  // Listen for events coming from the minecraft server process
  function log(data) {
      win.webContents.send("stat", data.toString());
  }
  minecraftServerProcess.stdout.on('data', log);
  minecraftServerProcess.stderr.on('data', log);
  minecraftServerProcess.on("exit", code => {
    win.webContents.send("server-stopped");
    ngrok.disconnect();
  });
  (async function() {
      const url = await ngrok.connect({
          proto: 'tcp',
          addr: config.port, // port or network address, defaults to 80
          authtoken: config.ngrokToken, // your authtoken from ngrok.com
          region: 'in', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
          onStatusChange: status => { win.webContents.send("status", status); }, 
          onLogEvent: data => { win.webContents.send("data", data); }, 
      });
      console.log(url);
      win.webContents.send("url", url);

      // for RCON
      const urlRcon = await ngrok.connect({
        proto: 'tcp',
        addr: 25575, // port or network address, defaults to 80
        authtoken: config.ngrokToken, // your authtoken from ngrok.com
        region: 'in', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
        onStatusChange: status => { win.webContents.send("status", status); }, 
        onLogEvent: data => { win.webContents.send("data", data); }, 
      });
      console.log(urlRcon);
      win.webContents.send("urlRcon", urlRcon);

      if (config.discordChannel.length > 0) {
        client = new Discord.Client();
        client.login(discordKey.secret);
        client.once('ready', () => {
          console.log('Discord bot ready.');
          var channel = client.channels.cache.get(config.discordChannel);
          channel.send('Server started at: ' + '```' + url.slice(6) + '```');
        });
      }
  })();

  ipcMain.on("command", (event, cmd) => {
    minecraftServerProcess.stdin.write(cmd + '\n');
  });
}