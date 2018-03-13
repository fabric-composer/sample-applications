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
var request = require('request');
var config = require('config');

var get = (req, res) => {

  var restServerConfig = req.app.get('config').restServer;
  var composerBaseURL = restServerConfig.httpURL;
  var endpoint = composerBaseURL + '/system/historian'

  request.get({
    url: endpoint,
    json: true
  }, (err, response, body) => {
    if (Array.isArray(body)) {
      body = body.filter((transaction) => {
        var time = Date.parse(transaction.transactionTimestamp);
        if (req.query.notBefore && time < req.query.notBefore) {
          return false;
        }
        return true;
      });

      res.send(body)
    } else {
      res.status(500).send('Error from rest server. Body not array');
    }
  })
}

module.exports = {
  get: get
}
