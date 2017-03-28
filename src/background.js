import path from 'path';
import url from 'url';
import { app, Menu, Tray } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath}-${env.name}`);
}

app.on('ready', () => {
  setApplicationMenu();

  console.log(__dirname)

  let icon = new Tray(__dirname + "/icon.ico")

  icon.on("click", () => {
    mainWindow.show()
  })

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    backgroundColor: "#1C6399"
  });

  // mainWindow.setMenuBarVisibility(false)
  mainWindow.maximize()

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on("close", event => {
    event.preventDefault()
    mainWindow.hide()
  })

  if (env.name === 'development') {
    // mainWindow.openDevTools();
  }
});

app.on('window-all-closed', () => {
  // app.quit();
});
