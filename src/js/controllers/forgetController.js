// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("forgetController", function($scope, $rootScope, $routeParams, $route, $location, $window, $timeout, userServices, errorServices, toastServices, localStorageService, config) {
	if ($rootScope.is_signin() || !$routeParams.token) {
		$location.path("index").search("token", null).replace();
		return;
	}
	$scope.input = {
		password_1: "",
		password_2: ""
	}
	$scope.forget_action = function() {
		if ($scope.input.password_1 != $scope.input.password_2) {
			errorServices.autoHide("twice password is different");
			return;
		}
		toastServices.show();
		userServices.reset({
			password: $scope.input.password_1,
			token: $routeParams.token
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				$timeout(function() {
					$location.path("index").search("token", null).replace();
				}, 2000)
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
});