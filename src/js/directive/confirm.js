// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('confirm', function() {
	return {
		restrict: 'E',
		scope: {
			confirm: "="
		},
		templateUrl: "templates/confirm.html",
		link: function(scope, element, attrs) {
			// function body
			scope.input = {};
			scope.input.location = {};
			scope.check = function() {
				return scope.checked = !scope.checked;
			}
			scope.confirm = angular.extend({}, {
				title: "Tips",
				content: "Are You Sure?",
				content_type: "content",
				cancel_text: "Cancel",
				ok_text: "Ok",
				open: function() {
					$(element).show();
					$("body").css({
						overflow: "hidden"
					});
				},
				close: function() {
					$(element).hide();
					$("body").css({
						overflow: "auto"
					});
				},
				cancel: function() {
					$(element).hide();
					$("body").css({
						overflow: "auto"
					});
					if (typeof scope.confirm.cancle_callback == "function") {
						scope.confirm.cancle_callback();
					}
				},
				ok: function() {
					$(element).hide();
					$("body").css({
						overflow: "auto"
					});
					if (scope.confirm.content_type == "rich_text" && !scope.checked) {
						return;
					}
					if (typeof scope.confirm.ok_callback == "function") {
						scope.confirm.ok_callback();
						scope.confirm.content_type = "content";
					}
				},
				ok_submit: function() {
					$("body").css({
						overflow: "auto"
					});
					scope.confirm.content = scope.input.location.street; //$(element).find("input").val();
					scope.confirm.location = scope.input.location;
					if (!scope.confirm.content) return;
					$(element).hide();
					if (typeof scope.confirm.ok_callback == "function") {
						scope.confirm.ok_callback();
						scope.confirm.content_type = "content";
					}
				}
			}, scope.confirm);
		}
	};
});