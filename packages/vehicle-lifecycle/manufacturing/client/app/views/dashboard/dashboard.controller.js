angular.module('bc-manufacturer')

.controller('DashboardCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
  $scope.statuses = ['PLACED', 'SCHEDULED_FOR_MANUFACTURE', 'VIN_ASSIGNED', 'OWNER_ASSIGNED', 'DELIVERED'];

  $http.get('vehicles').then(function(response, err) {
    console.log(response);
    if (err) {
      console.log(err);
    } else if (response.data.error) {
      console.log(response.data.error.message);
    } else {
      console.log(response.data);
      if (Array.isArray(response.data)) {
        $scope.orders = response.data.map(function(o) {
          var order = {
            car: {
              id: o.orderId,
              name: o.vehicleDetails.modelType,
              serial: 'S/N ' + generateSN(),
              colour: o.vehicleDetails.colour
            },
            status: o.orderStatus
          };


          if (o.statusUpdates) {
            for (var i = 0; i < o.statusUpdates.length; ++i) {
              var update = o.statusUpdates[i];
              var timestamp = Date.parse(update.timestamp);

              if (update.orderStatus === $scope.statuses[0]) {
                order.placed = timestamp;
              } else if (update.orderStatus === $scope.statuses[1]) {
                order.manufacture = order.manufacture ? order.manufacture : {};
                order.manufacture.chassis = timestamp;
                order.manufacture.interior = timestamp;
                order.manufacture.paint = timestamp;
              } else if (update.orderStatus === $scope.statuses[2]) {
                order.manufacture = order.manufacture ? order.manufacture : {};
                order.manufacture.vinIssue = timestamp;
              } else if (update.orderStatus === $scope.statuses[3]) {
                order.manufacture = order.manufacture ? order.manufacture : {};
                order.manufacture.vinPrinting = timestamp;
              } else if (update.orderStatus === $scope.statuses[4]) {
                order.delivery = {
                  shipping: timestamp
                };
              }
            }
          }

          return order;
        });
        console.log($scope.orders);
      }
    }
  })

  // Websockets

  var placeOrder;
  var updateOrder;
  var destroyed = false;

  function openPlaceOrderWebSocket() {
    placeOrder = new WebSocket('ws://' + location.host + '/ws/placeorder');
    placeOrder.onopen = function () {
      console.log('placeOrder websocket open!');
      // Notification('PlaceOrder WebSocket connected');
    };

    placeOrder.onclose = function () {
      console.log('closed');
      // Notification('PlaceOrder WebSocket disconnected');
      if (!destroyed) {
        openPlaceOrderWebSocket();
      }
    }

    placeOrder.onmessage = function(event) {
      if (event.data === '__pong__') {
        return;
      }
      var newOrder = JSON.parse(event.data);
      $scope.orders.push({
        car: {
          id: newOrder.orderId,
          name: newOrder.vehicleDetails.modelType,
          serial: 'S/N ' + generateSN(),
          colour: newOrder.vehicleDetails.colour
        },
        status: $scope.statuses[0],
        placed: Date.now()
      })
      $scope.$apply()
      console.log($scope.orders);
    }
  }

  function openUpdateOrderWebSocket() {
    updateOrder = new WebSocket('ws://' + location.host + '/ws/updateorderstatus');

    updateOrder.onopen = function () {
      console.log('updateorderstatus websocket open!');
      // Notification('UpdateOrderStatus WebSocket connected');
    };

    updateOrder.onclose = function() {
      console.log('closed');
      // Notification('UpdateOrderStatus WebSocket disconnected');
      if (!destroyed) {
        openUpdateOrderWebSocket();
      }
    }

    updateOrder.onmessage = function(event) {
      if (event.data === '__pong__') {
        return;
      }
      var orderEvent = JSON.parse(event.data);
      for (var i = 0; i < $scope.orders.length; ++i) {
        var o = $scope.orders[i];
        if (o.car.id === orderEvent.order.orderId) {
          o.status = orderEvent.orderStatus;
          var timestamp = Date.parse(orderEvent.timestamp);

          if (orderEvent.orderStatus === $scope.statuses[1]) {
            o.manufacture = {
              chassis: timestamp,
              interior: timestamp,
              paint: timestamp
            };
          } else if (orderEvent.orderStatus === $scope.statuses[2]) {
            o.manufacture.vinIssue = timestamp;
          } else if (orderEvent.orderStatus === $scope.statuses[3]) {
            o.manufacture.vinPrinting = timestamp;
          } else if (orderEvent.orderStatus === $scope.statuses[4]) {
            o.delivery = {
              shipping: timestamp
            };
          }
        }
      }
      $scope.$apply();
    }
  }

  openPlaceOrderWebSocket();
  openUpdateOrderWebSocket();

  var generateVIN = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    function s1() {
      return Math.floor(Math.random() * 10);
    }
    return s4() + s4() + s4() + s4() + s1();
  }

  var generateSN = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    function s1() {
      return Math.floor(Math.random() * 10);
    }
    return s4() + s4() + s1() + s1() + s1();
  }

  var updateOrderStatus = function(status, count) {
    if (count === 2) {
      status.vin = generateVIN();
    }
    status.orderStatus = $scope.statuses[count];
    status.timestamp =  Date.now();
    updateOrder.send(JSON.stringify(status));
  }

  $scope.start = function(order) {
    var delay = 5000;
    var count = 1;

    var status = {
      vin: '',
      v5c: '1G1JF52F737316937',
      numberPlate: '',
      order: order.car.id
    };

    order.manufacture = {};

    $interval(function() {
      updateOrderStatus(status, count)
      count++;
    }, delay, $scope.statuses.length - 1);

  }

  $scope.$on('$destroy', function () {
    destroyed = true;
    if (placeOrder) {
      placeOrder.close();
    }
    if (updateOrder) {
      updateOrder.close();
    }
  });
}])

.filter('relativeDate', function() {
  return function(input, start) {
    if (input) {
      var diff = input - start;
      diff = diff / 1000
      diff = Math.round(diff);

      var result = '+' + diff +  ' secs'

      return result;
    }
  };
})
