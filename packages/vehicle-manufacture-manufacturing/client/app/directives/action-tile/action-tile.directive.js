angular.module('bc-manufacturer')

.directive('bcManActionTile', [function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'manufacturer/app/directives/action-tile/action-tile.html',
		scope: {
			title : '=',
			description : '=',
			action : '='
		}
	};
}]);
