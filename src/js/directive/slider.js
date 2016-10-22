// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('dribehanceSlider', function($rootScope, $interval, $timeout) {
	return {
		restrict: 'E',
		templateUrl: "templates/slider.html",
		scope: {
			banners: "="
		},
		link: function(scope, element, attrs) {
			$(element).css({
				display: "block",
				height: $(window).height()
			})
			scope.staticImageUrl = $rootScope.staticImageUrl;
			scope.$on("onRepeatDone", function() {
				var interval_timer = $interval(function() {
					if ($('#slides').superslides) {
						$interval.cancel(interval_timer);
						$('#slides').superslides({
							animation: 'fade',
							play: 2500
						});
					}
				}, 100)
			})
		}
	};
});