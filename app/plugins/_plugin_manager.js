// Plugin Manager internal script

class TDPluginManager {
  constructor(){
    this.plugins = [ ]
  }

  log(...message){
    console.log(`[TDPluginManager] ${message.join(" ")}`)
  }

  add(plugin){
    if(plugin instanceof TDPlugin){
      this.plugins += plugin

      this.log(`Loading plugin ${plugin.name} ${plugin.versionReadable} by ${plugin.author}`)
      try{
        plugin.onload()
        this.log(`Plugin ${plugin.name} loaded!`)
      }catch(e){
        console.error(`Error loading ${plugin.name}!`, e)
      }
    }
  }
}

class TDPlugin {
  constructor(opts = {
    name: "",
    description: "",
    author: "",
    versionReadable: "",
    version: 0
  }){
    this.name = opts.name
    this.description = opts.description
    this.author = opts.author
    this.version = opts.version
    this.versionReadable = opts.versionReadable
  }

  onload(){ }
  onunload(){ }
}

var pluginManager = new TDPluginManager()
