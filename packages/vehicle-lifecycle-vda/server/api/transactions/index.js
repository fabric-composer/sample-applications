var express = require('express')
var controller = require('./transactions')

var router = express.Router()

router.get('/', controller.get)

module.exports = router
