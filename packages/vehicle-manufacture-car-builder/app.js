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
  WebSocket = require('ws'),
  http = require('http'),
  url = require('url'),
  config = require('config');


// create a new express server
var app = express();
var server = http.createServer(app);

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
    throw new Error('REST_SERVER_CONFIG invalid');
  }
}

if (!restServerConfig.hasOwnProperty('webSocketURL') || !restServerConfig.hasOwnProperty('httpURL')) {
  throw new Error('The configuration for the rest server is invalid.')
}

app.get('/assets/config.json', (req, res, next) => {
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
