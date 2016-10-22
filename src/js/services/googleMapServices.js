// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").factory("googleMapServices", function($http, $q, config) {
	return {
		create_map: function(container, latlng) {
			var map = new google.maps.Map(container, {
				zoom: 11,
				minZoom: 9,
				maxZoom: 12,
				center: latlng,
				// disableDoubleClickZoom: true,
				// draggable: true,
				// scrollwheel: false,
				// zoomControl: false,
				// mapTypeId: google.maps.MapTypeId.TERRAIN
			});
			return map;
		},
		create_marker: function(map, latlng) {
			var marker = new google.maps.Marker({
				position: latlng,
				map: map,
				// draggable: true,
			});
			return marker;
		},
		create_circle_marker: function(map, latlng) {
			var marker = new google.maps.Marker({
				position: latlng,
				map: map,
				icon: {
					url: "../images/spotlight-poi.png",
					// origin: new google.maps.Point(50, 50)
				},
				draggable: false,
			});
			return marker;
		},
		create_circle: function(map, latlng) {
			var cityCircle = new google.maps.Circle({
				strokeColor: '#0087ff',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#0087ff',
				fillOpacity: 0.35,
				map: map,
				center: latlng,
				radius: 100
			});
			return cityCircle;
		},
		// code address by http
		geocoding: function(input) {
			return $http({
				// by dribehance <dribehance.kksdapp.com>
				url: "https://maps.googleapis.com/maps/api/geocode/json?language=en",
				method: "GET",
				params: angular.extend({}, {
					key: config.key.google
				}, input)
			}).then(function(data) {
				return data.data;
			});
		},
		// code address by google map Geocoder
		code_address: function(address) {
			var defer = $q.defer();
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				"address": address
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					defer.resolve({
						lat: results[0].geometry.location.lat(),
						lng: results[0].geometry.location.lng()
					});
				}
			})
			return defer.promise;
		},
		geolocation: function(input) {
			return $http({
				// by dribehance <dribehance.kksdapp.com>
				url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDIpIlb2GW79e-dFuxvs43YyrG9GQaaIpc",
				method: "POST",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				transformRequest: function(obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				}
			}).then(function(data) {
				return data.data;
			});
		},
	}
});