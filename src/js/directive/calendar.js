// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('calendar', function($filter, localStorageService) {
	return {
		restrict: 'E',
		templateUrl: 'templates/calendar.html',
		scope: {
			calendar: "=",
		},
		link: function(scope, element, attrs) {
			var today = new Date();
			today.setDate(today.getDate() - 1);
			scope.nowaday = $filter("date")(today, "yyyy-MM-dd");

			scope.calendar = angular.extend({}, scope.calendar);
			scope.calendar.day = scope.calendar.day || $filter("date")(new Date());
			// edit mode
			scope.$watch("calendar.day", function(n, o) {
				if (n && typeof scope.calendar.onDayChange == "function") {
					scope.calendar.onDayChange()
				}
			})
			if (scope.calendar.mode == "edit") {
				// scope.calendar = angular.extend({}, scope.calendar);
				scope.calendar.selected = [];
				scope.select = function(time, index) {
					var next = index + 1;
					next = next > scope.calendar.times.length - 1 ? scope.calendar.times.length - 1 : next;
					if (index == next) {
						return;
					}
					// schedule_state_1 disabled,schedule_state_2 busy,schedule_state_3 free
					if (time.schedule_state == 3 && scope.calendar.times[next].schedule_state == 3 && scope.calendar.selected.length < scope.calendar.size) {
						time.schedule_state = 2;
						time.active = true;
						var selected_time = {
							from: time,
							to: scope.calendar.times[next]
						}
						scope.calendar.times[next].schedule_state = 2;
						scope.calendar.times[next].active = true;
						scope.calendar.selected.push(selected_time);
						return;
					}
					if (time.schedule_state == 2) {
						scope.calendar.selected.map(function(t) {
							if (t.from == time || t.to == time) {
								scope.calendar.remove(t);
							}
							return t;
						})
						return;
					}
				};
				scope.calendar.remove = function(selected) {
					scope.calendar.selected = scope.calendar.selected.filter(function(s) {
						return s != selected;
					})
					scope.calendar.times = scope.calendar.times.map(function(t) {
						if ((t.day == selected.from.day && t.hour == selected.from.hour) || (t.day == selected.to.day && t.hour == selected.to.hour)) {
							t.schedule_state = 3;
							t.active = false;
						}
						return t;
					});
				}
				return;
			};
			// confirm mode
			if (scope.calendar.mode == "confirm") {
				// scope.calendar = angular.extend({}, scope.calendar);
				scope.calendar.selected = [];
				scope.select = function(time, index) {
					var next = index + 1;
					next = next > scope.calendar.times.length - 1 ? scope.calendar.times.length - 1 : next;
					if (index == next) {
						return;
					}
					// schedule_state_1 disabled,schedule_state_2 busy,schedule_state_3 free
					if (time.schedule_state == 3 && scope.calendar.times[next].schedule_state == 3 && scope.calendar.selected.length < scope.calendar.size) {
						time.schedule_state = 2;
						time.active = true;
						var selected_time = {
							from: time,
							to: scope.calendar.times[next]
						}
						scope.calendar.times[next].schedule_state = 2;
						scope.calendar.times[next].active = true;
						scope.calendar.selected.push(selected_time);
					}
				};
				scope.calendar.remove = function(selected) {
					scope.calendar.selected = scope.calendar.selected.filter(function(s) {
						return s != selected;
					})
					scope.calendar.times = scope.calendar.times.map(function(t) {
						if ((t.day == selected.from.day && t.hour == selected.from.hour) || (t.day == selected.to.day && t.hour == selected.to.hour)) {
							t.schedule_state = 3;
							t.active = false;
						}
						return t;
					});
				}
				return;
			};
			// preview model
			if (scope.calendar.mode == "preview") {
				// var last = current = {};
				// scope.select = function(time, index) {
				// 	last = current;
				// 	current = time;
				// 	last.active = false;
				// 	current.active = true;
				// 	scope.calendar.selected = time;
				// };
				scope.calendar.selected = [];
				scope.select = function(time, index) {
					time.active = !time.active;
					time.active && scope.calendar.selected.push(time);
				};
			}
		}
	};
});