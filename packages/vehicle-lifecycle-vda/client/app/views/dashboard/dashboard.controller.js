angular.module('bc-vda')

.controller('DashboardCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.chain = [];
  $scope.transactions = [];

  $http.get('transactions').then(function(response, err) {
    if (err) {
      console.log(err);
    } else if (Array.isArray(response.data)) {
      var i = 138;

      $scope.chain = response.data.map(function(transaction) {
        var split = transaction.$class.split('.');
        var type = split[split.length - 1];
        var time = Date.parse(transaction.timestamp);

        $scope.transactions.push({
          timestamp: time,
          transaction_id: transaction.transactionId,
          transaction_type: type,
          transaction_submitter: type === 'SetupDemo' ? 'Liam Grace' : 'Arium Vehicles'
        });

        return {
          transID: transaction.transactionId,
          type: type,
          status: transaction.orderStatus,
          time: time
        };
      });

      $scope.chain.sort(function(t1, t2) {
        return t1.time - t2.time;
      })

      $scope.chain.map(function(transaction) {
        transaction.id = i++;
        return transaction;
      })
    }
  });

  // Websockets

  var placeOrder;
  var updateOrder;
  var destroyed = false;

  function openPlaceOrderWebSocket() {
    placeOrder = new WebSocket('ws://' + location.host + '/ws/placeorder');

    placeOrder.onopen = function() {
      console.log('placeOrder websocket open!');
      // Notification('PlaceOrder WebSocket connected');
    };

    placeOrder.onclose = function() {
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

      var order = JSON.parse(event.data);
      $scope.addBlock(order.transactionId, 'PlaceOrder', 'Arium Vehicles');
      $scope.$apply();
    }
  }

  function openUpdateOrderWebSocket() {
    updateOrder = new WebSocket('ws://' + location.host + '/ws/updateorderstatus');

    updateOrder.onopen = function() {
      console.log('updateOrder websocket open!');
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
      var status = JSON.parse(event.data);
      $scope.addBlock(status.transactionId, 'UpdateOrderStatus', 'Arium Vehicles', status.orderStatus);
      $scope.$apply();
    }
  }

  openPlaceOrderWebSocket();
  openUpdateOrderWebSocket();

  $scope.addBlock = function (tranactionId, type, submitter, status) {
    var id = $scope.chain[$scope.chain.length - 1].id + 1;
    $scope.chain.push({
      id: id,
      transID: tranactionId,
      type: type,
      status: status
    });
    $scope.transactions.push({
      timestamp: Date.now(),
      transaction_id: tranactionId,
      transaction_type: type,
      transaction_submitter: submitter
    });
  };

  $scope.$on('$destroy', function () {
    destroyed = true;
    if (placeOrder) {
      placeOrder.close();
    }
    if (updateOrder) {
      updateOrder.close();
    }
  });
}]);
