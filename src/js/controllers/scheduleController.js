// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("scheduleController", function($scope, $rootScope, $filter, scheduleServices, errorServices, toastServices, localStorageService, config) {
	$scope.calendar = {
		mode: "preview",
		disabled: false,
		disabled_message: "All Day Busy",
		times: []
	}
	$scope.query_schedule = function(day) {
		$scope.calendar.selected = [];
		toastServices.show();
		scheduleServices.query({
			user_id: $rootScope.user.user_id,
			choice_currentdate: day,
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.calendar.times = data.ScheduleBeans.map(function(time) {
					time.schedule_state = time.schedule_state;
					time.schedule_state_message = time.schedule_state_message;
					return time;
				})
				$scope.calendar.is_stop_course = data.is_stop_course;
				$scope.calendar.is_busy_24 = data.is_busy_24;
				if ($scope.calendar.is_stop_course == "1" || $scope.calendar.is_busy_24 == "1") {
					$scope.calendar.disabled = true;
				} else {
					$scope.calendar.disabled = false;
				}
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
	$scope.busy_hour = function() {
		$scope.confirm.content = "";
		$scope.confirm.content_type = "input"
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			scheduleServices.set_busy({
				choice_currentdate: $filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"),
				time_slots: $scope.calendar.selected.map(function(t) {
					return t.hour_index
				}).join("#"),
				remarks: $scope.confirm.content
			}).then(function(data) {
				toastServices.hide()
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					errorServices.autoHide(data.message);
					$scope.query_schedule($filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"))
				} else {
					errorServices.autoHide(data.message);
				}
			})
		}
	}
	$scope.free_hour = function() {
		toastServices.show();
		scheduleServices.set_free({
			choice_currentdate: $filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"),
			time_slots: $scope.calendar.selected.map(function(t) {
				return t.hour_index;
			}).join("#")
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				$scope.query_schedule($filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"))
			} else {
				errorServices.autoHide(data.message);
			}
		});
	}
	$scope.busy_one_day = function() {
		$scope.confirm.content = $scope.calendar.is_busy_24 == "0" ? "Mark busy today?" : "Cancel Mark busy today?";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			var is_busy_24 = $scope.calendar.is_busy_24 == "0" ? "1" : 0;
			toastServices.show();
			scheduleServices.set_one_day_busy({
				choice_currentdate: $filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"),
				is_busy_24: is_busy_24
			}).then(function(data) {
				toastServices.hide()
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					errorServices.autoHide(data.message);
					$scope.query_schedule($filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"))
				} else {
					errorServices.autoHide(data.message);
				}
			})
		}
	}
	$scope.busy_all_day = function() {
		$scope.confirm.content = $scope.calendar.is_stop_course == "0" ? "Suspend all courses" : "Start up courses";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			var is_stop_course = $scope.calendar.is_stop_course == "0" ? "1" : 0;
			toastServices.show();
			scheduleServices.set_all_day_busy({
				is_stop_course: is_stop_course
			}).then(function(data) {
				toastServices.hide()
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					errorServices.autoHide(data.message);
					$scope.query_schedule($filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"))
				} else {
					errorServices.autoHide(data.message);
				}
			})
		}
	}
	$scope.query_schedule($filter("date")(new Date().getTime(), "yyyy-MM-dd"));
	$scope.calendar.onDayChange = function() {
		$scope.query_schedule($filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"))
	}
})