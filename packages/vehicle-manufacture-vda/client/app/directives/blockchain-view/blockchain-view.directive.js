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
angular.module('bc-vda')

.directive('bcView', ['$window', function ($window) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'regulator/app/directives/blockchain-view/blockchain-view.html',
    scope: {
      chain: '='
    },
    link: function (scope, element, attrs) {
      var container = d3.select(element[0]).selectAll('.bc-view-chain-container');
      var chart = container.selectAll('.bc-view-chain');

      scope.$watch('chain', function () {
        if (scope.chain.length) {
          console.log('update chart');
          updateChart();
        }
      }, true);

      var sizes = {
        width: 145,
        height: 145,
        padding: 30
      };

      function debouncer( func , timeout ) {
        var timeoutID , timeout = timeout || 200;
        return function () {
           var scope = this , args = arguments;
           clearTimeout( timeoutID );
           timeoutID = setTimeout( function () {
               func.apply( scope , Array.prototype.slice.call( args ) );
           } , timeout );
        }
     }

      angular.element($window).bind('resize', debouncer (function(){
        updateChart();
      }));

      function updateChart() {
        // calculate width of chain

        chart.transition().duration(1000).style('width', function() {
          var blocksWidth = (scope.chain.length * (sizes.width + sizes.padding));
          if (blocksWidth > container.node().clientWidth) {
            return blocksWidth + 'px';
          } else {
            return container.node().clientWidth + 'px';
          }
        });

        // calculate block positions
        var blocks = chart.selectAll('div.bc-view-block')
          .data(scope.chain);

        var newBlocks = blocks.enter()
          .append('div')
          .attr('class', 'bc-view-block')
          .style('width', 0)
          .style('height', 0)
          .style('top', function () {
            return chart.node().clientHeight / 2 + 'px';
          })
          .style('left', function (d, i) {
            return (i * (sizes.width + sizes.padding)) + (sizes.width / 2) + 'px';
          });

        // add connecting line
        newBlocks.append('div')
          .attr('class', 'bc-view-line')
          .style('opacity', 0);

        // add block text
        newBlocks.append('div')
          .attr('class', 'bc-view-block-blockid')
          .html(function (d) {
            return '<label class="block-label">'+'#'+ d.id + '</label>';
          })
          .style('opacity', 0);

        newBlocks.append('div')
          .attr('class', 'bc-view-block-transid')
          .html(function (d) {
            return '<label class="transactionDetails">TRANSACTION ID</label></br><span class="transactionDetails">' + d.transID + '</span>';
          })
          .style('opacity', 0);

        newBlocks.append('div')
          .attr('class', 'bc-view-block-type')
          .html(function (d) {
            return '<label class="transactionDetails">' + d.type + '</label></br><span class="transactionDetails">' + (d.status ? d.status : '') + '</span>';
          })
          .style('opacity', 0);

        // animate the box's position
        newBlocks.transition().duration(1000)
          .style('width', sizes.width + 'px')
          .style('height', sizes.height + 'px')
          .style('top', function () {
            return ((chart.node().clientHeight / 2) - (sizes.height / 2)) + 'px';
          })
          .style('left', function (d, i) {
            return (i * (sizes.width + sizes.padding)) + 0 + 'px';
          });

        newBlocks.selectAll('div').transition().delay(1000).duration(1000)
          .style('opacity', 1);
      }
    }
  };
}]);
