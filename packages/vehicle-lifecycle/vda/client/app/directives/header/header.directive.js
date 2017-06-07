angular.module('bc-vda')

.directive('bcVdaHeader', ['$location', '$http', function (location, $http) {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/header/header.html',
    link: function (scope) {
      scope.registered_vehicles = 0;
      scope.vin_assigned = 0;
      scope.v5c_issued = 0;
      scope.suspicious_vehicles = 0;

      $http.get('/vehicles').then(function(response) {
        console.log(response);

        if (response && response.data) {
          for (var i = 0; i < response.data.length; ++i) {
            var vehicle = response.data[i];

            scope.registered_vehicles++;

            if (vehicle.vehicleDetails.vin) {
              scope.vin_assigned++;
            }

            if (vehicle.owner) {
              scope.v5c_issued++;
            }

            if (vehicle.suspiciousMessage) {
              scope.suspicious_vehicles++;
            }
          }
        }
      });

      scope.isActive = function(route) {
        return route === location.path();
      }
    }
  };
}])
