/*
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
angular.module('bc-manufacturer')

.controller('DashboardCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
  $scope.statuses = ['PLACED', 'SCHEDULED_FOR_MANUFACTURE', 'VIN_ASSIGNED', 'OWNER_ASSIGNED', 'DELIVERED'];

  var orderUrl = '/orders';
  var ignoreTxnsBefore;

  if(supports_html5_storage()) {
    try {
      ignoreTxnsBefore = localStorage.getItem('ignoreTxnsBefore');
      if (ignoreTxnsBefore) {
        ignoreTxnsBefore = Date.parse(ignoreTxnsBefore);
        orderUrl = '/orders?notBefore='+ignoreTxnsBefore;
      }
    } catch (err) {
      console.error('Local storage item not a date', err);
    }
  }

  $http.get(orderUrl).then(function(response, err) {
    if (err) {
      console.log(err);
    } else if (response.data.error) {
      console.log(response.data.error.message);
    } else {
      if (Array.isArray(response.data)) {
        $scope.orders = response.data.map(function(o) {
          var order = {
            car: {
              id: o.orderId,
              name: o.vehicleDetails.modelType,
              serial: 'S/N ' + generateSN(),
              colour: o.vehicleDetails.colour
            },
            configuration: {
              trim: o.options.trim,
              interior: o.options.interior,
              colour: o.vehicleDetails.colour,
              extras: o.options.extras
            },
            placed: Date.parse(o.timestamp)
          };

          order.status = $scope.statuses[0];

          if (o.statusUpdates) {
            o.statusUpdates.sort(function (a,b) {
              if (Date.parse(a.timestamp) < Date.parse(b.timestamp))
                return -1;
              if (Date.parse(a.timestamp) > Date.parse(b.timestamp))
                return 1;
              return 0;
            })
            order.status = o.statusUpdates[o.statusUpdates.length-1].orderStatus;
            for (var i = 0; i < o.statusUpdates.length; ++i) {
              var update = o.statusUpdates[i];
              var timestamp = Date.parse(update.timestamp);
              if (update.orderStatus === $scope.statuses[1]) {
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

        $scope.orders.sort((a, b) => {
          if (a.placed < b.placed) {
            return 1;
          } else if (a.placed > b.placed) {
            return -1;
          }
          return 0;
        })
      }
    }
  })

  // Websockets

  var placeOrder;
  var updateOrder;
  var destroyed = false;

  function openWebSocket() {
    var wsUri = '';
    if (location.protocol === 'https:') {
      wsUri = 'wss://' + location.host;
    } else {
      wsUri = 'ws://' + location.hostname + ':' + location.port;
    }
    console.log(' Connecting to websocket', wsUri);
    var webSocketURL = wsUri;
    var websocket = new WebSocket(webSocketURL);
    websocket.onopen = function () {
      console.log('Websocket is open');
    }

    websocket.onclose = function () {
      console.log('Websocket closed');
      if (!destroyed) {
        openWebSocket();
      }
    }

    websocket.onmessage = function (event) {
      if (ignoreTxnsBefore && new Date().getTime() < ignoreTxnsBefore) {
        return;
      }

      var message = JSON.parse(event.data);
      if(message.$class === 'org.acme.vehicle_network.PlaceOrderEvent') {
        handlePlaceOrderEvent(message);
      } else if (message.$class === 'org.acme.vehicle_network.UpdateOrderStatusEvent') {
        handleUpdateOrderEvent(message);
      }
    }
  }

  function handlePlaceOrderEvent(newOrder) {
    $scope.orders.unshift({
      car: {
        id: newOrder.orderId,
        name: newOrder.vehicleDetails.modelType,
        serial: 'S/N ' + generateSN(),
        colour: newOrder.vehicleDetails.colour
      },
      configuration: {
        trim: newOrder.options.trim,
        interior: newOrder.options.interior,
        colour: newOrder.vehicleDetails.colour,
        extras: newOrder.options.extras
      },
      status: $scope.statuses[0],
      placed: Date.now()
    })
    $scope.$apply();
  }

  function handleUpdateOrderEvent(orderEvent) {
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

  openWebSocket();

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

    $http.post('updateOrderStatus', status).then(function(response, err) {
      if(err) {
        console.log(err.message);
      }
    });

  }

  $scope.start = function(order) {
    var delay = 5000;
    var count = 1;

    var status = {
      vin: '',
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

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}