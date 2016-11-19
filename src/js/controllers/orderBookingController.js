// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("orderBookingController", function($scope, $rootScope, $route, $routeParams, $filter, $timeout, orderServices, scheduleServices, errorServices, toastServices, localStorageService, config) {
	// schedule
	$scope.calendar = {
		mode: "edit",
		disabled: false,
		disabled_message: "All Day Busy",
		times: [],
		size: 1,
		selected: []
	}
	$scope.query_schedule = function(day) {
		// $scope.calendar.selected = [];
		var selected = $scope.calendar.selected.map(function(t) {
			return t.from.day + " " + t.from.hour + "to" + t.to.day + " " + t.to.hour;
		}).join("#");
		toastServices.show();
		scheduleServices.query_by_course({
			course_id: $routeParams.course_id,
			user_id: $rootScope.user.user_id,
			choice_currentdate: day,
			orders_id: $routeParams.order_id
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.schedule_meta = data;
				$scope.calendar.times = data.ScheduleBeans.map(function(time) {
					time.schedule_state = time.schedule_state;
					time.schedule_state_message = time.schedule_state_message;
					time.day = day;
					var temp = time.day + " " + time.hour;
					if (selected.indexOf(temp) != -1) {
						time.schedule_state = 2;
						time.active = true;
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
				$scope.calendar.size = data.under_select_course_num;
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
	$scope.calendar.onDayChange = function() {
		$scope.query_schedule($filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"))
	};
	$scope.query_schedule($filter("date")(new Date().getTime(), "yyyy-MM-dd"));
	// 获取剩余可选课程
	$scope.get_left = function() {
		return parseFloat($scope.calendar.size) - parseFloat($scope.calendar.selected.length);
	};
	$scope.get_from_time = function(t) {
		return t.split("-")[0]
	}
	$scope.get_to_time = function(t) {
		return t.split("-")[1]
	};
	$scope.parse_day = function(day) {
			var days = day.split("-");
			return days[1] + " / " + days[2] + " / " + days[0];
		}
		// confirm booking
	$scope.booking = function() {
		toastServices.show();
		orderServices.booking({
			orders_id: $routeParams.order_id,
			course_id: $routeParams.course_id,
			choice_currentdates: $scope.calendar.selected.map(function(c) {
				return c.from.day + "A" + c.from.hour_index + "A" + c.to.hour_index;
			}).join("#"),
			under_select_course_num: $scope.calendar.size
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				// errorServices.autoHide(data.message);
				$scope.confirm.ok_text = "Ok";
				$scope.confirm.content = data.message;
				$scope.confirm.content_type = "dialog"
				$scope.confirm.open();
				$scope.confirm.cancle_callback = function() {
					$route.reload();
				}
				$scope.confirm.ok_callback = function() {
					$route.reload();
				}
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
})