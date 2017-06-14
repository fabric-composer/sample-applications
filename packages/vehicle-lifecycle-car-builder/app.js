var express = require('express'),
  path = require('path'),
  WebSocket = require('ws'),
  http = require('http'),
  url = require('url'),
  config = require('config');


// create a new express server
var app = express();
var server = http.createServer(app);

app.get('/assets/config.json', (req, res, next) => {
  res.json({
    useLocalWS: true,
    nodeRedBaseURL: process.env.NODE_RED_BASE_URL || config.get("nodeRedBaseURL")
  });
});

var nodeRedBaseURL = process.env.NODE_RED_BASE_URL || config.get("nodeRedBaseURL");


// static - all our js, css, images, etc go into the assets path
app.use(express.static(path.join(__dirname, 'www')));

var wss = new WebSocket.Server({ server: server });
wss.on('connection', function (ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  console.log('client connected', location.pathname);
  var remoteURL = nodeRedBaseURL + location.pathname;
  console.log('creating remote connection', remoteURL);
  var remote = new WebSocket(remoteURL);
  ws.on('close', function () {
    console.log('client closed', location.pathname);
    remote.close();
  });
  ws.on('message', function (data) {
    console.log('Received message from ws. Sending to nodered.',data);
    remote.send(data);
  });
  remote.on('open', function () {
    console.log('remote open', location.pathname);
  })
  remote.on('close', function () {
    console.log('remote closed', location.pathname);
    ws.close();
  });
  remote.on('message', function (data) {
    console.log('Received message from nodered. Sending to ws.',data);
    ws.send(data);
  });
});

// start server on the specified port
server.listen(8100, function () {
  'use strict';
  // print a message when the server starts listening
  console.log('server starting on http://localhost:8100');
});
