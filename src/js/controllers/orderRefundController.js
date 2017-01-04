// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("orderRefundController", function($scope, $rootScope, $routeParams, $route, $timeout, orderServices, errorServices, toastServices, localStorageService, config) {
	toastServices.show();
	orderServices.query_refund({
		orders_id: $routeParams.id
	}).then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.refund_meta = data;
			$scope.refunds = data.Result.Refunds;
			$scope.order = data.Result.Orders;
			$scope.refunds.map(function(r) {
				if (r.refund_status == '10') {
					r.selected = true;
				}
				return r;
			});
			if ($scope.refund_meta.can_refund_num == 0) {
				$rootScope.back();
			}
			$scope.calculate();
		} else {
			errorServices.autoHide(data.message);
		}
	});
	// 选择退款
	$scope.select = function(refund) {
		refund.selected = !refund.selected;
		$scope.calculate();

	};
	// 计算退款
	// ---------用户退款
	// 总退金额 = 实付金额-服务费-（未退款课程数*原单价）
	// 未退款课程 = 总课程 - 已经选择要退款的课程
	// 原单价 = 原单价+外出+additional partner
	// ---------教练退款
	// 支付总额-（支付总额 / 总课程数  *退款课程数）
	$scope.calculate = function() {
		$scope.total_refund_money = 0;
		$scope.total_refund_money = parseFloat($scope.order.total_session_rate) - parseFloat($scope.order.first_joint_fee) - parseFloat($scope.query_amount() * $scope.query_single());
		$scope.total_refund_money = $scope.total_refund_money < 0 ? 0 : $scope.total_refund_money;
	};
	// 未退款课程数
	$scope.query_amount = function() {
		var to_refund_amount = $scope.refunds.filter(function(refund) {
			return refund.selected;
		}).length;
		return (parseFloat($scope.order.buy_amount) - parseFloat(to_refund_amount))
	};
	// 退款单价 原单价+交通费+addtional
	$scope.query_single = function() {
		return (parseFloat($scope.order.session_rate) + parseFloat($scope.order.go_door_traffic_cost) + parseFloat($scope.order.surcharge_for_each_cash) * parseFloat($scope.order.take_partner_num))
	};
	// 发起退款
	$scope.refund = function() {
		toastServices.show();
		orderServices.refund({
			orders_id: $scope.order.orders_id,
			orders_schedule_ids: $scope.refunds.filter(function(refund) {
				return refund.selected;
			}).map(function(r) {
				return r.orders_schedule_id
			}).join("#"),
			refund_success_money: $scope.total_refund_money
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				$timeout(function() {
					$route.reload()
				}, 1000)
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
})