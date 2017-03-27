// import './jquery.min.js'

import { remote } from 'electron'

let lastChecked = new Date().getTime()
let bearerToken
let notifInterval

let csrf
let cookies

var parseNotifications = notifs => {
  notifs.forEach(notif => {
    switch(notif.action){
      case "mention":
        new Notification(`@${notif.sources[0].screen_name} mentioned you`, {
          icon: notif.sources[0].profile_image_url_https.replace(/\\/gi, ""),
          body: `"${notif.target_objects[0].full_text.replace(/\\/gi, "")}"`
        })
        break
      case "favorite":
        new Notification(`@${notif.sources[0].screen_name}`, {
          icon: notif.sources[0].profile_image_url_https.replace(/\\/gi, ""),
          body: `liked your Tweet`
        })
        break
      case "retweet":
        new Notification(`@${notif.sources[0].screen_name}`, {
          icon: notif.sources[0].profile_image_url_https.replace(/\\/gi, ""),
          body: `retweeted your Tweet`
        })
        break
    }
  })
}

var getNewNotifications = () => {
  console.log(csrf, cookies)
  $.ajax({
    type: "GET",
    url: `https://api.twitter.com/1.1/activity/about_me.json?model_version=7&count=5&since_id=${lastChecked}&skip_aggregation=true&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1&send_error_codes=1&tweet_mode=extended`,
    headers: {
      "Authorization": `Bearer ${bearerToken}`,
      "x-csrf-token": csrf
    },
    success: res => {
      parseNotifications(res)
      lastChecked = new Date().getTime()
    }
  })
}

tweetdeck.addEventListener('did-stop-loading', () => {
  if(tweetdeck.src.indexOf("https://twitter.com") === -1){
    tweetdeck.executeJavaScript("TD.config.bearer_token", false, token => {
      bearerToken = token
      if(!notifInterval){
        remote.session.defaultSession.cookies.get({ url:"https://tweetdeck.twitter.com" }, (err, cookiesObj) => {
          if(!err){
            cookies = cookiesObj.map(cookie => `${cookie.name}=${cookie.value}`).join("; ").trim()
            csrf = cookiesObj.filter(cookie => cookie.name === "ct0")[0].value

            getNewNotifications()
            notifInterval = setInterval(getNewNotifications, 15000)
          }
        })
      }
    })
  }
})

// jQuery("test")
