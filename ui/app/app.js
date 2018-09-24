// content of index.js
const http = require('http')
const request = require('axios');

const elastic_url = 'http//dh-stack-elasticsearch-client:9200/log/_search'
const port = 3000

const getLocation = async url => {
  return await axios.get(url).data
};



const requestHandler = (request, response) => {
  console.log(request.url)
  var es_response = getLocation(elastic_url);
  response.end(es_response)
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
