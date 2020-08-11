const route = require('express').Router()

route.get('/', (req, res) => {
  res.send(`register form`)
})

module.exports = route
