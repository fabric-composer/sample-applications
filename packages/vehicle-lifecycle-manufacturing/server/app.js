
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressLess = require('express-less');
var cfenv = require('cfenv');
var WebSocket = require('ws');
var http = require('http');
var url = require('url');
var config = require('config');

var nodeRedBaseURL = process.env.NODE_RED_BASE_URL || config.get('nodeRedBaseURL');


// create a new express server
var app = express();
var server = http.createServer(app);

// static - all our js, css, images, etc go into the assets path
app.use('/app', express.static(path.join(__dirname, '../client', 'app')));
app.use('/bower_components', express.static(path.join(__dirname, '../client', 'bower_components')));
app.use('/assets', express.static(path.join(__dirname, '../client', 'assets')));
app.use('/data', express.static(path.join(__dirname, '../client', 'data')));

app.use('/less/stylesheets/*', function (req, res, next) {
  var url = req.originalUrl;
  var relativePath = url.replace('less/stylesheets/', '');
  var lessCSSFile = '../client' + relativePath;
  req.url = lessCSSFile;
  var expressLessObj = expressLess(__dirname, {
    compress: true,
    debug: true
  });
  expressLessObj(req, res, next);
});

require('./routes')(app);

var wss = new WebSocket.Server({ server: server });
wss.on('connection', function (ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  console.log('client connected', location.pathname);
  var remoteURL = nodeRedBaseURL + location.pathname;
  console.log('creating remote connection', remoteURL);
  var remote = new WebSocket(remoteURL);
  ws.on('close', function (code, reason) {
    console.log('client closed', location.pathname, code, reason);
    remote.close();
  });
  ws.on('message', function (data) {
    console.log('message from client', data);
    remote.send(data);
  });
  remote.on('open', function () {
    console.log('remote open', location.pathname);
  })
  remote.on('close', function (code, reason) {
    console.log('remote closed', location.pathname, code, reason);
    ws.close();
  });
  remote.on('message', function (data) {
    console.log('message from remote', data);
    ws.send(data);
  });
});

// This route deals enables HTML5Mode by forwarding missing files to the index.html
app.use('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.use(bodyParser.json());

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port
server.listen(appEnv.port, function () {
  'use strict';
  // print a message when the server starts listening
  console.log('server starting on ' + appEnv.url);
});
