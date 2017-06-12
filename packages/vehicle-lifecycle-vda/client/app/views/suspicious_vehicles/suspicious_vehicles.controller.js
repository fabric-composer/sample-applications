angular.module('bc-vda')

.controller('SuspiciousVehiclesCtrl', ['$scope', '$http', function ($scope, $http) {

  var generateID = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
  }

  $http.get('vehicles').then(function(response) {
    console.log(response);

    $scope.vehicles = response.data.filter(function(vehicle) {
      return vehicle.suspiciousMessage;
    });

    $scope.vehicles = $scope.vehicles.map(function(vehicle) {
      if (vehicle.suspiciousMessage) {
        var details = vehicle.vehicleDetails;
        var colour = details.colour.charAt(0).toUpperCase() + details.colour.slice(1);

        var transactionData = []

        if (vehicle.logEntries) {
          for (var i = 0; i < vehicle.logEntries.length; ++i) {
            var log = vehicle.logEntries[i];
            var split = log.buyer.split('#');
            var buyer = split[split.length - 1];
            buyer = buyer.charAt(0).toUpperCase() + buyer.slice(1);

            transactionData.push({
              timestamp: log.timestamp,
              transaction: generateID(),
              car_owner: buyer
            });
          }
        }

        return {
          vehicle: details.make + ' ' + details.modelType + ' - ' + colour,
          vin_number: vehicle.vin,
          notification: vehicle.suspiciousMessage,
          transactionData: transactionData
        };
      }
    })
  });

  // $scope.vehicles = [{
  //   vehicle: 'Arium Nova - OU12 TTW Royal Purple',
  //   vin_number: '1D7HA18N68S510624',
  //   notification: 'Ownership Transfer Suspicion',
  //   transactionData: [{
  //     timestamp: '1493125035616',
  //     transaction: 'Change owner',
  //     car_owner: 'Dan'
  //   }]
  // },
  // {
  //   vehicle: 'Arium Nova - OU12 TTW Royal Purple',
  //   vin_number: '1D7HA18N68S510624',
  //   notification: 'Ownership Transfer Suspicion',
  //
  // },
  // {
  //   vehicle: 'Arium Nova - OU12 TTW Royal Purple',
  //   vin_number: '1D7HA18N68S510624',
  //   notification: 'Ownership Transfer Suspicion',
  //
  // },
  // {
  //   vehicle: 'Arium Nova - OU12 TTW Royal Purple',
  //   vin_number: '1D7HA18N68S510624',
  //   notification: 'Ownership Transfer Suspicion'
  // },
  // {
  //   vehicle: 'Arium Nova - OU12 TTW Royal Purple',
  //   vin_number: '1D7HA18N68S510624',
  //   notification: 'Ownership Transfer Suspicion'
  // },
  // {
  //   vehicle: 'Arium Nova - OU12 TTW Royal Purple',
  //   vin_number: '1D7HA18N68S510624',
  //   notification: 'Ownership Transfer Suspicion'
  // },
  // {
  //   vehicle: 'Arium Nova - OU12 TTW Royal Purple',
  //   vin_number: '1D7HA18N68S510624',
  //   notification: 'Ownership Transfer Suspicion'
  // },
  // {
  //   vehicle: 'Arium Nova - OU12 TTW Royal Purple',
  //   vin_number: '1D7HA18N68S510624',
  //   notification: 'Ownership Transfer Suspicion'
  // }]

}]);
