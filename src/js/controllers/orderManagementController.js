// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("orderManagementController", function($scope, $sce, $routeParams, googleMapServices, orderServices, errorServices, toastServices, localStorageService, config) {
	toastServices.show();
	orderServices.query_manage_order({
		orders_id: $routeParams.id,
		latitude: "0",
		longitude: "0"
	}).then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.order = data.Orders;
			$scope.get_map();
		} else {
			errorServices.autoHide(data.message);
		}
	});
	// parse iframe map url
	$scope.get_map = function() {
		googleMapServices.geocoding({
			address: $scope.order.Course.street + "," + $scope.order.Course.address + "," + $scope.order.Course.area + "," + $scope.order.Course.city
		}).then(function(data) {
			$scope.lat_lng = data.results[0].geometry.location;
			$scope.format_address = data.results[0].formatted_address;
			var map = googleMapServices.create_map(document.getElementById('map'), $scope.lat_lng);
			// console.log(map)
			var circle_marker = googleMapServices.create_marker(map, $scope.lat_lng);
		});
		// var map_url = "https://maps.google.com/maps?q=" + $scope.order.Course.city + $scope.order.Course.area + $scope.order.Course.street + $scope.order.Course.address + "&output=embed";
		// return $sce.trustAsResourceUrl(map_url);
	};
	$scope.get_total_partner_fee = function() {
		if (!$scope.order) {
			return;
		}
		return (parseFloat($scope.order.take_partner_num) * parseFloat($scope.order.surcharge_for_each_cash)).toFixed(2);
	};
	// remove order
	$scope.remove = function(order) {
		$scope.confirm.content = "Are you sure to delete order ?";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			orderServices.remove({
				delete_type: "1",
				orders_ids: order.orders_id
			}).then(function(data) {
				toastServices.hide()
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					errorServices.autoHide(data.message);
					$timeout(function() {
						$rootScope.back();
					}, 2000)
				} else {
					errorServices.autoHide(data.message);
				}
			})
		}
	};
})