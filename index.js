'use strict';

//*****HTTP SERVER USING EXPRESS
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express() //creates express http server

// Sets server port and logs message on success; server listens for requests in default port or port 1337
app.set('port', (process.env.PORT || 5000))

//*****Process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//*****Routes
app.get('/', function(req, res) {
  res.send("Hello. Let's talk food!")
})

let token = "EAAKyI9NvUzIBABAdgFmHBVaCB4R8YvukhXO7wH51vYUs7kGsyE3vatvfoq0pctVax92R5ZA2cSVzF6RQMF4CMKhD82NZA7gRwGwm43gPpqso4b7WdWkaAo3u2wkBH11qiDufWZApv0YmVtlV2jVk8FP2cW9Pqw4KhEZB14jXxAZDZD"

//*****FACEBOOK
app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] == "EAAKyI9NvUzIBABAdgFmHBVaCB4R8YvukhXO7wH51vYUs7kGsyE3vatvfoq0pctVax92R5ZA2cSVzF6RQMF4CMKhD82NZA7gRwGwm43gPpqso4b7WdWkaAo3u2wkBH11qiDufWZApv0YmVtlV2jVk8FP2cW9Pqw4KhEZB14jXxAZDZD"){
      res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

//sends & receive messages from user
app.post('/webhook/', function(req, res) {
  let messaging_events = req.body.entry[0].messaging
  for(let i=0; i < messaging_events.length; i++) {
    let event = messaging_events[i]
    let sender = event.sender.id

    if(event.message && event.message.text) { //if there's a message & text..
      let text = event.message.text

      if(text == 'Generic') {
        sendGenericMessage(sender)
        continue
      }
      sendText(sender, "Text echo: " + text.substring(0,100))
    }
  }
  res.sendStatus(200)
})

//sends message back to user
function sendText(sender, text){
  let messageData = {text: text}
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token : token},
    method: "POST",
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function(error, response, body) {
    if(error) {
      console.log("sending error")
    } else if(response.body.error) {
      console.log("response body error")
    }
  })
}


function sendGenericMessage(sender) {
    let messageData = /*{
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }*/
        {
  "object": "page",
  "entry": [
    {
      "id": "<PAGE_ID>",
      "time": 1502905976963,
      "messaging": [
        {
          "sender": {
            "id": "1254459154682919"
          },
          "recipient": {
            "id": "682498171943165"
          },
          "timestamp": 1502905976377,
          "message": {
            "quick_reply": {
              "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            "mid": "mid.$cAAJsujCd2ORkHXKOOVd7C1F97Zto",
            "seq": 9767,
            "text": "Green"
          }
        }
      ]
    }
  ]
}
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//**PORT
app.listen(app.get('port'), function() {
  console.log("running: port")
})