const route = require('express').Router()
const request = require('request-promise')

//const bodeParserJSON = require('body-parser')

route.get('/', async (req, res) => {
  let options = {
    method: "GET",
    url: process.env.AC_API_URL + `/fields`,
    headers: {
      'Content-Type': "application/json",
      'Api-Token': process.env.AC_API_TOKEN
    },
    json:true
  }

  let fieldObjects;

  await request(options).then((data)=>{
    console.log(data.fields)
    fieldObjects = data.fields
  })

  let result = []
  fieldObjects.forEach(element => {
    result.push({
      id: element.id,
      title: element.title
    })
  });
  
  res.json(result)
  //res.end()
})

module.exports = route
