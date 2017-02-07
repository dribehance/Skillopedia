// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('autocomplete', function($window, $timeout) {
	return {
		restrict: 'E',
		scope: {
			location: "=",
			placeholder: "=?",
			mode: "=?"
		},
		templateUrl: "../templates/autocomplete.html",
		link: function(scope, element, attrs) {
			// function body
			// This example displays an address form, using the autocomplete feature
			// of the Google Places API to help users fill in the information.
			scope.placeholder = scope.placeholder || "Street address or Zip Code";
			// set default value
			scope.location = scope.location || {};
			var placeSearch, autocomplete;
			var componentForm = {
				street_number: 'short_name',
				route: 'long_name',
				locality: 'long_name',
				administrative_area_level_1: 'short_name',
				country: 'long_name',
				postal_code: 'short_name'
			};

			function initAutocomplete() {
				// Create the autocomplete object, restricting the search to geographical
				// location types.
				if (!google) return;
				autocomplete = new google.maps.places.Autocomplete(
					/** @type {!HTMLInputElement} */
					($(element).find("input")[0]), {
						// types: ['geocode']
					});

				// When the user selects an address from the dropdown, populate the address
				// fields in the form.
				autocomplete.addListener('place_changed', fillInAddress);
				// geolocate();
			}

			// [START region_fillform]
			function fillInAddress() {
				// Get the place details from the autocomplete object.
				var place = autocomplete.getPlace();
				// angular.element("#autocomplete").val("");
				// for (var component in componentForm) {
				// 	document.getElementById(component).location = '';
				// 	document.getElementById(component).disabled = false;
				// }
				// Get each component of the address from the place details
				// and fill the corresponding field on the form.
				var address = {};
				for (var i = 0; i < place.address_components.length; i++) {
					var addressType = place.address_components[i].types[0];
					if (componentForm[addressType]) {
						var val = place.address_components[i][componentForm[addressType]];
						address[addressType] = val;
						// document.getElementById(addressType).location = val;
					}
				}
				// assign to scope.location
				scope.$apply(function() {
					scope.location.street = "";
					if (address.street_number) {
						scope.location.street += address.street_number;
					}
					if (address.route) {
						scope.location.street += " " + address.route;
					}
					scope.location.country = address.country || "";
					scope.location.state = address.administrative_area_level_1 || "";
					scope.location.city = address.locality || "";
					scope.location.zipcode = address.postal_code || "";
					scope.location.address = (scope.location.street && (scope.location.street + ", ")) + (scope.location.city && (scope.location.city + ", ")) + (scope.location.state && (scope.location.state + ", ")) + scope.location.country;
					if (scope.mode == "street") {
						angular.element("#autocomplete").val(scope.location.street);
					} else {
						angular.element("#autocomplete").val(scope.location.address);
					}
				});
				// scope.location = address;
			}
			// [END region_fillform]

			// [START region_geolocation]
			// Bias the autocomplete object to the user's geographical location,
			// as supplied by the browser's 'navigator.geolocation' object.
			function geolocate() {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						var geolocation = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
						var circle = new google.maps.Circle({
							center: geolocation,
							radius: position.coords.accuracy
						});
						autocomplete.setBounds(circle.getBounds());
					});
				}
			}
			// [END region_geolocation]
			scope.autocomplete = function() {
				if (!autocomplete) {
					initAutocomplete();
				}
				// geolocate();
			};
			// $window.initAutocomplete = initAutocomplete;
			// google.map.addDomEventlistner("window")
		}
	};
});