const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()

const moduleContact = require('./modules/contact')
const moduleDefault = require('./modules/default')
const moduleWebhook = require('./modules/webhook')
const moduleRegister = require('./modules/register')
const moduleCustomfield = require('./modules/customfield')

//const APP_HOST = process.env.APP_HOST
const APP_PORT = process.env.APP_PORT

//const bodeParserJSON = require('body-parser')
//const mongoose = require('mongoose')

const app = express()
//app.use(bodeParser.json())
//app.use(bodeParser.urlencoded())
app.use(
  cors({
    origin: '*'
  }))
app.use('', moduleDefault)
//app.use('/contact', moduleContact)
app.use('/webhook', moduleWebhook)
app.use('/register', moduleRegister)
//app.use('/customfield', moduleCustomfield)

app.listen(APP_PORT, (backlog) => {
  console.log(backlog)
},
  () => {
    console.log(`App start at port ${APP_PORT}`)
  })

module.exports = app

