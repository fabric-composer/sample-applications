var express = require('express'),
  path = require('path'),
  WebSocket = require('ws'),
  http = require('http'),
  url = require('url'),
  config = require('config');


// create a new express server
var app = express();
var server = http.createServer(app);

var restServerConfig = Object.assign({}, config.get('restServer'));

app.get('/assets/config.json', (req, res, next) => {
  if (process.env.REST_SERVER_CONFIG ) {
    try {
      var restServerEnv = JSON.parse(process.env.REST_SERVER_CONFIG);
      restServerConfig = Object.assign(restServerConfig, restServerEnv); // allow for them to only specify some fields
      restServerConfig = restServerEnv;
    } catch (err) {
      res.status(500)
    }
  }
  res.json({
    restServer: restServerConfig
  });
});

// static - all our js, css, images, etc go into the assets path
app.use(express.static(path.join(__dirname, 'www')));

// start server on the specified port
server.listen(8100, function () {
  'use strict';
  // print a message when the server starts listening
  console.log('server starting on http://localhost:8100');
});
