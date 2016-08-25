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
			scope.confirm = angular.extend({}, {
				title: "Tips",
				content: "Are You Sure?",
				content_type: "content",
				cancel_text: "cancel",
				ok_text: "ok",
				open: function() {
					$(element).show();
				},
				cancel: function() {
					$(element).hide();
					if (typeof scope.confirm.cancle_callback == "function") {
						scope.confirm.cancle_callback();
					}
				},
				ok: function() {
					$(element).hide();
					if (typeof scope.confirm.ok_callback == "function") {
						scope.confirm.ok_callback();
						scope.confirm.content_type = "content";
					}
				},
				ok_submit: function() {
					scope.confirm.content = $(element).find("input").val();
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