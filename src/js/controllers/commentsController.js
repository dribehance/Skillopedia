// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("commentsController", function($scope, $rootScope, userServices, errorServices, toastServices, localStorageService, config) {
	$scope.comments = [];
	$scope.page = {
		pn: 1,
		page_size: 10,
		message: "Load More"
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "loading...";
		$scope.page.user_id = $rootScope.user.user_id;
		userServices.query_comments_by_user_id($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.comments = $scope.comments.concat(data.Result.Comments.list);
				$scope.no_more = $scope.comments.length == data.Result.Comments.totalRow ? true : false;
			} else {
				errorServices.autoHide("Server error");
			}
			if ($scope.no_more) {
				if ($scope.comments.length == 0) {
					$scope.page.message = "No record found";
				}
				if ($scope.comments.length == 1) {
					$scope.page.message = data.Result.Comments.totalRow + " record found ";
				}
				if ($scope.comments.length > 1) {
					$scope.page.message = data.Result.Comments.totalRow + " records found ";
				}
			}
			$scope.page.pn++;
		})

	}
	$scope.loadMore();
	$scope.to_fix = function(m) {
		return m.toFixed(1);
	}
})