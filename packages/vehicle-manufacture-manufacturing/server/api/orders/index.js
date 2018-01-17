var express = require('express')
var controller = require('./orders')

var router = express.Router()

router.get('/', controller.get)

module.exports = router
