// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("stepsPublishController", function($scope, $location, $window, $timeout, $route, userServices, errorServices, toastServices, localStorageService, config) {
	$scope.input = {};
	$scope.input.step_status = "1";
	$scope.$watch("input.step_status", function(n, o) {
		if (n == undefined) {
			return;
		};
		$scope.query_steps();
	});
	$scope.query_steps = function() {
		$scope.steps = [];
		toastServices.show();
		userServices.query_steps({
			status: $scope.input.step_status
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.steps = data.Result.Experiences;
				$scope.steps_message = $scope.steps.length == 0 ? "暂无经历" : "";
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
	$scope.edit_step = function(id, e) {
		e.preventDefault();
		e.stopPropagation();
		var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/#/edit_step?id=" + id;
		$window.open(url);
	}
	$scope.remove_step = function(id, e) {
		e.preventDefault();
		e.stopPropagation();
		$scope.confirm.content = "Delete step ?";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			userServices.remove_step({
				experience_id: id
			}).then(function(data) {
				toastServices.hide()
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					errorServices.autoHide(data.message);
					$timeout(function() {
						$route.reload();
					}, 2000)
				} else {
					errorServices.autoHide(data.message);
				}
			})
		}
	}
})