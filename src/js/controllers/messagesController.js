// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("messagesController", function($scope, $rootScope, $route, $timeout, userServices, errorServices, toastServices, localStorageService, config) {
	$scope.messages = [];
	$scope.page = {
		pn: 1,
		page_size: 10,
		message: "Load More",
		type: $rootScope.user.agent_level
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "loading...";
		userServices.query_messages($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.messages = $scope.messages.concat(data.Result.Comments.list);
				$scope.no_more = $scope.messages.length == data.Result.Comments.totalRow ? true : false;
			} else {
				errorServices.autoHide("Server error");
			}
			if ($scope.no_more) {
				$scope.page.message = $scope.messages.length + " records found";
			}
			$scope.page.pn++;
		})

	}
	$scope.loadMore();
	// remove message
	$scope.remove = function(message) {
		$scope.confirm.content = "Are you sure to delete message ?";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			userServices.remove_message({
				delete_type: $rootScope.user.agent_level,
				comment_id: message.comment_id
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
	$scope.input = {};
	$scope.reply = function(message) {
		$scope.reply_id = message.comment_id;
	}
	$scope.confirm_reply = function(message) {
		console.log($scope.input.reply_content)
		toastServices.show();
		userServices.reply_message({
			comment_id: message.comment_id,
			content: $scope.input.reply_content
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.reply_id = "";
				$scope.input.reply_content = "";
				$route.reload();
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
})