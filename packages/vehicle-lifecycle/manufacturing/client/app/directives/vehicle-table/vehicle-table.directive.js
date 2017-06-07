angular.module('bc-vehicle-table', [])

.directive('bcVehicleTable', [function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/directives/vehicle-table/vehicle-table.html',
		scope: {
			vehicles : '=',
			vehicleSelect: "&",
			list: '='
		},
		controller: ['$scope', function($scope){
			$scope.order = {
				key: 'engine_number',
				reverse : false
			};

			$scope.orderBy = function(key) {
				if ($scope.order.key === key) {
					$scope.order.reverse = !$scope.order.reverse
				} else {
					$scope.order.key = key
				}
			};
		}]
	};
}]);
