const tweetdeckApp = angular.module('tweetdeckApp', [ "ui.ace" ])

import { ipcRenderer } from 'electron';
import { mustacheManager } from './mustache_manager.js';

// let beautify = ace.require("ace/ext/beautify")

tweetdeckApp.controller('appController', $scope => {
  $scope.showMustaches = false
  $scope.mustaches = { }
  $scope.customMustaches = [ ]
  $scope.currentMustache = ""
  $scope.mustacheContent = "This is the mustache editor. Mustache templates are used by TweetDeck to render the UI; each template is used to render a different component of the TweetDeck UI. For example, `follow_button.mustache` is the template for the follow button you see on a user's profile. Try editing that first to get a feel for the editor!"
  let mustacheEditor = null

  $scope.showThemes = false
  $scope.themes = [ ]
  $scope.currentTheme = 0
  $scope.themeContent = "/* This is the theme editor. You can add or edit a theme to the left. Themes are written in CSS (you can open the TweetDeck devtools by pressing Ctrl/Cmd+Alt+D). */"
  let themeEditor = null

  let originalMustaches = { }

  ipcRenderer.on("open-mustache-editor", ev => {
    $scope.showMustaches = !$scope.showThemes && !$scope.showMustaches
    $scope.$apply()
  })

  ipcRenderer.on("open-theme-editor", ev => {
    $scope.showThemes = !$scope.showMustaches && !$scope.showThemes
    $scope.$apply()
  })

  tweetdeck.addEventListener("ipc-message", ev => {
    switch(ev.channel){
      case "mustaches":
        $scope.mustaches = ev.args[0]
        originalMustaches = ev.args[0]
        var customMustaches = mustacheManager.getMustaches()
        for(var name in customMustaches){
          $scope.mustaches[name] = customMustaches[name]
          $scope.customMustaches.push(name)
        }
        console.log("Mustaches received from tweetdeck webview")
        break
      case "open-mustache-editor":
        $scope.showMustaches = true
        break
    }
    $scope.$apply()
  })

  $scope.viewMustache = name => {
    $scope.mustacheContent = html_beautify($scope.mustaches[name])
    $scope.currentMustache = name
  }

  $scope.saveMustache = () => {
    mustacheManager.saveMustache($scope.currentMustache, $scope.mustacheContent)
    if($scope.customMustaches.indexOf($scope.currentMustache) === -1) $scope.customMustaches.push($scope.currentMustache)
    tweetdeck.getWebContents().send("custom-mustache", [name, custMustaches[name]])
  }

  $scope.viewTheme = index => {
    $scope.themeContent = $scope.themes[index]
    $scope.currentTheme = index
  }

  $scope.saveTheme = () => {
    // themeManager.saveTheme($scope.themes[$scope.currentTheme].id, $scope.themeContent)
  }

  const checkOnline = () => {
    $scope.offline = !navigator.onLine
  }

  window.addEventListener('online', checkOnline)
  window.addEventListener('offline', checkOnline)
  checkOnline()
})
