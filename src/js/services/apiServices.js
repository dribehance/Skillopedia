// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").factory("apiServices", function($http, localStorageService) {
	return {
		_get: function(request) {
			return function(input) {
				if (request.token !== undefined) {
					request.token = localStorageService.get("token")
				}
				return $http({
					// by dribehance <dribehance.kksdapp.com>
					url: request.url,
					cache: request.cache || true,
					method: "GET",
					params: angular.extend({}, request, input)
				}).then(function(data) {
					return data.data;
				});
			}
		},
		_post: function(request) {
			return function(input) {
				if (request.token !== undefined) {
					request.token = localStorageService.get("token")
				}
				return $http({
					// by dribehance <dribehance.kksdapp.com>
					url: request.url,
					method: "POST",
					cache: request.cache || true,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					transformRequest: function(obj) {
						var str = [];
						for (var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
					data: angular.extend({}, request, input)
				}).then(function(data) {
					return data.data;
				});
			}
		},
		_post_formdata: function(request) {
			return function(formdata) {
				if (request.token !== undefined) {
					request.token = localStorageService.get("token")
				}
				for (key in request) {
					formdata.append(key, request[key]);
				}
				return $http({
					// by dribehance <dribehance.kksdapp.com>
					url: request.url,
					method: "POST",
					cache: request.cache || true,
					headers: {
						'Content-Type': undefined
					},
					transformRequest: angular.identity,
					data: formdata
				}).then(function(data) {
					return data.data;
				});
			}
		}
	}
});