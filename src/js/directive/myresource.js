// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('myresource', function() {
	return {
		restrict: 'E',
		scope: {
			cssResource: "=",
			jsResource: "=",
			jsLoaded: "&"
		},
		link: function(scope, element, attrs) {
			angular.forEach(scope.cssResource, function(value, key) {
				var css_resource_id = "mycssresource-" + key,
					css_resource = "<link id='" + css_resource_id + "' rel='stylesheet' type='text/css' href='" + value + "'>";
				if ($("#" + css_resource_id).length == 0) {
					$("head").append(css_resource);
				}
			})
			var js_resource_size = Object.keys(scope.jsResource).length;
			scope.jsLoaded = scope.jsLoaded || angular.noop;
			angular.forEach(scope.jsResource, function(value, key) {
				var js_resource_id = "myjsresource-" + key,
					js_resource = "<script id='" + js_resource_id + "' type='text/javascript' src='" + value + "'></script>";
				if ($("#" + js_resource_id).length == 0) {
					var js, rjs = document.getElementsByTagName("script")[0];
					if (document.getElementById(js_resource_id)) {
						return;
					}
					js = document.createElement("script");
					js.id = js_resource_id;
					js.src = value;
					js.onload = function() {
						js_resource_size--;
						if (js_resource_size == 0) {
							scope.jsLoaded();
						}
					}
					rjs.parentNode.insertBefore(js, rjs);
				}
			})
		}
	};
});