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
var request = require('request')
var config = require('config');

var get = (req, res) => {

  var restServerConfig = req.app.get('config').restServer;
  var composerBaseURL = restServerConfig.httpURL;
  var placeOrderEndpoint = composerBaseURL + '/PlaceOrder';

  var filter = {};

  var notBefore = req.query.notBefore;

  if(notBefore) {
    var date = new Date();
    date.setTime(notBefore);
    filter = {
      "where": {
        "timestamp": {
          "gt": date.toISOString()
        }
      }
    }
  }

  var updateOrderEndpoint = composerBaseURL + '/UpdateOrderStatus'

  request.get({
    url: `${placeOrderEndpoint}?filter=${JSON.stringify(filter)}`,
    json: true
  }, (err, response, placedOrders) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    request.get({
      url: `${updateOrderEndpoint}?filter=${JSON.stringify(filter)}`,
      json: true
    }, (err, response, updates) => {
      if (Array.isArray(placedOrders) && Array.isArray(updates)) {
        placedOrders.forEach((order) => {
            order.statusUpdates = [];
            for (var i = updates.length - 1; i >= 0; i--) {
              var update = updates[i];
              var updatingId;
              if (typeof update.order === 'string') {
                updatingId = update.order.replace('resource:org.acme.vehicle_network.Order#', '');
              } else if (typeof update.order === 'object') {
                // order has been resolved
                updatingId = update.order.orderId;
              }

              if (updatingId === order.orderId) {
                order.statusUpdates.push(update);
                updates.splice(i, 1);
              }
            }
            if (order.statusUpdates.length === 0) {
              delete order.statusUpdates;
            }
        });
        res.send(placedOrders)
      } else {
        res.status(500).send('Response from rest server was not in format expected.')
      }
    });
  })
}

module.exports = {
  get: get
}
