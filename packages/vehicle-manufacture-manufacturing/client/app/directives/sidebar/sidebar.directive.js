angular.module('bc-manufacturer')

.directive('bcManSidebar', [function () {
  return {
    restrict: 'E',
    templateUrl: 'manufacturer/app/directives/sidebar/sidebar.html',
    link: function (scope, element, attrs) {

    }
  };
}])
