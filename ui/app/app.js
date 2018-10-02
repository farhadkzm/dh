// content of index.js
const http = require('http')
const express = require('express')
const fetch = require('node-fetch')

const app = express()
//const elastic_url ='http//dh-stack-elasticsearch-client:9200/log/_search'
const elastic_url ='http://localhost:9200'

const execution_url =`${elastic_url}/log/_search`

const port = process.env.PORT || 3000

function hasEndMessageReceived(data){
  var body = {
    "query": {
      "bool" : {
        "must" : {
          "term" : { "execution_id" : data.id },
          "match" : {  "message" : "finished"}
        }
      }
    }
  }
  return fetch(execution_url, {
    method: 'POST',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res1 => res1.json())
  .then(res1 => { hasEndMessageReceived:res1, data})

}

function getExecutions(){

  var body = {
    "size": 0,
    "aggs" : {
      "group_by_execution_id" : {

        "terms": {
          "field": "execution_id"
        },
        "aggs" : {
          "execution_max" : { "max" : { "field" : "created" } },
          "execution_min" : { "min" : { "field" : "created" } }
        }

      }
    }
  }
  //select all executions that are in-progress
  //handle timeout
  //handle status

  return new Promise((resolve, reject) => {


    var resArray = fetch(execution_url, {
      method: 'POST',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res1 => res1.json())
    .then(data =>
      {

        return data.aggregations.group_by_execution_id.buckets
        .map(exec=> {
          return {id: exec.key,
            last_log: exec.execution_max.value,
            first_log: exec.execution_min.value}
          });
        })
    .then(data => {
          return data.map(exec=> {return hasEndMessageReceived(exec);})
        });

    resolve( Promise.all(resArray).then(function(values) {
          console.log(values)
        }))

      })
      .catch(err => reject(err))

  }
  //num of txn over a time period
  //run agg req to get list of execution periods

  app.get('/', (request, response) => {
    Promise.all([
      //get(log_url)
      getExecutions()
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
