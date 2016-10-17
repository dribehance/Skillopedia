// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("paymentController", function($scope, $routeParams, $timeout, $location, orderServices, errorServices, toastServices, localStorageService, config) {
	if (!$routeParams.id) {
		rediect();
		return;
	}
	$scope.input = {};
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
	$scope.ajaxForm = function() {
		toastServices.show();
		orderServices.pay_by_visa({
			amount: $scope.payment.total_total_session_rate,
			orders_ids: $routeParams.id,
			cardNumber: $scope.input.visa_card_id,
			expirationDate: $scope.input.visa_card_month.toString() + $scope.input.visa_card_year.toString()
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
	$scope.pay_by_paypal = function() {
		angular.element("#paypalForm").submit();
	}

	function rediect() {
		$scope.error_msg = "page not found";
		$timeout(function() {
			$location.path("index").search("id", null).replace();
		}, 2000)
	}
})