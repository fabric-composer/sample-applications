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
angular.module('bc-vda')

.controller('DashboardCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.chain = [];
  $scope.transactions = [];

  var baseId = 138;

  var txUrl = '/transactions';
  var ignoreTxnsBefore;

  if(supports_html5_storage()) {
    try {
      ignoreTxnsBefore = localStorage.getItem('ignoreTxnsBefore');
      if (ignoreTxnsBefore) {
        ignoreTxnsBefore = Date.parse(ignoreTxnsBefore);
        txUrl = '/transactions?notBefore='+ignoreTxnsBefore;
      }
    } catch (err) {
      console.error('Local storage item not a date', err);
    }
  }

  $http.get(txUrl)
  .then(function(response, err) {
    if (err) {
      console.log(err);
    } else if (Array.isArray(response.data)) {

      $scope.chain = response.data.map(function(transaction) {
        var split = transaction.transactionType.split('.');
        var type = split[split.length - 1];
        var time = Date.parse(transaction.transactionTimestamp);

        let transactionSubmitter;
        let displayTransaction = false;
        let orderStatus = '';
        switch(type) {
          case 'SetupDemo':         transactionSubmitter = 'Admin';
                                    displayTransaction = true;
                                    break;

          case 'PlaceOrder':        transactionSubmitter = transaction.eventsEmitted[0].orderer.replace('resource:org.acme.vehicle_network.Person#', '');
                                    displayTransaction = true;
                                    break;

          case 'UpdateOrderStatus': transactionSubmitter = transaction.eventsEmitted[0].order.vehicleDetails.make.replace('resource:org.acme.vehicle_network.Manufacturer#', '');
                                    displayTransaction = true;
                                    orderStatus = transaction.eventsEmitted[0].orderStatus;
                                    break;
        }

        if (displayTransaction) {
          $scope.transactions.push({
            timestamp: time,
            transaction_id: transaction.transactionId,
            transaction_type: type,
            transaction_submitter: transactionSubmitter
          });
        }

        return {
          transID: transaction.transactionId,
          type: type,
          status: orderStatus,
          time: time,
          display_transaction: displayTransaction
        };
      });

      $scope.chain = $scope.chain.filter(el => el.display_transaction);

      $scope.chain.sort(function(t1, t2) {
        return t1.time - t2.time;
      })

      $scope.chain.map(function(transaction) {
        transaction.id = baseId++;
        return transaction;
      })
    }
  });

  // Websockets
  var destroyed = false;
  var websocket;
  function openWebSocket() {
    var wsUri = '';
    if (location.protocol === 'https:') {
      wsUri = 'wss://' + location.host;
    } else {
      wsUri = 'ws://' + location.hostname + ':' + location.port;
    }
    console.log(' Connecting to websocket', wsUri);
    var webSocketURL = wsUri;
    websocket = new WebSocket(webSocketURL);

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
      var caller = message.orderer ? message.orderer.replace('resource:org.acme.vehicle_network.Person#', '') : message.order.vehicleDetails.make.replace('resource:org.acme.vehicle_network.Manufacturer#', '');
      var status = message.order ? message.orderStatus : null;
      $scope.addBlock(message.eventId.split('#')[0], message.$class.replace('org.acme.vehicle_network.', '').replace('Event', ''), caller, status);
      $scope.$apply();
    }
  }

  openWebSocket();

  $scope.addBlock = function (tranactionId, type, submitter, status) {
    var id = baseId;

    if($scope.chain.length - 1 >= 0) {
      id = $scope.chain[$scope.chain.length - 1].id + 1;
    }

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
    if (websocket) {
      websocket.close();
    }
  });
}]);

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
