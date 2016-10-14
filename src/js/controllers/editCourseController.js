// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("editCourseController", function($scope, $routeParams, $rootScope, $sce, $timeout, $location, $window, googleMapServices, skillopediaServices, filterFilter, coursesServices, errorServices, toastServices, localStorageService, config) {
	// 未认证，跳转认证
	// agent_level 1:普通用户 2:教练
	if ($rootScope.user.agent_level != "2") {
		$location.path("authenication").replace();
		return;
	}
	$window.onbeforeunload = function(e) {
		var dialogText = '确定离开网页吗？';
		e.returnValue = dialogText;
		return dialogText;
	}
	$scope.input = {};
	$scope.step = 1;
	$scope.show_step = function(step) {
		$scope.step = step;
		$("body").scrollTop(0);
	};
	// // 获取新建课程id
	// toastServices.show();
	// coursesServices.prapare_create_course().then(function(data) {
	// 	toastServices.hide()
	// 	if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
	// 		$scope.course_id = data.course_id
	// 	} else {
	// 		errorServices.autoHide(data.message);
	// 	}
	// });
	// 获取编辑课程详情
	$scope.course = {};
	toastServices.show();
	coursesServices.query_by_user({
		course_id: $routeParams.id,
	}).then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.course = data.Result.Course;
			$scope.input.title = $scope.course.title;
			// $scope.input.category_1 = 
			// $scope.input.category_2 = 
			parse_category();
			parse_certs($scope.course.CourseCertifications);
			// overview
			$scope.input.overview = $scope.course.overview;
			$scope.input.achievements = $scope.course.achievements;
			$scope.input.specialist = $scope.course.specialist;
			// covers
			$scope.input.covers = $scope.course.CourseBanners.map(function(c) {
				return c.image_01;
			});
			// video
			$scope.input.videos = $scope.course.videos.split("#").map(function(v) {
				var video = {
					id: new Date().getTime(),
					url: v
				}
				return video;
			}).filter(function(v) {
				return v.url
			});
			$scope.input.teaching_since = $scope.course.teaching_since;
			$scope.input.rate = $scope.course.session_rate;
			$scope.input.teaching_age = $scope.course.teaching_age;
			$scope.input.partner = $scope.course.additional_partner;
			$scope.input.surcharge = $scope.course.surcharge_for_each;
			parse_discount();
			$scope.input.travel_to_session = $scope.course.travel_to_session;
			$scope.input.distance = $scope.course.travel_to_session_distance;
			$scope.input.traffic_cost = $scope.course.travel_to_session_trafic_surcharge;
			$scope.input.street = $scope.course.street;
			$scope.input.apt = $scope.course.address;
			$scope.input.city = $scope.course.area;
			$scope.input.state = $scope.course.city;
			$scope.parse_weeks();
			// zipcode
			$scope.input.zipcode = $scope.course.zipcode;
			$scope.input.poster = $scope.course.user_images_01;
			// pickadate
			// $timeout(function() {
			// 	$(".pickadate").pickadate();
			// }, 0);
			$scope.input.hours = $scope.course.hours;
		} else {
			errorServices.autoHide(data.message);
		}
	});
	// 分类列表
	$scope.category_1 = [];
	$scope.category_2 = {};
	$scope.$watch("input.category_1", function(n, o) {
		if (n === o) return;
		if (o === undefined) return;
		if ($scope.category_2[n.name]) {
			$scope.input.category_2 = $scope.category_2[n.name][0];
		}
	});

	function parse_category() {
		toastServices.show();
		coursesServices.query_category().then(function(data) {
			toastServices.hide();
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				angular.forEach(data.Result.Categorys, function(category) {
					var obj = {};
					obj.name = category.category_01_name;
					obj.id = category.category_01_id;
					$scope.category_1.push(obj);
					$scope.category_2[category.category_01_name] = [];
					angular.forEach(category.category02s, function(sub) {
						var temp_obj = {};
						temp_obj.name = sub.category_02_name;
						temp_obj.id = sub.category_02_id;
						$scope.category_2[category.category_01_name].push(temp_obj);
					})
				});
				// $scope.input.category_1 = $scope.category_1[0];
				// $scope.input.category_2 = $scope.category_2[$scope.input.category_1.name][0];
				angular.forEach($scope.category_1, function(c1) {
					if (c1.id == $scope.course.category_01_id) {
						$scope.input.category_1 = c1;
					}
				})
				angular.forEach($scope.category_2[$scope.input.category_1.name], function(c2) {
					if (c2.id == $scope.course.category_02_id) {
						$scope.input.category_2 = c2;
					}
				})

			} else {
				errorServices.autoHide(data.message);
			}
		});
	}
	// 证书列表
	$scope.input.certs = [];

	function parse_certs(certs) {
		angular.forEach(certs, function(cert) {
			var c = {
				id: cert.course_certification_id,
				random_id: "",
				title: cert.name,
				time: cert.get_time,
				url: cert.image_01,
				institute: cert.institue
			};
			$scope.input.certs.push(c);
		})
	}
	// 增加证书输入
	$scope.add_cert = function() {
		var cert = {
			id: "",
			random_id: "",
			title: "",
			time: "",
			url: "",
			institute: ""
		};
		$scope.input.certs.push(cert);
	};
	$scope.remove_cert = function(cert) {
		$scope.input.certs = $scope.input.certs.filter(function(c) {
			return cert != c;
		})
		if (cert.id == "") return;
		toastServices.show();
		coursesServices.remove_certification({
			course_certification_id: cert.id
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	// 提交证书
	$scope.ajaxCert = function(cert, form) {
		if (form.$invalid) return;
		toastServices.show();
		coursesServices.create_certification({
			course_id: $routeParams.id,
			name: cert.title,
			get_time: cert.time,
			institue: cert.institute,
			filename: cert.url
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				cert.id = data.course_certification_id;
				errorServices.autoHide(data.message);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	// 编辑证书
	$scope.editCert = function(cert, form) {
		if (form.$invalid) return;
		toastServices.show();
		coursesServices.edit_certification({
			course_certification_id: cert.id,
			name: cert.title,
			get_time: cert.time,
			institue: cert.institute,
			filename: cert.url
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	// 封面
	$scope.$on("upload_poster_success", function(event, args) {
		$scope.input.poster = args.message;
	});
	// 其他图片
	// mock {id:"",url:""}
	$scope.input.covers = [];
	$scope.$on("upload_cover_success", function(event, args) {
		$scope.input.covers.push(args.message)
	});
	// 移除封面
	$scope.remove_cover = function(cover) {
		$scope.input.covers = $scope.input.covers.filter(function(c) {
			return cover != c;
		})
	};
	// video 视频路径
	$scope.input.videos = [];
	// 增加视频输入
	$scope.add_video = function() {
		var video = {
			id: new Date().getTime(),
			url: "",
		}
		$scope.input.videos.push(video);
	};
	$scope.remove_video = function(video) {
		$scope.input.videos = $scope.input.videos.filter(function(v) {
			return video != v;
		})
	};
	// 第二步
	// 课程时长
	$scope.course_durations = ["60"];
	$scope.input.course_duration = $scope.course_durations[0];
	// teaching since
	$scope.input.teaching_since = "";
	// 课程费用
	$scope.input.rate = "";
	// 教育年限
	$scope.input.teaching_age = "";
	// addtional partner
	$scope.input.partner = "";
	$scope.input.surcharge = "";
	// 打折方式
	function parse_discount() {
		$scope.input.discount_1 = {
			purchase: $scope.course.discount_onetion_pur_money_01,
			off: $scope.course.discount_price_01
		};
		$scope.input.discount_2 = {
			purchase: $scope.course.discount_onetion_pur_money_02,
			off: $scope.course.discount_price_02
		};
		$scope.input.discount_3 = {
			purchase: $scope.course.discount_onetion_pur_money_03,
			off: $scope.course.discount_price_03
		};
	};
	$scope.$watch("input.discount_1", function(n, o) {
		if (!n) return;
		if ($scope.input.discount_2.off < n.off) {
			$scope.input.discount_2.off = n.off;
		}
		if ($scope.input.discount_3.off < $scope.input.discount_2.off) {
			$scope.input.discount_3.off = $scope.input.discount_2.off;
		}
	}, true);
	$scope.$watch("input.discount_2", function(n, o) {
		if (!n) return;
		if ($scope.input.discount_3.off < n.off) {
			$scope.input.discount_3.off = n.off;
		}
	}, true);
	// 第三步
	$scope.input.travel_to_session = "1";
	$scope.input.distance = "";
	$scope.input.traffic_cost = "";
	$scope.input.street = "";
	$scope.input.apt = "";
	$scope.input.city = "";
	$scope.input.state = "";
	// zipcode
	$scope.input.zipcode = "";
	// var suggestions = [];
	// toastServices.show();
	// skillopediaServices.query_zipcode().then(function(data) {
	// 	toastServices.hide()
	// 	if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
	// 		suggestions = data.Result.CityBeans;
	// 	} else {
	// 		errorServices.autoHide(data.message);
	// 	}
	// })
	// $scope.$watch("input.zipcode", function(n, o) {
	// 	$scope.input.suggestions = filterFilter(suggestions, n);
	// })
	// $scope.select = function(s) {
	// 	$scope.input.zipcode = s;
	// 	$timeout(function() {
	// 		$scope.input.suggestions = [];
	// 	}, 100)
	// };
	$scope.location_mode = "edit";
	$scope.lat_lng = {
		lng: 0,
		lat: 0
	}
	$scope.save_location = function() {
		toastServices.show();
		googleMapServices.geocoding({
			address: $scope.input.street + "," + $scope.input.apt + "," + $scope.input.city + "," + $scope.input.state + "," + $scope.input.zipcode
		}).then(function(data) {
			toastServices.hide();
			var result = data.results.filter(function(r) {
				return !r.partial_match;
			});
			if (result.length == 0) {
				$scope.street_error = "the street name or number appears to be invalid";
				return;
			}
			$scope.street_error = "";
			$scope.location_mode = "preview";
			$scope.lat_lng = result[0].geometry.location;
			$scope.format_address = result[0].formatted_address;
			var map = googleMapServices.create_map(document.getElementById('map'), $scope.lat_lng);
			// console.log(map)
			var marker = googleMapServices.create_marker(map, $scope.lat_lng);
			marker.addListener("dragend", function(e) {
				$scope.$apply(function() {
					$scope.lat_lng = e.latLng.toJSON()
				})
			})
		})
	}
	$scope.edit_location = function() {
		$scope.location_mode = "edit";
	};
	// parse iframe map url
	$scope.get_map = function(state, city, street, apt) {
		var map_url = "https://maps.google.com/maps?q=" + state + city + street + apt + "&output=embed";
		return $sce.trustAsResourceUrl(map_url);
	};
	// 第四步;
	$scope.parse_weeks = function() {
		var weeks = [],
			week_name = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		for (var i = 0; i < 17; i++) {
			for (var j = 0; j < 8; j++) {
				// first
				if (i == 0 && j == 0) {
					weeks.push({
						week: "",
						time: "",
						check: false,
						text: "",
						type: "blank"
					});
					continue;
				}
				// first line
				if (i == 0) {
					weeks.push({
						week: "",
						time: "",
						check: false,
						text: week_name[j],
						type: "header"
					});
					continue;
				}
				// first col 
				if (j == 0) {
					var time = i + 5;
					weeks.push({
						week: "",
						time: "",
						check: false,
						text: time + ":00",
						type: "index"
					});
					continue;
				}
				var time = 2 * i - 1,
					week = j,
					time_reg = new RegExp("^" + time + "@" + week + "|" + "#" + time + "@" + week, "g"),
					check = false;
				if ($scope.course.hours.match(time_reg)) {
					check = true;
				}
				weeks.push({
					week: j,
					time: time,
					check: check,
					text: "",
					type: "content"
				});
			}
		}
		$scope.weeks = weeks;
		$scope.content_weeks = $scope.weeks.filter(function(w) {
			return w.type == 'content';
		});
		$scope.select_weeks = $scope.weeks.filter(function(w) {
			return w.type == "content" && w.check == true;
		});
		$scope.select_week = function(week) {
			if (week.type != 'content') {
				return;
			}
			week.check = !week.check;
			$scope.select_weeks = $scope.weeks.filter(function(w) {
				return w.type == "content" && w.check == true;
			});
		};
		$scope.check_all = function() {
			if ($scope.select_weeks.length == $scope.content_weeks.length) {
				$scope.weeks.map(function(w) {
					w.type == "content" && (w.check = false);
					return w;
				});
			} else {
				$scope.weeks.map(function(w) {
					w.type == "content" && (w.check = true);
					return w;
				});
			}
			$scope.select_weeks = $scope.weeks.filter(function(w) {
				return w.type == "content" && w.check == true;
			});
		};
	};
	// 提交表单 最终创建课程
	$scope.ajaxForm = function() {
		toastServices.show();
		coursesServices.edit_course({
			course_id: $routeParams.id,
			title: $scope.input.title,
			category_01_id: $scope.input.category_1.id,
			category_01_name: $scope.input.category_1.name,
			category_02_id: $scope.input.category_2.id,
			category_02_name: $scope.input.category_2.name,
			overview: $scope.input.overview,
			achievements: $scope.input.achievements,
			specialist: $scope.input.specialist,
			fileName: $scope.input.covers.join("#"),
			vedioURL: $scope.input.videos.map(function(video) {
				return video.url
			}).join("#"),
			session_length: $scope.input.course_duration,
			session_rate: $scope.input.rate,
			teaching_age: $scope.input.teaching_age,
			teaching_since: $scope.input.teaching_since,
			travel_to_session: $scope.input.travel_to_session,
			travel_to_session_distance: $scope.input.distance,
			travel_to_session_trafic_surcharge: $scope.input.traffic_cost,
			city: $scope.input.state,
			area: $scope.input.city,
			street: $scope.input.street,
			address: $scope.input.apt,
			zipcode: $scope.input.zipcode,
			latitude: $scope.lat_lng.lat,
			longitude: $scope.lat_lng.lng,
			additional_partner: $scope.input.partner,
			surcharge_for_each: $scope.input.surcharge,
			discount_type: "2", //$scope.input.discount == "by_money" ? "1" : "2",
			discount_onetion_pur_money_01: $scope.input.discount_1.purchase || "",
			discount_price_01: $scope.input.discount_1.off || "",
			discount_onetion_pur_money_02: $scope.input.discount_2.purchase || "",
			discount_price_02: $scope.input.discount_2.off || "",
			discount_onetion_pur_money_03: $scope.input.discount_3.purchase || "",
			discount_price_03: $scope.input.discount_3.off || "",
			hours: $scope.weeks.filter(function(w) {
				return w.type == "content" && w.check == true;
			}).map(function(w) {
				return w.time + "@" + w.week;
			}).join("#"),
			user_images_01: $scope.input.poster
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				$timeout(function() {
					// $rootScope.back();
					// $window.close();
					$location.path("skillopedia").replace();
				}, 3000)
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
});
// uploadController upload certs
angular.module("Skillopedia").controller("uploadController", function($scope, errorServices, toastServices, localStorageService, config) {
	var filename, extension;
	$scope.$on("flow::filesSubmitted", function(event, flow) {
		if (flow.files.length == 0) return;
		flow.files[0].name.replace(/.png|.jpg|.jpeg|.gif/g, function(ext) {
			extension = ext;
			return ext;
		})
		filename = new Date().getTime() + extension;
		flow.opts.target = config.url + "/app/Experiences/updatePic";
		flow.opts.testChunks = false;
		flow.opts.fileParameterName = "image_01";
		flow.opts.query = {
			"invoke": "h5",
			"token": localStorageService.get("token"),
			"filename": filename
		};
		flow.upload();
	});
	$scope.$on('flow::fileAdded', function(event, flowFile, flow) {
		if (!{
				png: 1,
				gif: 1,
				jpg: 1,
				jpeg: 1
			}[flow.getExtension()]) {
			errorServices.autoHide("必须上传图片")
			event.preventDefault(); //prevent file from uploading
			return;
		}
		if (parseFloat(flow.size) / 1000 > 500) {
			errorServices.autoHide("图片太大，保证图片在500kb以内")
			event.preventDefault(); //prevent file from uploading
			return;
		}
		$scope.cert.url = "";
	});
	$scope.$on('flow::fileSuccess', function(file, message, chunk) {
		$scope.cert.url = filename;
	});
});
// uploadCoversController
angular.module("Skillopedia").controller("uploadCoversController", function($scope, errorServices, toastServices, localStorageService, config) {
		var filename, extension;
		$scope.$on("flow::filesSubmitted", function(event, flow) {
			if (flow.files.length == 0) return;
			flow.files[0].name.replace(/.png|.jpg|.jpeg|.gif/g, function(ext) {
				extension = ext;
				return ext;
			})
			filename = new Date().getTime() + extension;
			flow.opts.target = config.url + "/app/Experiences/updatePic";
			flow.opts.testChunks = false;
			flow.opts.fileParameterName = "image_01";
			flow.opts.query = {
				"invoke": "h5",
				"token": localStorageService.get("token"),
				"filename": filename
			};
			toastServices.show();
			flow.upload();
		});
		$scope.$on('flow::fileAdded', function(event, flowFile, flow) {
			if (!{
					png: 1,
					gif: 1,
					jpg: 1,
					jpeg: 1
				}[flow.getExtension()]) {
				errorServices.autoHide("必须上传图片")
				event.preventDefault(); //prevent file from uploading
				return;
			}
			// if (parseFloat(flow.size) / 1000 > 500) {
			// 	errorServices.autoHide("图片太大，保证图片在500kb以内")
			// 	event.preventDefault(); //prevent file from uploading
			// 	return;
			// }
			// $scope.cover.url = "";
		});
		$scope.$on('flow::fileSuccess', function(file, message, chunk) {
			$scope.$flow.files = [];
			$scope.$emit("upload_cover_success", {
				message: filename
			});
			toastServices.hide();
		});
	})
	// uploadCoversController
angular.module("Skillopedia").controller("uploadPosterController", function($scope, errorServices, toastServices, localStorageService, config) {
	var filename, extension;
	$scope.$on("flow::filesSubmitted", function(event, flow) {
		if (flow.files.length == 0) return;
		flow.files[0].name.replace(/.png|.jpg|.jpeg|.gif/g, function(ext) {
			extension = ext;
			return ext;
		})
		filename = new Date().getTime() + extension;
		flow.opts.target = config.url + "/app/Experiences/updatePic";
		flow.opts.testChunks = false;
		flow.opts.fileParameterName = "image_01";
		flow.opts.query = {
			"invoke": "h5",
			"token": localStorageService.get("token"),
			"filename": filename
		};
		toastServices.show();
		flow.upload();
	});
	$scope.$on('flow::fileAdded', function(event, flowFile, flow) {
		if (!{
				png: 1,
				gif: 1,
				jpg: 1,
				jpeg: 1
			}[flow.getExtension()]) {
			errorServices.autoHide("必须上传图片")
			event.preventDefault(); //prevent file from uploading
			return;
		}
		if (parseFloat(flow.size) / 1000 > 500) {
			errorServices.autoHide("图片太大，保证图片在500kb以内")
			event.preventDefault(); //prevent file from uploading
			return;
		}
		// $scope.cover.url = "";
	});
	$scope.$on('flow::fileSuccess', function(file, message, chunk) {
		$scope.$flow.files = [];
		$scope.$emit("upload_poster_success", {
			message: filename
		});
		toastServices.hide();
	});
})