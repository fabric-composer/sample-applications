var express = require('express')
var controller = require('./updateOrderStatus')

var router = express.Router()

router.get('/', controller.get)
router.post('/', controller.post)

module.exports = router
