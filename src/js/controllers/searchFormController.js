// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("searchFormController", function($scope, $timeout, $routeParams, $location, googleMapServices, skillopediaServices, filterFilter, errorServices, toastServices, localStorageService, config) {
	$scope.input = {
		keyword: "",
		zipcode: "",
		suggestions: []
	}
	$scope.input.keyword = $routeParams.keyword || "";
	if ($routeParams.location) {
		$scope.input.location = JSON.parse($routeParams.location);
	}
	var suggestions = [],
		categorys = [];
	// query category list;
	skillopediaServices.query_all_second_category().then(function(data) {
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			categorys = data.Result.Categorys;
		} else {
			errorServices.autoHide(data.message);
		}
	});
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
		// var address = $("#autocomplete").val();
		var address = "";
		if ($scope.input.location.street) {
			address += $scope.input.location.street + ", ";
		}
		if ($scope.input.location.city) {
			address += $scope.input.location.city + ", ";
		}
		if ($scope.input.location.state) {
			address += $scope.input.location.state + ", ";
		}
		if ($scope.input.location.zipcode) {
			address += $scope.input.location.zipcode + ", ";
		}
		address = address.substring(0, address.length - 2);
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
					zipcode: address,
					location: JSON.stringify($scope.input.location)
				});
			}
			$scope.confirm.ok_callback = function() {
				$scope.input.location = $scope.confirm.location;
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
				location: JSON.stringify($scope.input.location),
				lat: data.lat,
				lng: data.lng,
			});
		})
	}
})