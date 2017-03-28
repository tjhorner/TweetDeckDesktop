// Here is the starting point for your application code.

ace.config.set("basePath", "ace")

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';
import './twitter_notifications.js';
import './ng_app.js';

import { mustacheManager } from './mustache_manager.js';

// All stuff below is just to show you how it works. You can delete all of it.
import { remote, shell } from 'electron';
import jetpack from 'fs-jetpack';
// import { greet } from './hello_world/hello_world';
import env from './env';
// import request from 'request';

let tweetdeckLoaded = false

const app = remote.app
const dataPath = app.getPath("userData")
const appDir = jetpack.cwd(app.getAppPath())

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json')

jetpack.dir(`${dataPath}/plugins`)

// load internal plugins first
jetpack.list(`${__dirname}/plugins`).forEach(file => {
  if(file.indexOf(".js") === -1) return false
  jetpack.readAsync(`${__dirname}/plugins/${file}`).then(fileContents => tweetdeck.executeJavaScript(fileContents))
})

// load from app dir
jetpack.list(`${dataPath}/plugins`).forEach(file => {
  if(file.indexOf(".js") === -1) return false
  jetpack.readAsync(`${dataPath}/plugins/${file}`).then(fileContents => tweetdeck.executeJavaScript(fileContents))
})

const execInTweetdeck = (func, callback = () => { }) => {
  tweetdeck.executeJavaScript(`(${func.toString()})()`, false, callback)
}

tweetdeck.addEventListener("did-finish-load", () => {
  tweetdeckLoaded = true

  tweetdeck.getWebContents().on("new-window", (event, url) => {
    shell.openExternal(url)
  })

  var custMustaches = mustacheManager.getMustaches()

  for(var name in custMustaches)
    tweetdeck.getWebContents().send("custom-mustache", [name, custMustaches[name]])
})
