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
			errorServices.autoHide("必须上传图片")
			event.preventDefault(); //prevent file from uploading
			return;
		}
		if (parseFloat(flow.size) / 1000 > 500) {
			errorServices.autoHide("图片太大，保证图片在500kb以内")
			event.preventDefault(); //prevent file from uploading
			return;
		}
	});
})