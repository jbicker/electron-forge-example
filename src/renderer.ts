/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import { ipcRenderer } from 'electron';
import './index.css';

console.log('👋 This message is being logged by "renderer.ts", included via Vite');

document.getElementById('test-button')?.addEventListener('click', () => {
    window.electronAPI?.messageToMain('Hello from renderer process');
});

window.electronAPI?.messageFromMain((message: string) => {
    const mfmEl = document.getElementById('message-from-main');
    console.log('message-from-main', message);
    if(mfmEl) {
        mfmEl.innerHTML += message;
    }
});

window.electronAPI?.updateAvailable((version: string) => {
    const updateAvailableEl = document.getElementById('update-available');
    if(updateAvailableEl) {
        updateAvailableEl.style.display = 'block';
    }
    const versionEl = document.getElementById('version');
    if(versionEl) {
        versionEl.innerText = version;
    }
    console.log('Update available', version);
});