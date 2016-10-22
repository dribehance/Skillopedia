// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("searchFormController", function($scope, $timeout, $routeParams, $location, googleMapServices, skillopediaServices, filterFilter, errorServices, toastServices, localStorageService, config) {
	$scope.input = {
		keyword: "",
		zipcode: "",
		suggestions: []
	}
	var suggestions = [],
		categorys = [];
	// query zipcode
	// toastServices.show();
	// skillopediaServices.query_zipcode().then(function(data) {
	// 	toastServices.hide()
	// 	if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
	// 		suggestions = data.Result.CityBeans;
	// 	} else {
	// 		errorServices.autoHide(data.message);
	// 	}
	// });
	// query category list;
	skillopediaServices.query_all_second_category().then(function(data) {
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			categorys = data.Result.Categorys;
		} else {
			errorServices.autoHide(data.message);
		}
	});
	// $scope.$watch("input.zipcode", function(n, o) {
	// 	$scope.input.suggestions = filterFilter(suggestions, n);
	// })
	$scope.input.zipcode = $routeParams.zipcode || "";
	$scope.input.keyword = $routeParams.keyword || "";
	$scope.select = function(s) {
		$scope.input.zipcode = s.zipcode;
		$timeout(function() {
			$scope.input.suggestions = [];
		}, 100)
	}
	$scope.$watch("input.keyword", function(n, o) {
		$scope.input.categorys = filterFilter(categorys, n);
		if ($scope.input.categorys.length == 0) {
			$scope.input.categorys = categorys;
		}
	});
	$scope.focus = function() {
		$scope.input.categorys = categorys;
		$scope.input.focus = true;
	};
	$scope.blur = function() {
		$timeout(function() {
			$scope.input.focus = false;
		}, 350)
	};
	$scope.select_category = function(c) {
		$scope.input.keyword = c.category_02_name;
		$timeout(function() {
			$scope.input.categorys = [];
		}, 100)
	}
	$scope.ajaxForm = function() {
		var address = $("#autocomplete").val()
		if (!address) {
			$scope.confirm.title = "";
			$scope.confirm.content_text = "Please tell us your location so we can introduce coaches fit you";
			$scope.confirm.content_type = "autocomplete";
			$scope.confirm.ok_text = "Use this location";
			$scope.confirm.cancel_text = "Skip and search";
			$scope.confirm.open();
			$scope.confirm.cancle_callback = function() {
				$location.path("search").search({
					keyword: $scope.input.keyword,
					zipcode: address
				});
			}
			$scope.confirm.ok_callback = function() {
				$scope.search($scope.confirm.content)
			}
			return;
		}
		$scope.search(address);
	}
	$scope.search = function(address) {
		toastServices.show();
		googleMapServices.code_address(address).then(function(data) {
			toastServices.hide();
			$location.path("search").search({
				keyword: $scope.input.keyword,
				zipcode: address,
				lat: data.lat,
				lng: data.lng,
			});
		})
	}
})