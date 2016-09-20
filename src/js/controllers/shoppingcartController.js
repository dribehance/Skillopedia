// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("shoppingcartController", function($scope, $location, $window, $timeout, $route, googleMapServices, orderServices, shoppingcartServices, errorServices, toastServices, localStorageService, config) {
	$scope.courses = [];
	$scope.page = {
		pn: 1,
		page_size: 1000,
		message: "Load More"
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "loading...";
		shoppingcartServices.query($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.courses = $scope.courses.concat(data.Result.Carts.list);
				// status 1:正常购物车, status 2:失效购物车;
				// 正常购物车数据
				$scope.normal_courses = $scope.courses.filter(function(c) {
					c.selected = true;
					return c.status == 1;
				});
				// 失效购物车;
				$scope.expired_courses = $scope.courses.filter(function(c) {
					return c.status == 2;
				});
				$scope.page.pn++;
				$scope.no_more = $scope.courses.length == data.Result.Carts.totalRow ? true : false;
			} else {
				errorServices.autoHide("Server error");
			}
			if ($scope.no_more) {
				$scope.page.message = $scope.courses.length + " records found";
			}
		})

	}
	$scope.loadMore();
	// action
	$scope.toggle = function(course) {
		return course.selected = !course.selected;
	};
	$scope.check_all = function() {
		// status 1:正常购物车, status 2:失效购物车;
		if ($scope.shoppingcart_size == $scope.normal_courses.length) {
			$scope.normal_courses.map(function(c) {
				c.selected = false
				return c;
			});
			return;
		}
		$scope.normal_courses.map(function(c) {
			c.selected = true
			return c;
		});
	};
	$scope.get_total = function() {
		var total = 0;
		$scope.shoppingcart_size = 0;
		angular.forEach($scope.normal_courses, function(value, key) {
			if (value.selected) {
				$scope.shoppingcart_size++;
				total += value.total_session_rate
			}
		});
		return total.toFixed(2);
	};
	// 支付
	$scope.pay = function() {
		var ids = $scope.normal_courses.filter(function(c) {
			return c.selected
		}).map(function(course) {
			return course.orders_id;
		}).join("A");
		if (!ids) {
			errorServices.autoHide("No selected course")
			return;
		}
		var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/#/payment?id=" + ids;
		$window.location.href = url;
	};
	// 删除购物车
	$scope.remove = function(course) {
		$scope.confirm.content = "Are you sure to delete course ?";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			orderServices.remove({
				delete_type: "1",
				orders_ids: course.orders_id
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
	};
	$scope.remove_expired = function() {
		var expired_ids = $scope.courses.filter(function(c) {
			return c.status == '2';
		}).map(function(expired) {
			return expired.orders_id;
		}).join("#");
		toastServices.show();
		orderServices.remove({
			delete_type: "1",
			orders_ids: expired_ids
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
	};
	// Course location
	$scope.open_map = function(course, e) {
		e.preventDefault();
		e.stopPropagation();
		$.magnificPopup.open({
			items: {
				// src: "https://maps.google.com/maps?q=" + course.city + course.area + course.street
				src: "<div style='height:300px;border:1px solid #d2d2d2;background-color:white' id='map'></div>"
			},
			type: "inline"
		});
		$timeout(function() {
			googleMapServices.geocoding({
				address: course.street + "," + course.area + "," + course.city
			}).then(function(data) {
				$scope.lat_lng = data.results[0].geometry.location;
				var map = googleMapServices.create_map(document.getElementById('map'), $scope.lat_lng);
				// console.log(map)
				var circle_marker = googleMapServices.create_circle_marker(map, $scope.lat_lng);
			})
		}, 0)
	};
})