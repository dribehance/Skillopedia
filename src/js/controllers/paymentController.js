// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("paymentController", function($scope, $routeParams, skillopediaServices, $timeout, $location, orderServices, errorServices, toastServices, localStorageService, config) {
	if (!$routeParams.id) {
		rediect();
		return;
	}
	$scope.is_billing = false;
	$scope.select_payment = function(pay_with) {
		$scope.pay_with = pay_with;
	}
	$scope.input = {
		last_time: new Date().getTime()
	};
	if (localStorageService.get("billing_address")) {
		// 缓存一个小时
		if (new Date().getTime() - localStorageService.get("billing_address").last_time > 3600000) {
			localStorageServicel.remove("billing_address");
		} else {
			$scope.input = angular.extend({}, $scope.input, localStorageService.get("billing_address"));
		}
	}
	$scope.id = new Date().getTime() + $routeParams.id;
	toastServices.show();
	orderServices.query_payment({
		orders_ids: $routeParams.id
	}).then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			if (data.total_total_session_rate == 0) {
				rediect();
			} else {
				$scope.payment = data;
			}
		} else {
			errorServices.autoHide(data.message);
		}
	});
	toastServices.show();
	skillopediaServices.query_us_state().then(function(data) {
		toastServices.hide()
		$scope.states = data.state;
		$scope.input.state = $scope.states[0].name;
	})
	$scope.pay = function(by) {
		toastServices.show();
		orderServices.pay({
			total_money: $scope.payment.total_total_session_rate,
			orders_ids: $routeParams.id,
			pay_type: by
		}).then(function(data) {
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {

				$scope.alipay = data.sParaTemp;
				$timeout(function() {
					toastServices.hide()
					angular.element("#alipayForm").submit();
				}, 1000)
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	$scope.pay_by_paypal = function() {
		angular.element("#paypalForm").submit();
	}

	function rediect() {
		$scope.error_msg = "page not found";
		$timeout(function() {
			$location.path("index").search("id", null).replace();
		}, 2000)
	}
	$scope.ajaxBilling = function() {
		localStorageService.set("billing_address", $scope.input);
		toastServices.show();
		orderServices.post_billing_address({
			first_name: $scope.input.first_name,
			last_name: $scope.input.last_name,
			street: $scope.input.street,
			city: $scope.input.city,
			state: $scope.input.state,
			phone: $scope.input.phone,
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.is_billing = true;
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
	$scope.ajaxForm = function() {
		toastServices.show();
		orderServices.pay_by_visa({
			amount: $scope.payment.total_total_session_rate,
			orders_ids: $routeParams.id,
			cardNumber: $scope.input.visa_card_id,
			expirationDate: $scope.input.visa_card_month.toString() + $scope.input.visa_card_year.toString(),
			code: $scope.input.visa_card_code,
			first_name: $scope.input.first_name,
			last_name: $scope.input.last_name,
			street: $scope.input.street,
			city: $scope.input.city,
			state: $scope.input.state,
			phone: $scope.input.phone,
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				$timeout(function() {
					$location.path("orders").replace();
				}, 3000);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
})