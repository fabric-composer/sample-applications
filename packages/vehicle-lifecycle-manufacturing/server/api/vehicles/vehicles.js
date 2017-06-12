var request = require('request')
var config = require('config');

var composerBaseURL = process.env.COMPOSER_BASE_URL || config.get('composerRestServerBaseURL');
var endpoint = composerBaseURL + '/api/Order'

var get = (req, res) => {
  console.log('What is endpoint',endpoint);
  request.get({
    url: endpoint,
    json: true
  }, (err, response, body) => {
    res.send(body)
  })
}

module.exports = {
  get: get
}
