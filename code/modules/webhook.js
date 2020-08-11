const route = require('express').Router()
const bodyParser = require('body-parser').urlencoded({ extended: true })
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed
const Client = require('@line/bot-sdk').Client;
const mongoose = require('mongoose')

mongoose.connect('mongodb://mongo-db:27017/chatbot', { useNewUrlParser: true, useUnifiedTopology: true });

const MessageSchema = mongoose.Schema({ user_id: String, text: String });
const MessageModel = mongoose.model('Message', MessageSchema);


//const request = require('request-promise')
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN
const CHANNEL_SECRET = process.env.CHANNEL_SECRET

const config = {
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET
}
const client = new Client(config);

route.use(middleware(config))
//route.use(bodyParser.json())

route.post('/', (req, res) => {
  //let reply_token = req.body.events[0].replyToken
  //reply(reply_token)

  console.log(`==== WEBHOOK Triggered ====`)
  const event = req.body.events[0];
  const Message = new MessageModel();


  if (event.type === 'message') {
    const message = event.message;
    console.log(event)

    if (message.type === 'text' && message.text === `ส่งผล`) {
      console.log(`==== Reply result ====`)
      client.replyMessage(event.replyToken, {
        "type": "text",
        "text": "Please send your result"
      });
    } else if (message.type === 'image') {
      console.log(`==== Message type image | userID: ${event.source.userId} ====`)

      Message.find({ user_id: event.userId }).then(function (e) {
        console.log(e)
      })

      client.replyMessage(event.replyToken, {
        "type": "text",
        "text": `this is image`
      });
    } else {
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: `Echo: ${message.text}`,
      });
    }


    Message.user_id = event.source.userId
    Message.text = event.message.text
    Message.save().then((e) => {
      console.log(`==== data saved ====`)
      console.log(e)
    })
  }

  res.sendStatus(200)
})

route.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})
/*
route.post('/', [bodyParser], (req, res) => {
  console.clear()
  console.log(`==== WEBHOOK Triggered ====`)
  console.log(req.body)
  if (!req.body.contact) {
    res.json({
      success: false,
      message: `No line body`
    })
  } else {
    let lineUUID = req.body.contact.fields.lineuuid
    console.log(`lineUUID = ${lineUUID}`)

    const options = {
      method: 'POST',
      url: 'https://api.line.me/v2/bot/message/push',
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
      },
      json: true,
      body: {
        to: lineUUID,
        messages: [
          {
            type: "text",
            text: JSON.stringify(req.body.contact, null, 4)
          }
        ]
      }
    }

    console.log(`=== PUSH to LINE ===`)

    request(options).then((res) => {
      console.log(`=== PUSHED to LINE ===`)
      console.log(res)
    })

    res.send({
      success: true
    })
  }
})
*/
module.exports = route
