// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("coursesController", function($scope, $rootScope, user, userServices, errorServices, toastServices, localStorageService, config) {
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
		$scope.page.user_id = $rootScope.user.user_id;
		userServices.query_courses_by_user_id($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.courses = $scope.courses.concat(data.Result.Courses.list);
				$scope.no_more = $scope.courses.length == data.Result.Courses.totalRow ? true : false;
			} else {
				errorServices.autoHide("服务器错误");
			}
			if ($scope.no_more) {
				$scope.page.message = $scope.courses.length + " records found";
			}
			$scope.page.pn++;
		})

	};
	$scope.loadMore();
})