// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("detailController", function($scope, $rootScope, $filter, $routeParams, $sce, $timeout, googleMapServices, scheduleServices, userServices, coursesServices, errorServices, toastServices, localStorageService, config) {
	$scope.course = {};
	toastServices.show();
	coursesServices.query_by_id({
		course_id: $routeParams.course_id,
		latitude: 0,
		longitude: 0
	}).then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.course = data.Result.Course;
		} else {
			errorServices.autoHide(data.message);
		}
	}).then(function(data) {
		$scope.query_schedule($filter("date")(new Date().getTime(), "yyyy-MM-dd"));
	});
	$scope.open_map = function(course, e) {
		e.preventDefault();
		e.stopPropagation();
		$.magnificPopup.open({
			items: {
				// src: "https://maps.google.com/maps?q=" + course.city + course.area + course.street
				src: "<div style='height:500px;width:80%;max-width:800px;margin:auto auto;border:1px solid #d2d2d2;background-color:white' id='map'></div>"
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
	// 加入收藏
	$scope.toggle_like = function() {
		if (!$rootScope.is_signin()) {
			$rootScope.signin();
			return;
		}
		if ($scope.course.is_collection == 0) {
			$scope.like();
		} else {
			$scope.unlike();
		}
	};
	$scope.like = function() {
		toastServices.show();
		userServices.like({
			course_id: $scope.course.course_id
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.course.is_collection = 1;
				$scope.course.collection_id = data.collection_id
				errorServices.autoHide(data.message);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	$scope.unlike = function() {
		toastServices.show();
		userServices.unlike({
			collection_id: $scope.course.collection_id
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.course.is_collection = 0;
				errorServices.autoHide(data.message);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	$scope.parse_age = function(age) {
		if (age && age.split("+").length > 1) {
			return true;
		}
		return false;
	};
	// schedule
	$scope.calendar = {
		mode: "",
		disabled: false,
		disabled_message: "All Day Busy",
		times: []
	}
	$scope.query_schedule = function(day) {
		$scope.calendar.selected = null;
		toastServices.show();
		scheduleServices.query_by_course({
			course_id: $routeParams.course_id,
			user_id: $scope.course.user_id,
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
	$scope.calendar.onDayChange = function() {
		$scope.query_schedule($filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"))
	};
	// 查询课程评价列表
	$scope.comments = [];
	$scope.page = {
		pn: 1,
		page_size: 10,
		message: "Load More",
		course_id: $routeParams.course_id
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "loading...";
		coursesServices.query_comment_by_course($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.comments = $scope.comments.concat(data.Result.Comments.list);
				$scope.total_comments = data.Result.Comments.totalRow;
				$scope.no_more = $scope.comments.length == data.Result.Comments.totalRow ? true : false;
			} else {
				errorServices.autoHide("Server error");
			}
			if ($scope.no_more) {
				$scope.page.message = $scope.comments.length + " records found";
			}
			$scope.page.pn++;
		})

	}
	$scope.loadMore();
	$scope.to_fix = function(m) {
		return m.toFixed(1);
	}
	$scope.parse_html = function(html) {
		if (!html) return;
		return html.replace(/\n/g, "<br>");
	}
	$scope.tab = "about";
	$scope.active_tab = function(tab) {
		$scope.tab = tab;
	}
})