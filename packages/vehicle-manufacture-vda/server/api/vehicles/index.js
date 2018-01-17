var express = require('express')
var controller = require('./vehicles')

var router = express.Router()

router.get('/', controller.get)

module.exports = router
