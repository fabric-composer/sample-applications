angular.module('bc-manufacturer')

.controller('InventoryVehicleCtrl', ['$scope', '$state', function ($scope, $state) {
	$scope.vehicle = [{
		engine_number: '1529_4162_9013',
		model: 'Priat',
		color: 'Blue',
		vin: '10.61.122.65',
		status: 'Filled Order',
		est_date: '2017-09-20'
	}];

	$scope.chain = [{
		id: 138,
		transID: 13245,
		type: 'Transaction Type Details'
	}];

	$scope.addBlock = function () {
		$scope.chain.push({
			id: 138,
			transID: 13245,
			type: 'Transaction Type Details'
		});
	};

	console.log($scope.vehicle);
}]);