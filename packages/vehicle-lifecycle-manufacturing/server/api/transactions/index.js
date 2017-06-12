var express = require('express')
var controller = require('./transactions')

var router = express.Router()

router.post('/', controller.post)

module.exports = router
