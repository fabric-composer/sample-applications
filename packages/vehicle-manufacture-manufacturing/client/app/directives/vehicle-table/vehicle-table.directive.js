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
angular.module('bc-vehicle-table', [])

.directive('bcVehicleTable', [function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'manufacturer/app/directives/vehicle-table/vehicle-table.html',
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
