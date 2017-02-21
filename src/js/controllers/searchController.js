// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("searchController", function($scope, $rootScope, $routeParams, $location, $timeout, googleMapServices, skillopediaServices, coursesServices, errorServices, toastServices, localStorageService, config) {
	$scope.input = {
		distances: [
			"500-1000mile",
			"1000-1500mile",
			"1500-2000mile",
			"2000-2500mile",
			"2500-3000mile"
		],
		priorities: [
			// "distance",
			"price",
			"review",
			"hot",
		],
		price: 0,
		review: 0,
		hot: 0,
	};
	$scope.input.category = {
		name: $routeParams.category,
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
	// $scope.page = {
	// 	pn: 1,
	// 	page_size: 10,
	// 	message: "Load More",
	// 	kw: $routeParams.keyword,
	// 	zipcode: $routeParams.zipcode,
	// 	latitude: $routeParams.lat || "0",
	// 	longitude: $routeParams.lng || "0",
	// 	category_02_id: $scope.input.category.id,
	// 	category_02_name: $scope.input.category.name,
	// 	distances: $scope.input.distance,
	// 	prioritys: $scope.input.priority,
	// 	session_rate: $scope.input.session_rate,
	// 	result: ""
	// }
	$scope.paging = {
		pn: 1,
		page_size: 10,
		message: "Load More",
		kw: $routeParams.keyword,
		zipcode: $routeParams.zipcode,
		latitude: $routeParams.lat || "0",
		longitude: $routeParams.lng || "0",
		type: $routeParams.type,
		category_02_id: $scope.input.category.id,
		category_02_name: $scope.input.category.name,
		distances: $scope.input.distance,
		prioritys: $scope.input.priority,
		session_rate: $scope.input.session_rate,
		result: ""
	}
	$scope.loadMore = function() {
		// if ($scope.no_more) {
		// 	return;
		// }
		// toastServices.show();
		// $scope.page.message = "loading...";
		// coursesServices.search_by_keyword($scope.page).then(function(data) {
		// 	toastServices.hide();
		// 	$scope.page.message = "Load More";
		// 	if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
		// 		$scope.courses = $scope.courses.concat(data.Result.Courses.list);
		// 		$scope.no_more = $scope.courses.length == data.Result.Courses.totalRow ? true : false;
		// 		if ($scope.courses.length == 0) {
		// 			$scope.page.result = "No record found in this area";
		// 		}
		// 		if ($scope.courses.length == 1) {
		// 			$scope.page.result = data.Result.Courses.totalRow + " record found";
		// 		}
		// 		if ($scope.courses.length > 1) {
		// 			$scope.page.result = data.Result.Courses.totalRow + " records found";
		// 		}
		// 	} else {
		// 		errorServices.autoHide("Server error");
		// 	}
		// 	if ($scope.no_more) {
		// 		if ($scope.courses.length == 0) {
		// 			$scope.page.message = "No record found";
		// 		}
		// 		if ($scope.courses.length == 1) {
		// 			$scope.page.message = data.Result.Courses.totalRow + " record found ";
		// 		}
		// 		if ($scope.courses.length > 1) {
		// 			$scope.page.message = data.Result.Courses.totalRow + " records found ";
		// 		}
		// 	}
		// 	$scope.page.pn++;
		// })
		toastServices.show();
		$scope.paging.message = "loading...";
		coursesServices.search_by_keyword($scope.paging).then(function(data) {
			toastServices.hide();
			$scope.paging.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.courses = data.Result.Courses.list;
				$scope.paging.page_size = $scope.paging.page_size;
				$scope.paging.total_items = data.Result.Courses.totalRow;
				if ($scope.courses.length == 0) {
					$scope.paging.result = "No record found in this area";
				}
				if ($scope.courses.length == 1) {
					$scope.paging.result = data.Result.Courses.totalRow + " record found";
				}
				if ($scope.courses.length > 1) {
					$scope.paging.result = data.Result.Courses.totalRow + " records found";
				}
			} else {
				errorServices.autoHide("Server error");
			}
		})

	}
	$scope.loadMore();
	// reload course;
	$scope.reload = function() {
		// $scope.courses = [];
		// $scope.page = {
		// 	pn: 1,
		// 	page_size: 10,
		// 	message: "Load More",
		// 	kw: $routeParams.keyword,
		// 	zipcode: $routeParams.zipcode,
		// 	latitude: $routeParams.lat || "0",
		// 	longitude: $routeParams.lng || "0",
		// 	category_02_id: $scope.input.category.id,
		// 	category_02_name: $scope.input.category.name,
		// 	distances: $scope.input.distance,
		// 	prioritys: $scope.input.priority,
		// 	session_rate: $scope.input.session_rate
		// }
		// $scope.no_more = false;
		$scope.paging = angular.extend({}, $scope.paging, {
			pn: $scope.paging.pn,
			page_size: $scope.paging.page_size,
			message: "Load More",
			kw: $routeParams.keyword,
			type: "2",
			zipcode: $routeParams.zipcode,
			latitude: $routeParams.lat || "0",
			longitude: $routeParams.lng || "0",
			category_02_id: $scope.input.category.id,
			category_02_name: $scope.input.category.name,
			distances: $scope.input.distance,
			prioritys: $scope.input.priority,
			price_type: $scope.input.price,
			review_type: $scope.input.review,
			hot_type: $scope.input.hot,
			travel_to_session: $scope.input.travel != 1 ? "" : $scope.input.travel,
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
		$scope.paging.pn = 1;
		$scope.reload();
	}, true);
	$scope.$watch("input.priority", function(n, o) {
		if (n === o) {
			return;
		}
		$scope.paging.pn = 1;
		$scope.reload();
	}, true);
	// filter by priority;
	$scope.remove = function(condition) {
		$scope.input[condition] = "";
	}
	$scope.price_callback = function(position, value) {
		$scope.input.session_rate = value;
		$timeout(function() {
			$scope.reload();
		}, 100)
	}
	$scope.distance_callback = function(position, value) {
		$scope.input.distance = value;
		$timeout(function() {
			$scope.reload();
		}, 100)
	};
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
	$scope.input.travel = 0;
	$scope.travel = function() {
		if ($scope.input.travel == 0) {
			$scope.input.travel = 1;
		} else {
			$scope.input.travel = 0;
		}
		$scope.paging.pn = 1;
		$scope.reload();
	};
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
	// go to detail
	$scope.local_go = function(id) {
		$location.path("detail").search({
			category: null,
			cagegory_id: null,
			course_id: id
		});
	};
	// recommand and hot
	// toastServices.show();
	// skillopediaServices.query_recommand_category().then(function(data) {
	// 	toastServices.hide()
	// 	if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
	// 		$scope.recommands = data.Result.Catetorys;
	// 	} else {
	// 		errorServices.autoHide(data.message);
	// 	}
	// })
})