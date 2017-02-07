 // by dribehance <dribehance.kksdapp.com>
 // EventHandle
 angular.module("Skillopedia").factory("appServices", function($rootScope, $window, $location, $timeout, browserServices, googleMapServices, userServices, localStorageService, errorServices, toastServices, config) {
 	var routeChangeStart = function(e) {
 		// do something white routechangestart,eg:
 		// toastServices.start();
 	}
 	var routeChangeSuccess = function(e, currentRoute, prevRoute) {
 		// do something white routechangesuccess,eg:
 		toastServices.hide();
 		errorServices.hide();
 		// toastServices.done();
 		navBarHandler(e, currentRoute, prevRoute);
 	}
 	var routeChangeError = function(e, currentRoute, prevRoute) {
 		// do something white routechangesuccess,eg:
 		// $rootScope.back();
 	}
 	var navBarHandler = function(e, currentRoute, prevRoute) {
 		// handle navbar
 	}
 	var onBackKeyDown = function() {
 		$rootScope.$apply(function() {
 			$rootScope.back();
 		});
 	}
 	var popup_signin = function() {
 		$.magnificPopup.open({
 			items: {
 				src: '#signin-popup'
 			},
 			type: 'inline'
 		}, 0);
 	}
 	var close_popup_signin = function() {
 		$.magnificPopup.close();
 	}
 	return {
 		init: function() {
 			$rootScope.$on("$routeChangeStart", routeChangeStart);
 			$rootScope.$on("$routeChangeSuccess", routeChangeSuccess);
 			$rootScope.$on("$routeChangeError", routeChangeError);
 			$rootScope.signin = function() {
 				$rootScope.sign = "signin";
 				popup_signin();
 			}
 			$rootScope.signup = function() {
 				$rootScope.sign = "signup";
 				popup_signin();
 			}
 			$rootScope.forget = function() {
 				$rootScope.sign = "forget";
 				popup_signin();
 			}
 			$rootScope.back = function() {
 				$window.history.back();
 			}
 			$rootScope.go = function(path) {
 				$location.path(path);
 			}
 			$rootScope.popup_signin = function() {
 				popup_signin();
 			}
 			$rootScope.close_popup_signin = function() {
 				close_popup_signin();
 			}
 			$rootScope.is_signin = function() {
 				if (localStorageService.get("token")) {
 					return true;
 				}
 				return false;
 			}
 			if (localStorageService.get("token")) {
 				userServices.sync();
 			}
 			$rootScope.staticImageUrl = config.imageUrl;
 			$rootScope.sr = ScrollReveal({
 				delay: 200,
 			});
 			// $rootScope.isIE = false;
 			// if (browserServices.isIE) {
 			// 	$rootScope.isIE = true;
 			// }
 			// $rootScope.onload = false;
 			browserServices.detect();
 			// $timeout(function() {
 			// 	googleMapServices.geolocation().then(function(data) {
 			// 		console.log(data)
 			// 	})
 			// }, 10000)
 		}
 	}
 });