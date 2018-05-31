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

.directive('bcVdaHeader', ['$location', '$http', function (location, $http) {
  return {
    restrict: 'E',
    templateUrl: 'regulator/app/directives/header/header.html',
    link: function (scope) {
      scope.registered_vehicles = 0;
      scope.vin_assigned = 0;
      scope.v5c_issued = 0;

      var vehicleUrl = '/vehicles';
      var ignoreTxnsBefore;

      if(supports_html5_storage()) {
        try {
          ignoreTxnsBefore = localStorage.getItem('ignoreTxnsBefore');
          if (ignoreTxnsBefore) {
            ignoreTxnsBefore = Date.parse(ignoreTxnsBefore);
            vehicleUrl = '/vehicles?notBefore='+ignoreTxnsBefore;
          }
        } catch (err) {
          console.error('Local storage item not a date', err);
        }
      }

      $http.get(vehicleUrl).then(function(response) {

        if (response && response.data) {
            scope.registered_vehicles = response.data.registered_vehicles;
            scope.vin_assigned = response.data.vin_assigned;
            scope.v5c_issued= response.data.v5c_issued;
        }
      });

      scope.isActive = function(route) {
        return route === location.path();
      }

      var destroyed = false;
      var websocket;

      function openWebSocket() {
        var wsUri = '';
        if (window.location.protocol === 'https:') {
          wsUri = 'wss://' + window.location.host;
        } else {
          wsUri = 'ws://' + window.location.hostname + ':' + window.location.port;
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
          if (message.$class === 'org.acme.vehicle_network.UpdateOrderStatusEvent') {
            if (message.orderStatus === 'VIN_ASSIGNED') {
              scope.registered_vehicles++;
              scope.vin_assigned++;
            } else if (message.orderStatus === 'OWNER_ASSIGNED') {
              scope.v5c_issued++;
            }
          }
        }
      }
      openWebSocket();

      scope.$on('$destroy', function() {
        destroyed = true;
        if (websocket) {
          websocket.close();
        }
      })
    }
  };
}])
