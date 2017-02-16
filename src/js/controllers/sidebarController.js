// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("sidebarController", function($scope, $routeParams, $location, errorServices, toastServices, localStorageService, config) {
	$scope.highlight = function(item) {
		if (item == $location.path() || item == $scope.active) {
			return true;
		}
		return false;
	}
	$scope.go = function(path) {
		$location.path(path);
	}
})