angular.module('bc-vda')

.directive('bcRecentTransactionTable', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/directives/recent-transaction-table/recent-transaction-table.html',
    scope: {
      transactions: '='
    },
    controller: ['$scope', function($scope) {
      $scope.order = {
        key: 'timestamp',
        reverse: true
      }
    }]
  };
}]);
