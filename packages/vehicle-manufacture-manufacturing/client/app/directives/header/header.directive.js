angular.module('bc-manufacturer')

.directive('bcManHeader', [function () {
	return {
		restrict: 'E',
		templateUrl: 'manufacturer/app/directives/header/header.html',
		link: function (scope, element, attrs) {

		}
	};
}])