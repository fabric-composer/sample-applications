var request = require('request')
var config = require('config');

var composerBaseURL = process.env.COMPOSER_BASE_URL || config.get('composerRestServerBaseURL');
var endpoint = composerBaseURL + '/api/system/transactions'

var post = (req, res) => {
  request.post({
    url: endpoint,
    json: true,
    body: req.body
  }, (err, response, body) => {
    res.send(body)
  })
}

module.exports = {
  post: post
}
