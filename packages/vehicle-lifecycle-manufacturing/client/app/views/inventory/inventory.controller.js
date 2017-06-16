angular.module('bc-manufacturer')

.controller('InventoryCtrl', ['$scope', '$state', function ($scope, $state) {

	console.log($state.current);
	if ($state.current.name === 'inventory') {
		$state.go('inventory.list');
	}

	$scope.vehicles = [{
		engine_number: '1529_4162_9013',
		model: 'Priat',
		color: 'Blue',
		vin: '10.61.122.65',
		status: 'Filled Order',
		est_date: '2017-09-20'
		}, {
		engine_number: '1529_4162_9014',
		model: 'Priat',
		color: 'Yellow',
		vin: '10.78.822.65',
		status: 'Filled Order',
		est_date: '2017-01-27'
		}, {
		engine_number: '1529_4162_9013',
		model: 'Priat',
		color: 'Blue',
		vin: '10.61.122.65',
		status: 'Filled Order',
		est_date: '2017-09-20'
		}, {
		engine_number: '1529_4162_9013',
		model: 'Priat',
		color: 'Blue',
		vin: '10.61.122.65',
		status: 'Filled Order',
		est_date: '2017-09-20'
		}, {
		engine_number: '1529_4162_9014',
		model: 'Priat',
		color: 'Yellow',
		vin: '10.78.822.65',
		status: 'Filled Order',
		est_date: '2017-01-27'
		}, {
		engine_number: '1529_4162_9013',
		model: 'Priat',
		color: 'Blue',
		vin: '10.61.122.65',
		status: 'Filled Order',
		est_date: '2017-09-20'
		}, {
		engine_number: '1529_4162_9014',
		model: 'Priat',
		color: 'Yellow',
		vin: '10.78.822.65',
		status: 'Filled Order',
		est_date: '2017-01-27'
	}];

	$scope.selectVehicle = function (index) {
		console.log('select', index);
		$scope.vehicle = [$scope.vehicles[index]];
	};
}]);
