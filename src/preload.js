const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
    save: () => ipcRenderer.on("save"),
    sendFile: (blob) => ipcRenderer.send('saveFile', blob) 
})