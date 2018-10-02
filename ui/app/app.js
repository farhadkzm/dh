// content of index.js
const http = require('http')
const express = require('express')
const fetch = require('node-fetch')

const app = express()
//const elastic_url ='http//dh-stack-elasticsearch-client:9200/log/_search'
const elastic_url ='http://localhost:9200'

const port = process.env.PORT || 3000
const FINISHED = "finished"

//get the list of executions with min,max log datetime

//calculate period for each in minutes

//calculate status of each execution

//calculate licence utilization
//calculate number of sessions for each process within a given time



function enhanceForStatus(data){
  var body = {
    "query": {
      "bool" : {
        "must" : [
          {"term" : { "execution_id" : data.execution_id }},
          {"match" : {  "message" : FINISHED}}
        ]
      }
    }
  }

  return fetch(`${elastic_url}/log/_count`, {
    method: 'POST',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res1 => res1.json())
  .then(res1 => {
    return {hasFinished:res1.count, ...data}
  });

}

function processStatus(data){

  var status = "FINISHED"

  const timoutPeriod = 1000*60*20 //20 minutes
  if(data.hasFinished != 0){
    if (data.last_log + timoutPeriod < new Date().getTime())
    {  status = "TIME_OUT"}
    else {
      status = "IN_PROGRESS"
    }

  }

  return {...data, status}
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

  return new Promise((resolve, reject) => {


    var resArray = fetch(`${elastic_url}/log/_search`, {
      method: 'POST',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res1 => res1.json())

    .then(data =>{
      return data.aggregations.group_by_execution_id.buckets
      .map(bucket=> {
        return {execution_id: bucket.key,
          last_log: bucket.execution_max.value,
          first_log: bucket.execution_min.value}
        });
      })
      .then(data =>{
        return data.map(exec=> {
          var difference = exec.last_log - exec.first_log
          const days = 1000*60*60.0
          var period_in_hours = Math.floor(difference/days);
          return {...exec, period_in_hours}
        } )
      })
      .then(data => Promise.all(data.map(item => enhanceForStatus(item))))
      .then(data => data.map(item => processStatus(item)))
      .then(data => {resolve(data)})
      .catch(err => reject(err))

    });
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
