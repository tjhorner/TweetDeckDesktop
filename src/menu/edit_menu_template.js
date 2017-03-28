import { app, BrowserWindow } from 'electron';

export const editMenuTemplate = {
  label: 'Edit',
  submenu: [
    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
    { type: 'separator' },
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
    { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
    { type: 'separator' },
    { label: 'Mustache Editor', accelerator: 'CmdOrCtrl+Shift+M', click: () => {
      BrowserWindow.getFocusedWindow().webContents.send("open-mustache-editor")
    } },
    { label: 'Theme Editor - coming soon', accelerator: 'CmdOrCtrl+Shift+T', enabled: false, click: () => {
      BrowserWindow.getFocusedWindow().webContents.send("open-theme-editor")
    } }
  ],
};
