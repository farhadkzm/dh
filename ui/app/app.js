// content of index.js
const http = require('http')
const request = require('request');

const url = 'http//dh-stack-elasticsearch-client:9200/log/_search'
const port = 3000

const requestHandler = (request, response) => {
  console.log(request.url)
  var es_response = await axios.get(url);
  response.end('Hello Node.js Server!. ES response: ' + es_response)
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
