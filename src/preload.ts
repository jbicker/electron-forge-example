// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

declare global {
    interface Window {
      electronAPI: any;
    }
  }

contextBridge.exposeInMainWorld('electronAPI', {
    messageFromMain: (callback: any) => ipcRenderer.on('message-from-main', (_event, value) => {
        callback(value);
    }),
    updateAvailable: (callback: any) => ipcRenderer.on('update-available', () => {
        callback();
    }),
    messageToMain: (message: string) => ipcRenderer.send('message-to-main', message),
})