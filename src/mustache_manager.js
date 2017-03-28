import { remote } from 'electron'
import jetpack from 'fs-jetpack'

const appDir = jetpack.cwd(remote.app.getPath("userData"))
const MUSTACHE_FILE_NAME = "custom_mustaches.json"

if(!appDir.exists(MUSTACHE_FILE_NAME)) appDir.file(MUSTACHE_FILE_NAME, { content: { } })
var customMustaches = appDir.read(MUSTACHE_FILE_NAME, "json")

export const mustacheManager = {
  getMustaches: () => {
    return customMustaches
  },
  saveMustache: (name, content) => {
    customMustaches[name] = content
    appDir.write(MUSTACHE_FILE_NAME, customMustaches)
    return true
  }
}
