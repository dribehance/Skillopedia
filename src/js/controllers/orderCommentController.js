// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("orderCommentController", function($scope, $rootScope, $routeParams, $timeout, orderServices, errorServices, toastServices, localStorageService, config) {
	$scope.input = {
		skill: "0",
		environment: "0",
		attitude: "0"
	};
	toastServices.show();
	orderServices.query_course_by_comment({
		orders_id: $routeParams.id,
		comment_id: $routeParams.c_id,
		latitude: "0",
		longitude: "0"
	}).then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.order = data.CommentCourseInfo;
			$scope.input.skill = (data.comment && data.comment.pro_skill) || 0;
			$scope.input.environment = (data.comment && data.comment.teaching_environment) || 0;
			$scope.input.attitude = (data.comment && data.comment.teaching_attitude) || 0;
			$scope.input.content = (data.comment && data.comment.note) || ""
		} else {
			errorServices.autoHide(data.message);
		}
	})
	$scope.hover = function(name, index) {
		return $scope.input[name] = index;
	}
	var commenting = false;
	$scope.ajaxForm = function() {
		if (commenting) {
			return;
		}
		commenting = true;
		toastServices.show();
		orderServices.comment({
			comment_id: $routeParams.c_id,
			orders_id: $routeParams.id,
			course_id: $scope.order.Course.course_id,
			public_course_user_id: $scope.order.Course.user_id,
			note: $scope.input.content,
			pro_skill: $scope.input.skill,
			teaching_environment: $scope.input.environment,
			teaching_attitude: $scope.input.attitude
		}).then(function(data) {
			toastServices.hide();
			commenting = false;
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				$timeout(function() {
					$rootScope.back();
				}, 2000)
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
})