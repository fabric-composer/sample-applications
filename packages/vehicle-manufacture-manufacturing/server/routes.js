module.exports = function (app) {
  'use strict'

  app.use('/orders', require('./api/orders'))
  app.use('/updateOrderStatus', require('./api/updateOrderStatus'))
}
