// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("indexController", function($scope, $rootScope, $location, $timeout, skillopediaServices, errorServices, toastServices, localStorageService, config) {
	// banner
	toastServices.show();
	skillopediaServices.query_banner().then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.banners = data.Result.homeBanner;
		} else {
			errorServices.autoHide(data.message);
		}
	});
	// base category
	toastServices.show();
	skillopediaServices.query_base_category().then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.sport = data.Result.Category01s[0];
			$scope.arts = data.Result.Category01s[1];
			$rootScope.sr.reveal('.feature-item', 50);
		} else {
			errorServices.autoHide(data.message);
		}
	});
	$scope.open_left_feature = function(e) {
		var target = e.currentTarget;
		if ($(target).hasClass("active")) {
			return;
		}
		toastServices.show();
		skillopediaServices.query_second_category({
			category_01_id: $scope.sport.category_01_id
		}).then(function(data) {
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.sport_seconds = data.Result.Category02s;
				$timeout(function() {
					toastServices.hide()
					open_left_feature(e);
				}, 100)
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
	$scope.open_right_feature = function(e) {
		var target = e.currentTarget;
		if ($(target).hasClass("active")) {
			return;
		}
		toastServices.show();
		skillopediaServices.query_second_category({
			category_01_id: $scope.arts.category_01_id
		}).then(function(data) {
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.art_seconds = data.Result.Category02s;
				$timeout(function() {
					toastServices.hide()
					open_right_feature(e);
				}, 100)
			} else {
				errorServices.autoHide(data.message);
			}
		})

	}
	$scope.close_left = function(e) {
		close_left(e);
	};
	$scope.close_right = function(e) {
		close_right(e);
	};
	// hot
	toastServices.show();
	skillopediaServices.query_recommand_category().then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.hots = data.Result.Catetorys;
			$timeout(function() {
				$(".category-large").hover(function() {
					$(this).find("img").addClass("active");
					$(this).find(".category-caption").addClass("hover");
				}, function() {
					$(this).find("img").removeClass("active");
					$(this).find(".category-caption").removeClass("hover");
				});
				$(".category-small").hover(function() {
					$(this).find(".category-caption").addClass("hover");
				}, function() {
					$(this).find(".category-caption").removeClass("hover");
				});
				$rootScope.sr.reveal('.category-large', 50);
				$rootScope.sr.reveal('.category-small', 50);
			}, 1000)
		} else {
			errorServices.autoHide(data.message);
		}
	})
	$scope.go_list = function(sport_second) {
		var coming_soon = ["Baking", "Dance", "Yoga", "Painting"];
		if (coming_soon.includes(sport_second.category_02_name)) {
			errorServices.autoHide("Coming soon");
			return;
		}
		$location.path("list").search({
			category: sport_second.category_02_name,
			category_id: sport_second.category_02_id,
			type: 2
		});
	}
});