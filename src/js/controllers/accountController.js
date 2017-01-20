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
angular.module("Skillopedia").controller("uploadAvatarController", function($scope, $rootScope, utilServices, userServices, errorServices, toastServices, localStorageService, config) {
	$scope.$on("flow::filesSubmitted", function(event, flow) {
		if (flow.files.length == 0) return;
		toastServices.show();
		utilServices.resizeFile(flow.files[0].file).then(function(blob) {
			var fd = new FormData();
			fd.append("image_01", blob);
			userServices.upload_image(fd).then(function(data) {
				toastServices.hide();
				errorServices.autoHide(data.message);
				return data;
			}, function(e) {
				toastServices.hide();
				errorServices.autoHide("upload error");
			}).then(function(data) {
				if (!data) return;
				var filename = data.fileName;
				toastServices.show();
				userServices.upload_avatar({
					filename: filename
				}).then(function(data) {
					toastServices.hide();
					if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
						$rootScope.user.image_01 = filename;
						errorServices.autoHide(data.message)
					} else {
						errorServices.autoHide(data.message);
					}
				})
			})
		})
	});
	$scope.$on('flow::fileAdded', function(event, flowFile, flow) {
		if (!{
				png: 1,
				gif: 1,
				jpg: 1,
				jpeg: 1
			}[flow.getExtension()]) {
			toastServices.hide();
			errorServices.autoHide("Picture is required")
			event.preventDefault(); //prevent file from uploading
			return;
		}
	});
})