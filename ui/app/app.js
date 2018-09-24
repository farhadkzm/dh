// content of index.js
const http = require('http')
const request = require('axios');

const elastic_url = 'http//dh-stack-elasticsearch-client:9200/log/_search'
const port = 3000

const getLocation = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(
      `City: ${data.results[0].formatted_address} -`,
      `Latitude: ${data.results[0].geometry.location.lat} -`,
      `Longitude: ${data.results[0].geometry.location.lng}`
    );
  } catch (error) {
    console.log(error);
  }
};



const requestHandler = (request, response) => {
  console.log(request.url)
  var es_response = getLocation(elastic_url);
  response.end('Hello Node.js Server!. ES response: ' + es_response)
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
