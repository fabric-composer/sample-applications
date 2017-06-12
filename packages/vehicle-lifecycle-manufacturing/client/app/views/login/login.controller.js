angular.module('bc-manufacturer')

.controller('LoginCtrl', ['$scope', '$state', function ($scope, $state) {
	$scope.login = function() {
		$state.go('dashboard');
	}
}]);