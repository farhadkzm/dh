// content of index.js
const http = require('http')
const express = require('express')
const fetch = require('node-fetch')

const app = express()
//const elastic_url ='http//dh-stack-elasticsearch-client:9200/log/_search'
const elastic_url ='http://localhost:9200/log/_search'

const port = process.env.PORT || 3000

function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res1 => res1.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}


app.get('/', (request, response) => {
  Promise.all([
    get(elastic_url)
  ]).then(([es_res]) =>
    response.send({
      query: es_res
    }))
    .catch(err => {
      console.log (err)
      response.send('Ops, something has gone wrong', er)})
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
