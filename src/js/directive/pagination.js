// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('pagination', function() {
	return {
		restrict: 'E',
		templateUrl: "../templates/pagination.html",
		scope: {
			paging: "="
		},
		link: function(scope, element, attrs) {
			// function body
			scope.paging = angular.extend({}, {
				pn: 1,
				page_size: 10,
				total_items: 0
			}, scope.paging)
			scope.next = function() {
				scope.paging.pn++;
				scope.valid_page();
				scope.parse_page();
				if (typeof scope.paging.callback == "function") {
					scope.paging.callback()
				};
			}
			scope.prev = function() {
				scope.paging.pn--;
				scope.valid_page();
				scope.parse_page();
				if (typeof scope.paging.callback == "function") {
					scope.paging.callback()
				};
			}
			scope.jump = function(pn) {
				if (scope.paging.pn == pn) {
					return;
				}
				scope.paging.pn = pn;
				scope.valid_page();
				scope.parse_page();
				if (typeof scope.paging.callback == "function") {
					scope.paging.callback()
				};
			}
			scope.paging.pages = [];
			scope.parse_page = function() {
				scope.paging.pages = [];
				if (scope.total_pages > 5) {
					// page < 5 return
					if (scope.paging.pn < 4) {
						scope.paging.pages = ["1", "2", "3", "4", "...", scope.total_pages];
						return;
					}
					// page + 3 > scope.total_pages return
					if (scope.paging.pn + 3 > scope.total_pages) {
						scope.paging.pages = ["1", "...", scope.total_pages - 3, scope.total_pages - 2, scope.total_pages - 1, scope.total_pages];
						return;
					}
					// other
					scope.paging.pages = ["1", "...", scope.paging.pn - 1, scope.paging.pn, scope.paging.pn + 1, "...", scope.total_pages];
					return;
				}
				for (var i = 0; i < scope.total_pages; i++) {
					scope.paging.pages.push(i + 1);
				}
			}
			scope.valid_page = function() {
				scope.total_pages = Math.ceil(scope.paging.total_items / scope.paging.page_size);
				scope.paging.pn = Math.min(scope.paging.pn, scope.total_pages) || 1;
				scope.paging.pn = Math.max(1, scope.paging.pn);
			}
			scope.$watch("paging.total_items", function(n, o) {
				if (n || n === 0) {
					scope.valid_page();
					scope.parse_page();
				}
			})
		}
	};
});