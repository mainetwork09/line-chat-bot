const route = require('express').Router()
const bodyParser = require('body-parser').urlencoded({ extended: true })
const request = require('request-promise')
const CHANNEL_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN

route.post('/', [bodyParser], (req, res) => {
  console.log(`==== WEBHOOK Triggered ====`)
  console.log( req.body )
  if (!req.body.contact ) {
    res.json({
      success: false,
      message: `Error`
    })
  }else{
    let lineUUID = req.body.contact.fields.lineuuid
    console.log(`lineUUID = ${lineUUID}`)

    const options = {
      method: 'POST',
      url:'https://api.line.me/v2/bot/message/push',
      headers:{
        'Content-Type': "application/json",
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
      },
      json: true,
      body: {
        to: lineUUID,
        messages: [
          {
            type: "text",
            text: JSON.stringify(req.body.contact, null, 4 )
          }
        ]
      }
    }

    console.log(`=== PUSH to LINE ===`)

    request(options).then((res)=>{
      console.log(`=== PUSHED to LINE ===`)
      console.log(res)
    })

    res.send({
      success:true
    })
  }
})

module.exports = route
