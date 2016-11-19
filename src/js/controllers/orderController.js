// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("orderController", function($scope, $sce, $rootScope, $timeout, $routeParams, $location, $window, googleMapServices, orderServices, errorServices, toastServices, localStorageService, config) {
	if (!$routeParams.id) {
		$rootScope.back();
		return;
	}
	toastServices.show();
	orderServices.query_by_id({
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
		// if (!$scope.course.city) {
		// 	return;
		// }
		// var map_url = "https://maps.google.com/maps?q=" + $scope.course.city + " " + $scope.course.area + " " + $scope.course.street + "&output=embed";
		// return $sce.trustAsResourceUrl(map_url);
		googleMapServices.geocoding({
			address: $scope.order.Course.street + " " + $scope.order.Course.address + "," + $scope.order.Course.area + "," + $scope.order.Course.city
		}).then(function(data) {
			$scope.format_address = data.results[0].formatted_address;
			$scope.lat_lng = data.results[0].geometry.location;
			var map = googleMapServices.create_map(document.getElementById('map'), $scope.lat_lng);
			// console.log(map)
			var circle_marker = googleMapServices.create_marker(map, $scope.lat_lng);
		})
	};
	// $scope.get_map = function() {
	// 	if (!$scope.order) {
	// 		return;
	// 	}
	// 	var map_url = "https://maps.google.com/maps?q=" + $scope.order.Course.city + $scope.order.Course.area + $scope.order.Course.street + $scope.order.Course.address + "&output=embed";
	// 	return $sce.trustAsResourceUrl(map_url);
	// };
	$scope.get_total_partner_fee = function() {
		if (!$scope.order) {
			return;
		}
		return (parseFloat($scope.order.take_partner_num) * parseFloat($scope.order.surcharge_for_each_cash)).toFixed(2);
	};
	// remove order
	$scope.remove = function(order) {
		$scope.confirm.content = "Delete order ?";
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
	// pay order
	$scope.pay = function(order) {
		var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/#/payment?id=" + order.orders_id;
		$window.location.href = url;
	};
})