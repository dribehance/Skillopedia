// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("showController", function($scope, $routeParams, $rootScope, user, userServices, errorServices, toastServices, localStorageService, config) {
	if (!$routeParams.user_id) {
		$rootScope.back();
		return;
	}
	if ($routeParams.user_id) {
		$scope.user_id = $routeParams.user_id
	}
	$scope.courses = [];
	$scope.page = {
		pn: 1,
		page_size: 10,
		message: "Load More",
		latitude: "0",
		longitude: "0",
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "loading...";
		$scope.page.user_id = $routeParams.user_id;
		userServices.query_courses_by_user_id($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.courses = $scope.courses.concat(data.Result.Courses.list);
				$scope.no_more = $scope.courses.length == data.Result.Courses.totalRow ? true : false;
			} else {
				errorServices.autoHide("Server error");
			}
			if ($scope.no_more) {
				$scope.page.message = $scope.courses.length + " records found";
			}
			$scope.page.pn++;
		})

	};
	$scope.loadMore();
	// 用户信息
	toastServices.show();
	userServices.query_basicinfo_id({
		user_id: $routeParams.user_id
	}).then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.guest = data.Result.UserInfo
		} else {
			errorServices.autoHide(data.message);
		}
	})
})