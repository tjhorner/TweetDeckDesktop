// Mustache Manager internal script

const { ipcRenderer } = require('electron')

ipcRenderer.sendToHost("mustaches", TD.mustaches)

ipcRenderer.on("custom-mustache", (ev, args) => {
  console.log("Registering custom mustache", args[0])
  TD.mustaches[args[0]] = args[1]
})
