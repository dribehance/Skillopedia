// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("favouriteController", function($scope, $route, $timeout, userServices, errorServices, toastServices, localStorageService, config) {
	$scope.courses = [];
	$scope.page = {
		pn: 1,
		page_size: 10,
		message: "Load More",
		latitude: "0",
		longitude: "0"
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "loading...";
		userServices.favourite($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.courses = $scope.courses.concat(data.Result.Collections.list);
				$scope.no_more = $scope.courses.length == data.Result.Collections.totalRow ? true : false;
			} else {
				errorServices.autoHide("Server error");
			}
			if ($scope.no_more) {
				$scope.page.message = $scope.courses.length + " records found";
			}
			$scope.page.pn++;
		})

	}
	$scope.loadMore();
	$scope.local_go = function(course_id) {
		$location.path("detail").search({
			course_id: course_id
		});
	};
	$scope.unlike = function(collection_id, e) {
		e.preventDefault();
		e.stopPropagation();
		toastServices.show();
		userServices.unlike({
			collection_id: collection_id
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
})