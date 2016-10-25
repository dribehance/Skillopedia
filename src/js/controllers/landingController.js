// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("landingController", function($scope, $rootScope, $location, $route, $window, $timeout, facebookServices, userServices, errorServices, toastServices, localStorageService, config) {
	if ($rootScope.is_signin()) {
		$rootScope.back();
	}
	if (localStorageService.get("facebook_entry")) {
		$scope.facebook_entry = localStorageService.get("facebook_entry");
	}
	if (localStorageService.get("twitter_entry")) {
		$scope.twitter_entry = localStorageService.get("twitter_entry");
	}
	$scope.input = {
		signin_email: "",
		signin_password: "",
		signup_username: "",
		signup_email: "",
		signup_password: "",
		forget_email: "",
	}
	$scope.signin_action = function() {
		toastServices.show();
		userServices.rsa_key().then(function(data) {
			var crypt = new JSEncrypt(),
				private_key = data;
			crypt.setPrivateKey(private_key);
			var crypted_str = crypt.encrypt($scope.input.signin_password);
			$scope.input.signin_password = crypted_str;
		}).then(function(data) {
			toastServices.show();
			userServices.signin({
				email: $scope.input.signin_email,
				password: $scope.input.signin_password,
				t_uid: localStorageService.get("t_uid"),
				f_uid: localStorageService.get("f_uid")
			}).then(function(data) {
				toastServices.hide();
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					localStorageService.set("token", data.token);
					userServices.sync();
					errorServices.autoHide(data.message);
					// try to index
					$location.path("index").replace();
					// jump only when index is the current page
					$timeout(function() {
						$window.location.href = $location.protocol() + "://" + $location.host() + ":" + $location.port();
					}, 2000)
				}
				if (data.code == config.request.SUCCESS && data.status == 5) {
					$scope.reconfirm_signin = true;
					$scope.input.signin_password = "";
					return;
				}
				$scope.input.signin_password = "";
				errorServices.autoHide(data.message);
			})
		})
	}
	$scope.signup_action = function() {
		toastServices.show();
		userServices.signup({
			nickname: $scope.input.username,
			email: $scope.input.signup_email,
			password: $scope.input.signup_password,
			t_uid: localStorageService.get("t_uid"),
			f_uid: localStorageService.get("f_uid")
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				localStorageService.set("token", data.user.token);
				$rootScope.user = data.user;
				errorServices.autoHide(data.message);
				// try to index
				$location.path("index").replace();
				// jump only when index is the current page
				$timeout(function() {
					$window.location.href = $location.protocol() + "://" + $location.host() + ":" + $location.port();
				}, 2000)
			}
			if (data.code == config.request.SUCCESS && data.status == 3) {
				$scope.input.signup_password = "";
				$scope.reconfirm_signup = true;
				return;
			}
			$scope.input.signup_password = "";
			errorServices.autoHide(data.message);
		})
	}
	$scope.forget_action = function() {
		toastServices.show();
		userServices.forget({
			email: $scope.input.forget_email,
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	$scope.resend_email = function(email) {
		toastServices.show();
		userServices.resend_email({
			email: email
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message, 5000);
				$timeout(function() {
					$scope.reconfirm_signup = false;
					$scope.reconfirm_signin = false;
					$rootScope.close_popup_signin();
				}, 5000);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	// 绑定facebook关联账号
	$scope.bind_facebook = function() {
			toastServices.show();
			userServices.rsa_key().then(function(data) {
				toastServices.hide();
				var crypt = new JSEncrypt(),
					private_key = data;
				crypt.setPrivateKey(private_key);
				var crypted_str = crypt.encrypt($scope.input.binding_password);
				$scope.input.binding_password = crypted_str;
			}).then(function(data) {
				toastServices.show();
				userServices.binding_account({
					email: $scope.facebook_entry.email,
					password: $scope.input.binding_password,
				}).then(function(data) {
					toastServices.hide()
					if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
						localStorageService.remove("binding_account");
						localStorageService.set("token", data.token);
						userServices.sync();
						// try to index
						$location.path("index").replace();
						// jump only when index is the current page
						$timeout(function() {
							$window.location.href = $location.protocol() + "://" + $location.host() + ":" + $location.port();
						}, 2000)
					} else {
						errorServices.autoHide(data.message);
					}
					$scope.input.binding_password = "";
				})
			})
		}
		// 绑定twitter关联账号
	$scope.bind_twitter = function() {
		toastServices.show();
		userServices.rsa_key().then(function(data) {
			toastServices.hide();
			var crypt = new JSEncrypt(),
				private_key = data;
			crypt.setPrivateKey(private_key);
			var crypted_str = crypt.encrypt($scope.input.binding_password);
			$scope.input.binding_password = crypted_str;
		}).then(function(data) {
			toastServices.show();
			userServices.binding_account({
				email: $scope.twitter_email,
				password: $scope.input.binding_password,
			}).then(function(data) {
				toastServices.hide()
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					localStorageService.remove("binding_account");
					localStorageService.set("token", data.token);
					userServices.sync();
					// try to index
					$location.path("index").replace();
					// jump only when index is the current page
					$timeout(function() {
						$window.location.href = $location.protocol() + "://" + $location.host() + ":" + $location.port();
					}, 2000)
				} else {
					errorServices.autoHide(data.message);
				}
				$scope.input.binding_password = "";
			})
		})
	}
	$rootScope.sign = "signin";
	$scope.signin = function() {
		$rootScope.sign = "signin";
	}
	$scope.signup = function() {
		$rootScope.sign = "signup";
	};
	// oauth
	$scope.facebook_login = function() {
		if (!$window.FB) return;
		toastServices.show()
		$window.FB && facebookServices.login().then(function(data) {
			toastServices.hide();
			if (!data.email) {
				toastServices.hide();
				errorServices.autoHide("Sorry facebook email address not found, Login failed");
				facebookServices.logout();
				return;
			}
			localStorageService.set("facebook_entry", data);
			toastServices.show();
			userServices.login_by_oauth({
				email: data.email,
				icon_url: data.picture.data.url,
				nickname: data.name
			}).then(function(data) {
				toastServices.hide()
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					localStorageService.set("token", data.token);
					userServices.sync();
					$rootScope.close_popup_signin();
					$route.reload();
				}
				if (data.code == config.request.SUCCESS && (data.status == 2 || data.status == 3)) {
					errorServices.autoHide(data.message)
				}
				if (data.code == config.request.SUCCESS && data.status == 4) {
					$window.location.href = "https://www.skillpier.com/landingFacebook";
				}
			})
		});
	}
	$scope.twitter_login = function() {
		$window.location.href = config.url + "/twitterOne";
	}
	$scope.go = function() {
		$window.location.href = $location.protocol() + "://" + $location.host() + ":" + $location.port();
	}
});