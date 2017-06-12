angular.module('bc-view', [])

.directive('bcView', [function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/directives/blockchain-view/blockchain-view.html',
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
				width: 160,
				height: 160,
				padding: 30
			};

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
						console.log(i);
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
						return '<label>Block # ' + d.id + '</label>';
					})
					.style('opacity', 0);
				
				newBlocks.append('div')
					.attr('class', 'bc-view-block-transid')
					.html(function (d) {
						return '<label>Transaction ID</label></br>' + d.transID;
					})
					.style('opacity', 0);
				
				newBlocks.append('div')
					.attr('class', 'bc-view-block-type')
					.text(function (d) {
						return d.type;
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