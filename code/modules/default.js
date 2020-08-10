const route = require('express').Router()

route.get('/', (req, res) => {
  res.send(`welcome`)
})

module.exports = route
