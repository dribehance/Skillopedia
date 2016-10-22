// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("listController", function($scope, $rootScope, $timeout, $routeParams, $location, googleMapServices, skillopediaServices, coursesServices, errorServices, toastServices, localStorageService, config) {
	$scope.input = {
		price: 0,
		review: 0,
		hot: 0,
	};
	$scope.input.category = {
		name: $routeParams.type == "2" ? $routeParams.category : "",
		id: $routeParams.category_id || "0"
	};
	// query category list;
	skillopediaServices.query_all_second_category().then(function(data) {
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.categorys = data.Result.Categorys;
		} else {
			errorServices.autoHide(data.message);
		}
	});
	// query course list;
	$scope.courses = [];
	$scope.paging = {
		pn: 1,
		page_size: 10,
		message: "Load More",
		kw: $routeParams.kw,
		type: $routeParams.type,
		latitude: "0",
		longitude: "0",
		category_02_id: $scope.input.category.id,
		category_02_name: $scope.input.category.name,
		distances: $scope.input.distance,
		prioritys: $scope.input.priority,
		session_rate: $scope.input.session_rate
	}
	$scope.loadMore = function() {
		toastServices.show();
		$scope.paging.message = "loading...";
		coursesServices.query($scope.paging).then(function(data) {
			toastServices.hide();
			$scope.paging.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.courses = data.Result.Courses.list;
				$scope.paging.page_size = $scope.paging.page_size;
				$scope.paging.total_items = data.Result.Courses.totalRow;
			} else {
				errorServices.autoHide("Server error");
			}
		})

	}
	$scope.loadMore();
	// reload course;
	$scope.reload = function() {
		// $location.search({
		// 	category: null,
		// 	category_id: null
		// });
		// $scope.courses = [];
		$scope.paging = angular.extend({}, $scope.paging, {
			pn: $scope.paging.pn,
			page_size: $scope.paging.page_size,
			message: "Load More",
			kw: $routeParams.kw,
			type: "2",
			latitude: "0",
			longitude: "0",
			category_02_id: $scope.input.category.id,
			category_02_name: $scope.input.category.name,
			distances: $scope.input.distance,
			prioritys: $scope.input.priority,
			price_type: $scope.input.price,
			review_type: $scope.input.review,
			hot_type: $scope.input.hot,
			travel_to_session: $scope.input.travel,
			session_rate: $scope.input.session_rate
		})
		$scope.loadMore();
	};
	$scope.paging.callback = function() {
		$scope.reload();
	};
	// filter by category;
	$scope.$watch("input.category", function(n, o) {
		if (n === o) {
			return;
		}
		$scope.reload();
	}, true);
	var sort_1 = sort_2 = sort_3 = 0;
	$scope.sort_by_price = function() {
		$scope.input.review = sort_2 = 0;
		$scope.input.hot = sort_3 = 0;
		$scope.input.price = sort_1++ % 2 + 1;
		$scope.reload();
	};
	$scope.sort_by_review = function() {
		$scope.input.price = sort_1 = 0;
		$scope.input.hot = sort_3 = 0;
		$scope.input.review = sort_2++ % 2 + 1;
		$scope.reload();
	};
	$scope.sort_by_hot = function() {
		$scope.input.price = sort_1 = 0;
		$scope.input.review = sort_2 = 0;
		$scope.input.hot = sort_3++ % 2 + 1;
		$scope.reload();
	};
	var travel = 0;
	$scope.travel_yes = function() {
		$scope.input.travel = 1;
		$scope.reload();
	};
	$scope.travel_no = function() {
		$scope.input.travel = 0;
		$scope.reload();
	};
	$scope.open_map = function(course, e) {
		e.preventDefault();
		e.stopPropagation();
		$.magnificPopup.open({
			items: {
				// src: "https://maps.google.com/maps?q=" + course.city + course.area + course.street
				src: "<div style='height:300px;border:1px solid #d2d2d2;background-color:white' id='map'></div>"
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
	// go to detail
	$scope.local_go = function(id) {
		$location.path("detail").search({
			category: null,
			cagegory_id: null,
			course_id: id
		});
	};
	$scope.price_callback = function(position, value) {
		$scope.input.session_rate = value;
		$timeout(function() {
			$scope.reload();
		}, 100)
	}
})