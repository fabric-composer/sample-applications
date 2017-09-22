var request = require('request');
var config = require('config');

var composerBaseURL = process.env.COMPOSER_BASE_URL || config.get('composerRestServerBaseURL');
var endpoint = composerBaseURL + '/api/system/historian'

var get = (req, res) => {
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
