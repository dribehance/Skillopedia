// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("orderConfirmController", function($scope, $timeout, $rootScope, $routeParams, $route, orderServices, errorServices, toastServices, localStorageService, config) {
	if (!$routeParams.id) {
		$rootScope.back()
		return;
	}
	toastServices.show();
	orderServices.query_schedule_date({
		orders_id: $routeParams.id,
		schedule_type: "2"
	}).then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.days = data.scheduleDatas;
			return true;
		} else {
			errorServices.autoHide(data.message);
			$timeout(function() {
				$rootScope.back();
			}, 2000)
			return false;
		}
	}).then(function(promise) {
		if (!promise) {
			return;
		}
		$scope.current_day = $scope.days[0].schedule_data;
		$scope.query_schedule($scope.current_day)
	})
	$scope.calendar = {
		mode: "confirm",
		disabled: false,
		disabled_message: "All Day Busy",
		times: [],
		size: 0
	}
	$scope.query_schedule = function(day) {
		// $scope.calendar.selected = null;
		// var selected = $scope.calendar.selected.map(function(t) {
		// 	return t.from.day + " " + t.from.hour + "to" + t.to.day + " " + t.to.hour;
		// }).join("#");
		$scope.current_day = day;
		toastServices.show();
		orderServices.query_schedule_time({
			orders_id: $routeParams.id,
			schedule_type: "2",
			schedule_data: day
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.calendar.times = data.ScheduleBeans.map(function(time) {
					time.schedule_state = time.schedule_state;
					time.schedule_state_message = time.schedule_state_message;
					time.day = day;
					// var temp = time.day + " " + time.hour;
					// if (selected.indexOf(temp) != -1) {
					// 	time.schedule_state = 2;
					// 	time.active = true;
					// }
					if (time.schedule_state == 3) {
						time.schedule_state = 2;
						time.active = true;
						$scope.calendar.size = parseFloat($scope.calendar.size) + 0.5;
					}
					return time;
				})
				$scope.calendar.is_stop_course = data.is_stop_course;
				$scope.calendar.is_busy_24 = data.is_busy_24;
				if ($scope.calendar.is_stop_course == "1" || $scope.calendar.is_busy_24 == "1") {
					$scope.calendar.disabled = true;
				} else {
					$scope.calendar.disabled = false;
				}
				parse_selected();
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	$scope.get_from_time = function(t) {
		return t.split("-")[0]
	}
	$scope.get_to_time = function(t) {
		return t.split("-")[1]
	};

	function parse_selected() {
		$scope.calendar.selected = [];
		var selectabled = $scope.calendar.times.filter(function(t) {
			return t.active;
		})
		for (var i = 0; i < selectabled.length; i = i + 2) {

			var selected_time = {
				from: selectabled[i],
				to: selectabled[i + 1]
			}
			$scope.calendar.selected.push(selected_time);
		}
	}
	$scope.input = {};
	// confirm
	$scope.confirm_course = function() {
		$scope.confirm.content_text = "Confirm Booking ?";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			orderServices.confirm_or_reject({
				schedule_type: "2",
				refund_reason: $scope.input.refund_reason,
				orders_schedule_ids: $scope.calendar.selected.map(function(c) {
					return c.from.orders_schedule_id
				}).join("#")
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
	// reject
	$scope.reject_course = function() {
		$scope.confirm.content_text = "Decline Booking";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			orderServices.confirm_or_reject({
				schedule_type: "1",
				refund_reason: $scope.input.refund_reason,
				orders_schedule_ids: $scope.calendar.selected.map(function(c) {
					return c.from.orders_schedule_id
				}).join("#")
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