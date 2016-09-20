// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("couponsController", function($scope, $route, $timeout, errorServices, userServices, toastServices, localStorageService, config) {
	$scope.input = {
		coupon_type: 1
	};
	$scope.coupons = [];
	$scope.page = {
		pn: 1,
		page_size: 1000,
		message: "Load More",
		type: $scope.input.coupon_type
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "loading...";
		userServices.query_coupons($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.coupons = $scope.coupons.concat(data.Result.MyCoupons.list);
				$scope.no_more = $scope.coupons.length == data.Result.MyCoupons.totalRow ? true : false;
			} else {
				errorServices.autoHide("Server error");
			}
			if ($scope.no_more) {
				$scope.page.message = $scope.coupons.length + " records found";
			}
			$scope.page.pn++;
		})

	}
	$scope.loadMore();
	$scope.get_coupon = function() {
		toastServices.show();
		userServices.get_coupon({
			number: $scope.input.coupon_id
		}).then(function(data) {
			$scope.input.coupon_id = "";
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				$timeout(function() {
					$route.reload();
				}, 2000)
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	$scope.active_tab = function(tab_index) {
		if (tab_index == $scope.input.coupon_type) {
			return;
		}
		$scope.input.coupon_type = tab_index;
		$scope.coupons = [];
		$scope.page = {
			pn: 1,
			page_size: 1000,
			message: "Load More",
			latitude: "0",
			longitude: "0",
			type: $scope.input.coupon_type
		}
		$scope.no_more = false;
		$scope.loadMore();
	};
	$scope.remove = function(coupon, e) {
		e.preventDefault();
		e.stopPropagation();
		$scope.confirm.content = "Are you sure to delete coupon ?";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			userServices.remove_coupon({
				my_coupon_id: coupon.my_coupon_id
			}).then(function(data) {
				toastServices.hide()
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					errorServices.autoHide(data.message);
					$timeout(function() {
						$route.reload();
					}, 2000)
				} else {
					errorServices.autoHide(data.message);
				}
			})
		}
	}
})