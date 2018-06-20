/*
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var express = require('express'),
  path = require('path'),
  expressLess = require('express-less'),
  cfenv = require('cfenv'),
  WebSocket = require('ws'),
  http = require('http'),
  url = require('url'),
  config = require('config');

// create a new express server
var app = express();
var server = http.createServer(app);

// static - all our js, css, images, etc go into the assets path
app.use('/regulator/app', express.static(path.join(__dirname, '../client', 'app')));
app.use('/regulator/bower_components', express.static(path.join(__dirname, '../client', 'bower_components')));
app.use('/regulator/assets', express.static(path.join(__dirname, '../client', 'assets')));
app.use('/regulator/data', express.static(path.join(__dirname, '../client', 'data')));

app.use('/regulator/less/stylesheets/*', function (req, res, next) {
    var url = req.originalUrl;
    var relativePath = url.replace("/regulator/less/stylesheets/", "");
    var lessCSSFile = path.join('../client', relativePath);
    req.url = lessCSSFile;
    var expressLessObj = expressLess(__dirname, {
        compress: true,
        debug: true
    });
    expressLessObj(req, res, next);
});

require('./routes')(app);

var restServerConfig;

try {
  restServerConfig = Object.assign({}, config.get('restServer'));
} catch (err) {
  if (!process.env.REST_SERVER_CONFIG) {
    throw new Error('Cannot get restServer from config, the config file may not exist. Provide this file or a value for REST_SERVER_CONFIG');
  }
  restServerConfig = {};
}

if (process.env.REST_SERVER_CONFIG ) {
  try {
    var restServerEnv = JSON.parse(process.env.REST_SERVER_CONFIG);
    restServerConfig = Object.assign(restServerConfig, restServerEnv); // allow for them to only specify some fields
  } catch (err) {
    console.log(err.message);
    console.error('Error getting rest config from env vars, using default');
  }
}
app.set('config', {
  restServer: restServerConfig
});

var wss = new WebSocket.Server({ server: server });
wss.on('connection', function (ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  console.log('client connected', location.pathname);
  var remoteURL = restServerConfig.httpURL + location.pathname;
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
  remote.on('error', function (data) {
    console.log('AN ERROR OCCURED: ', data);
    ws.close();
  });
});

// This route deals enables HTML5Mode by forwarding missing files to the index.html
app.use('/*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});


// start server on the specified port
server.listen(6001, function () {
  'use strict';
  // print a message when the server starts listening
  console.log('server starting on http://localhost:6001');
});
