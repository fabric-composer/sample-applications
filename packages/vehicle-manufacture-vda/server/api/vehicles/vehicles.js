var request = require('request');
var config = require('config');


var get = (req, res) => {

  var restServerConfig = req.app.get('config').restServer;
  var composerBaseURL = restServerConfig.httpURL;
  var endpoint = composerBaseURL + '/UpdateOrderStatus';
  var filter = {"where": {
                  "or": [
                    {"orderStatus": "VIN_ASSIGNED"},
                    {"orderStatus": "OWNER_ASSIGNED"}
                  ]}
                } // We want only the transactions that relate to making a vehicle or giving a v5c
  

  var notBefore = req.query.notBefore;

  if(notBefore) {
    var date = new Date();
    date.setTime(notBefore);
    try {
      filter = {
        "where": {
          "and": [{
            "timestamp": {
              "gt": date.toISOString()
            }
          }, {
            "or": [{
              "orderStatus": "VIN_ASSIGNED"
            }, {
              "orderStatus": "OWNER_ASSIGNED"
            }]
          }]
        }
      }
    } catch (err) {
      throw new Error('Invalid timestamp sent', err);
    }
  }
  request.get({
    url: `${endpoint}?filter=${JSON.stringify(filter)}`,
    json: true
  }, (err, response, body) => {

    var data = {
      registered_vehicles: 0,
      vin_assigned: 0,
      v5c_issued: 0
    }
    body.forEach((resp) => {
      if (resp.orderStatus === 'VIN_ASSIGNED') {
        data.registered_vehicles++;
        data.vin_assigned++;
      } else {
        data.v5c_issued++;
      }
    })
    res.send(data)
  })
}

module.exports = {
  get: get
}
