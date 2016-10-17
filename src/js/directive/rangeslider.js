// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('rangeslider', function($timeout) {
	return {
		restrict: 'E',
		templateUrl: "../templates/rangeslider.html",
		scope: {
			max: "=",
			title: "="
		},
		link: function(scope, element, attrs) {
			// function body
			var point = $(element).find(".range-point");
			var inputRange = $('input[type="range"]').rangeslider({

				// Feature detection the default is `true`.
				// Set this to `false` if you want to use
				// the polyfill also in Browsers which support
				// the native <input type="range"> element.
				polyfill: false,

				// Default CSS classes
				rangeClass: 'rangeslider',
				disabledClass: 'rangeslider--disabled',
				horizontalClass: 'rangeslider--horizontal',
				verticalClass: 'rangeslider--vertical',
				fillClass: 'rangeslider__fill',
				handleClass: 'rangeslider__handle',

				// Callback function
				onInit: function() {},

				// Callback function
				onSlide: function(position, value) {
					point.css({
						left: position + 15,
					});
					scope.$apply(function() {
						scope.value = value
					})
				},

				// Callback function
				onSlideEnd: function(position, value) {
					scope.$emit("slideEnd", value)
				}
			});
			$timeout(function() {
				inputRange.attr({
					max: scope.max
				}).rangeslider("update", true);
			}, 100)
		}
	};
});