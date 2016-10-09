// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("footerController", function($scope, skillopediaServices, errorServices, toastServices, localStorageService, config) {
	// base category
	toastServices.show();
	skillopediaServices.query_base_category().then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.sport_id = data.Result.Category01s[0].category_01_id;
			$scope.art_id = data.Result.Category01s[1].category_01_id;
		} else {
			errorServices.autoHide(data.message);
		}
	}).then(function(data) {
		// all sports
		skillopediaServices.query_second_category({
			category_01_id: $scope.sport_id
		}).then(function(data) {
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.sports = data.Result.Category02s;
			} else {
				errorServices.autoHide(data.message);
			}
		});
		// all arts
		skillopediaServices.query_second_category({
			category_01_id: $scope.art_id
		}).then(function(data) {
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.arts = data.Result.Category02s;
			} else {
				errorServices.autoHide(data.message);
			}
		})
	})
})