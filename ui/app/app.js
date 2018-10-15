const express = require('express')
var request = require('request')
var exphbs = require('express-handlebars');
const app = express()

const port = process.env.PORT || 3000
const chart_url = 'http://localhost:5601/app/kibana#/visualize/edit/16cd8760-cac0-11e8-9e8c-137d8010fd52?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-5y%2Cmode%3Aquick%2Cto%3Anow))'
const kibana_url = '/app/kibana#/visualize/edit/16cd8760-cac0-11e8-9e8c-137d8010fd52?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-5y%2Cmode%3Aquick%2Cto%3Anow))'

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set the headers
var headers = {
  'Content-Type': 'application/json'
}

// Configure the request
var options = {
  url: 'http://localhost:9200/log/_search',
  method: 'POST',

  json: true,
  body: {
    "size": 0,
    "aggs": {
      "group_by_execution_id": {

        "terms": {
          "field": "created"
        }
      }
    }
  }
}

// Start the request


app.get('/chart', function (req, res) {

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // Print out the response body
      console.log(body)
    }
    var arry = body.aggregations.group_by_execution_id.buckets.map(data => {
      //key_as_string
      //doc_count
      return [data.key_as_string, data.doc_count]
    })
    console.log(JSON.stringify(arry))
    res.render('home', { chart_data: JSON.stringify(arry) })
  })

});


app.use(function (req, res) {

  console.log('rewriting to ', 'http://localhost:5601' + req.url)
  req.pipe(require('request')('http://localhost:5601' + req.url)).pipe(res);

});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
