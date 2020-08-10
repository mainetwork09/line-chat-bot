const route = require('express').Router()
const request = require('request-promise')
const bodyParser = require('body-parser').json()

route.get('/', (req, res) => {
  res.send(`contact`)
})

route.post('/update', [bodyParser], async (req, res)=>{

  let email = req.body.email
  let firstname = req.body.firstname
  let lastname = req.body.lastname
  let line_uuid = req.body.line_uuid.context.userId

  //console.log(req.body)

  let data_response

  const options = {
    method: 'POST',
    url: process.env.AC_API_URL + `/contact/sync`,
    headers: {
      'Content-Type': "application/json",
      'Api-Token': process.env.AC_API_TOKEN
    },
    json: true,
    body: {
      "contact": {
        "email": email,
        "firstName": firstname,
        "lastName": lastname
      }
    }
  }

  if (!email || !firstname || !lastname) {
    data_response = {
      success: false
    }
    //console.log(options)
    console.log(data_response)
  }else{

    let contact_id
    
    await request(options).then((data) => {
      contact_id = data.contact.id
      console.log(`Contact ID: ` + data.contact.id)
      data_response = {
        success: true,
        contact_id: contact_id
      }
      console.log(data_response)
    }).catch((err)=>{
      data_response = {
        success: false,
        message: err
      }
      console.log(data_response)
    })

    await request({
      method: "POST",
      url: process.env.AC_API_URL + `/fieldValues`,
      headers: {
        'Content-Type': "application/json",
        'Api-Token': process.env.AC_API_TOKEN
      },
      json: true,
      body: {
        "fieldValue": {
          "contact": contact_id,
          "field": process.env.AC_FIELD_LINE_UUID,
          "value": line_uuid
        }
      }
    })
    //console.log(data_response)
    
  }

  console.log(`Contact Updated`)

  res.send({
    success: true,
    message: 'success'
  })

})

module.exports = route

