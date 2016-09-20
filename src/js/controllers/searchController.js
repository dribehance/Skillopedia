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
		]
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
	$scope.page = {
		pn: 1,
		page_size: 10,
		message: "Load More",
		kw: $routeParams.keyword,
		zipcode: $routeParams.zipcode,
		latitude: $routeParams.lat || "0",
		longitude: $routeParams.lng || "0",
		category_02_id: $scope.input.category.id,
		category_02_name: $scope.input.category.name,
		distances: $scope.input.distance,
		prioritys: $scope.input.priority,
		result: ""
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "loading...";
		coursesServices.search_by_keyword($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "Load More";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.courses = $scope.courses.concat(data.Result.Courses.list);
				$scope.no_more = $scope.courses.length == data.Result.Courses.totalRow ? true : false;
				$scope.page.result = data.Result.Courses.totalRow + "records about '" + $scope.page.kw + "'";
			} else {
				errorServices.autoHide("Server error");
			}
			if ($scope.no_more) {
				$scope.page.message = $scope.courses.length + " records found";
			}
			$scope.page.pn++;
		})

	}
	$scope.loadMore();
	// reload course;
	$scope.reload = function() {
		$scope.courses = [];
		$scope.page = {
			pn: 1,
			page_size: 10,
			message: "Load More",
			kw: $routeParams.keyword,
			zipcode: $routeParams.zipcode,
			latitude: $routeParams.lat || "0",
			longitude: $routeParams.lng || "0",
			category_02_id: $scope.input.category.id,
			category_02_name: $scope.input.category.name,
			distances: $scope.input.distance,
			prioritys: $scope.input.priority
		}
		$scope.no_more = false;
		$scope.loadMore();
	};
	// filter by category;
	$scope.$watch("input.category", function(n, o) {
		if (n === o) {
			return;
		}
		$scope.reload();
	}, true);
	$scope.$watch("input.priority", function(n, o) {
		if (n === o) {
			return;
		}
		$scope.reload();
	}, true);
	// filter by priority;
	$scope.remove = function(condition) {
		$scope.input[condition] = "";
	}
	$scope.$on("slideEnd", function(e, m) {
		$scope.input.distance = m;
		$timeout(function() {
			$scope.reload();
		}, 100)
	});
	// $scope.sidebar = {
	// 	title: "recommand"
	// }
	// $scope.change_sidebar = function(title) {
	// 	$scope.sidebar.title = title;
	// }
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
	// recommand and hot
	toastServices.show();
	skillopediaServices.query_recommand_category().then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.recommands = data.Result.Catetorys;
		} else {
			errorServices.autoHide(data.message);
		}
	})
})