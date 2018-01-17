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

      let destroyed = false;
      let websocket;

      function openWebSocket() {
        var webSocketURL = 'ws://' + location.host() + ':' + location.port();
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
          if (message.$class = 'org.acme.vehicle_network.UpdateOrderStatusEvent') {
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
