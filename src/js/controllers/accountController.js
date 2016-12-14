// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("accountController", function($scope, $rootScope, userServices, errorServices, toastServices, localStorageService, config) {
	$scope.input = {
		nickname: "",
		password: ""
	}
	toastServices.show();
	userServices.query_basicinfo().then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$rootScope.user = data.Result.UserInfo;
			$scope.input.nickname = $rootScope.user.nickname;
		} else {
			errorServices.autoHide(data.message);
		}
	})
	$scope.progress = function(p) {
		return Math.floor(p * 100);
	}
	$scope.ajaxForm = function() {
		if ($scope.input.password_1 != $scope.input.password_2) {
			errorServices.autoHide("Password not the same")
			return;
		}
		toastServices.show();
		userServices.rsa_key().then(function(data) {
			var crypt = new JSEncrypt(),
				private_key = data;
			crypt.setPrivateKey(private_key);
			var old_password = crypt.encrypt($scope.input.password),
				new_password = crypt.encrypt($scope.input.password_1);
			$scope.input.password = old_password;
			$scope.input.password_1 = new_password;
		}).then(function(data) {
			toastServices.show();
			userServices.modify_nickname({
				nickname: $scope.input.nickname,
				old_password: $scope.input.password,
				password: $scope.input.password_1
			}).then(function(data) {
				toastServices.hide();
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					$rootScope.user.nickname = $scope.input.nickname;
					errorServices.autoHide(data.message)
				} else {
					errorServices.autoHide(data.message);
				}
				$scope.input.password = "";
				$scope.input.password_1 = "";
				$scope.input.password_2 = "";
			})
		})
	}
});
angular.module("Skillopedia").controller("uploadAvatarController", function($scope, $rootScope, userServices, errorServices, toastServices, localStorageService, config) {
	$scope.$on("flow::filesSubmitted", function(event, flow, flowFile) {
		if (flow.files.length == 0) return;
		// $rootScope.back();
		flow.opts.target = config.url + "/app/UserCenter/UpdateAvatar";
		flow.opts.testChunks = false;
		flow.opts.fileParameterName = "image_01";
		flow.opts.query = {
			"invoke": "h5",
			"token": localStorageService.get("token")
		};
		flow.upload();
	})
	$scope.$on('flow::fileAdded', function(event, flowFile, flow) {
		if (!{
				png: 1,
				gif: 1,
				jpg: 1,
				jpeg: 1
			}[flow.getExtension()]) {
			errorServices.autoHide("Picture is required")
			event.preventDefault(); //prevent file from uploading
			return;
		}
		if (parseFloat(flow.size) / 1000 > 2000) {
			errorServices.autoHide("Suggested size: 520*296, below 2M")
			event.preventDefault(); //prevent file from uploading
			return;
		}
	});
	$scope.$on('flow::fileSuccess', function(file, message, chunk) {
		errorServices.autoHide("Upload successfully");
	});
})