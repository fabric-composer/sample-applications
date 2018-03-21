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
