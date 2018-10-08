
const http = require('http')
const express = require('express')
var exphbs = require('express-handlebars');
const app = express()

const port = process.env.PORT || 3000
const chart_url = 'http://localhost:5601/app/kibana#/visualize/edit/16cd8760-cac0-11e8-9e8c-137d8010fd52?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-5y%2Cmode%3Aquick%2Cto%3Anow))'

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/chart_iframe', function (req, res) {
  res.render('home', { chart1_url: '/chart_proxy' });
});
app.get('/chart_proxy', function (req, res) {

  req.pipe(require('request')(chart_url)).pipe(res);

  // res.render('home',{chart1_url: chart_url});
});
app.use(function (req, res) {

  console.log('originalUrl', req.originalUrl)
  console.log('rewriting to ', 'http://localhost:5601' + req.originalUrl)
  req.pipe(require('request')('http://localhost:5601' + req.originalUrl)).pipe(res);

  // res.render('home',{chart1_url: chart_url});
});
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
