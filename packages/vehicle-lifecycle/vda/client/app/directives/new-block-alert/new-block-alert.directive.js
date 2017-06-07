angular.module('bc-vda')

.directive('bcNewBlockAlert', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/directives/new-block-alert/new-block-alert.html',
    scope: {
      chain: '='
    },
    link: function (scope, element, attrs) {

      var container = d3.select(element[0]).selectAll('.bc-new-block-alert-container');
      scope.$watch('chain', function () {
        if (scope.chain.length) {
          addAlert();
        }
      }, true);

      function addAlert() {
        //fade out any current alerts and fade in new alert
        var alerts = container.selectAll('div.bc-view-alert')
          .data(scope.chain);

        alerts.transition().duration(1000)
          .style('opacity', 0)
          .remove();

        var newAlert = alerts.enter()
          .filter(function(d,i) { return i === (scope.chain.length -1)})
          .append('div')
          .attr('class', 'bc-view-alert')

        newAlert.append('div')
          .attr('class', 'bc-view-alert-text')
          .html(function(d) {
            return '<img class="bc-vda-new-block" src="assets/images/new_block.svg"/>'+
                 '<p class="bc-vda-new-block-title">NEW TRANSACTION</p>'+
                 '<p class="bc-vda-new-block-id">#'+d.id+'</p>'+
                 '<p class="bc-vda-new-block-new-vehicle-order">'+d.type+'</p>'
          })
          .style('opacity', 0);

        newAlert.selectAll('div').transition().delay(1000).duration(1000)
          .style('opacity', 1);
      }
    }
  };
}]);
