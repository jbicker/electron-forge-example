import { app, autoUpdater, BrowserWindow, ipcMain, net } from 'electron';
import path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const logToFrontent = (message: string) => {
    mainWindow.webContents.send('message-from-main', message);
  }

  const old_console_error = console.error;
  console.error = function (message: any) {
      old_console_error(message);
      logToFrontent(message)
  }

  const old_console_log = console.log;
  console.log = function (message: any) {
      old_console_log(message);
      logToFrontent(message)
  }

  mainWindow.on('ready-to-show', () => {
    logToFrontent('Version: ' + app.getVersion());
  });

  ipcMain.on('message-to-main', (_event, message) => {
    console.log(message);
    
    const server = 'http://localhost:3000'
    const url = `${server}/${process.platform}/${process.arch}`
    logToFrontent('URL: ' + url)
    // logToFrontent('URL: ' + url)
    // const request = net.request(url);
    // logToFrontent('Request: ' + request);
    // request.on('response', (response) => {
    //   logToFrontent(`STATUS: ${response.statusCode}`)
    //   logToFrontent(`HEADERS: ${JSON.stringify(response.headers)}`)
    //   response.on('data', (chunk) => {
    //     logToFrontent(`BODY: ${chunk}`)
    //   })
    //   response.on('error', (error: any) => {
    //     logToFrontent(`RESPONSE ERROR: ${error}`)
    //   })
    //   response.on('end', () => {
    //     logToFrontent('No more data in response.')
    //   })
    // })
    // request.on('finish', () => {
    //   logToFrontent('Request finished')
    // })

    // request.on('abort', () => {
    //   logToFrontent('Request aborted')
    // })

    // request.on('error', (error) => {
    //   logToFrontent(`ERROR: ${error}`)
    // });
    
    // request.end();
    
    autoUpdater.setFeedURL({ url });

    autoUpdater.checkForUpdates();
    autoUpdater.on('update-available', () => {
      logToFrontent('update-available:');
    });

    autoUpdater.on('update-downloaded', (event: Event,
      releaseNotes: string,
      releaseName: string,
      releaseDate: Date,
      updateURL: string) => {
      logToFrontent('update-downloaded');
      logToFrontent(releaseNotes);
      logToFrontent(releaseName);
      logToFrontent(releaseDate.toString());
      logToFrontent(updateURL);
      autoUpdater.quitAndInstall();
    })
  
    ipcMain.on('quit-and-install', () => {
      autoUpdater.quitAndInstall();
    });
  });



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
