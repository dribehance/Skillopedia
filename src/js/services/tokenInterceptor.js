// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").factory("tokenInterceptor", function($location, $rootScope, $q, localStorageService, toastServices, errorServices, config) {
	var request_count = 0;
	return {
		// optional method
		'request': function(config) {
			// do something on success
			++request_count == 1 && toastServices.start();
			// The language can be configured any other way.

			// We'll eventually use $("html").attr("lang").

			config.headers["Accept-Language"] = "en";
			return config;
		},
		// optional method
		'requestError': function(rejection) {
			// console.log(rejection)
			// do something on error
			// if (canRecover(rejection)) {
			//     return responseOrNewPromise
			// }
			// return $q.reject(rejection);
		},
		// optional method
		'response': function(response) {
			--request_count == 0 && toastServices.done();
			// do something on success
			var defer = $q.defer();
			// static response
			if (response.config.url.indexOf(".html") > 0) {
				return response;
			}
			// server response
			if (response.data.code == config.request.TOKEN_INVALID) {
				console.log("TOKEN_INVALID")
				localStorageService.remove("token");
				// $location.path("/landing").replace();
				$location.path("/index").replace();
				return defer.promise;
			} else {
				return response;
			}
			return response;
		},
		// optional method
		'responseError': function(rejection) {
			var defer = $q.defer();
			errorServices.requestError(rejection.data, rejection.status, rejection.headers, rejection.config);
			return defer.promise;
		}
	}
})