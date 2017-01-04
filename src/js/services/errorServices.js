// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").factory("errorServices", function($rootScope, $timeout, toastServices) {
	return {
		show: function(error) {
			$rootScope.error_msg = error;
			$(".error-msg").show();
		},
		hide: function() {
			$rootScope.error_msg = "";
			$(".error-msg").hide();
		},
		autoHide: function(error, duration) {
			var duration = duration || 3000;
			$rootScope.error_msg = error;
			$(".error-msg").show();
			$timeout(function() {
				$rootScope.error_msg = "";
				$(".error-msg").hide();
			}, duration)
		},
		requestError: function(data, status, headers, config) {
			// hide toast
			toastServices.hide();
			// tip error
			switch (status) {
				case 0:
					this.autoHide("Connect Timeout");
					break;
				case 500:
				case 501:
				case 502:
				case 503:
				case 504:
				case 505:
				case 506:
				case 507:
				case 509:
				case 510:
					this.autoHide("Server Error");
					break;
				default:
					;
			}
			console.log("onRequestError output status, data, headers, config")
			console.log(status);
			console.log(data);
			console.log(headers)
			console.log(config);
			console.log("onRequestError end")
		}
	}
});