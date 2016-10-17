// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('sidebar', function($rootScope, $timeout, config) {
	return {
		restrict: 'E',
		templateUrl: "templates/sidebar.html",
		scope: {
			active: "=",
			user: "=",
			go: "&"
		},
		link: function(scope, element, attrs) {
			scope.staticImageUrl = config.imageUrl;
			// scope.user = $rootScope.user;
			// scope.go = $rootScope.go;
		}
	};
});