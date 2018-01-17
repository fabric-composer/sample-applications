angular.module('bc-manufacturer', [
  'bc-vehicle-table',
  'ui.router',
  'ui-notification'
])

.config(function ($urlRouterProvider, $stateProvider, $locationProvider, NotificationProvider) {
  'use strict';

  $locationProvider.html5Mode({
    enabled: true
  });

  $urlRouterProvider
    .otherwise('/manufacturer-dashboard');

  $stateProvider
    .state('manufacturer-dashboard', {
      url: '/manufacturer-dashboard',
      templateUrl: 'manufacturer/app/views/dashboard/dashboard.html',
      controller: 'DashboardCtrl'
    });

  NotificationProvider.setOptions({
    delay: 5000,
    startTop: 10,
    startRight: 10,
    verticalSpacing: 20,
    horizontalSpacing: 20,
    positionX: 'right',
    positionY: 'bottom'
  });
})

.controller('AppCtrl', [function () {
  'use strict';
}]);
