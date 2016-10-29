// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("authenicationController", function($scope, $rootScope, $route, $filter, $timeout, skillopediaServices, userServices, errorServices, toastServices, localStorageService, config) {
	// it's coach,redirect,agent_level:1 普通用户,2:教练
	if ($rootScope.user.agent_level == '2') {
		$rootScope.back();
		return;
	}
	$scope.input = {};
	$scope.input.gender = "1";
	// query category list;
	skillopediaServices.query_all_second_category().then(function(data) {
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.categorys = data.Result.Categorys;
		} else {
			errorServices.autoHide(data.message);
		}
	});
	$scope.telephone = 0;
	// 身份证
	$scope.input.idcards = [{
		id: "",
		url: "",
	}, {
		id: "",
		url: "",
	}];
	// 提交认证
	$scope.ajaxForm = function() {
		toastServices.show();
		userServices.authenication({
			nickname: $scope.input.realname,
			sex: $scope.input.gender,
			birthday: $("input[name='birthday']").val(),
			telephone: $scope.input.telephone,
			cover_ID_01: $scope.input.idcards[0].url,
			cover_ID_02: $scope.input.idcards[1].url,
			category_name: $scope.input.category.category_02_name,
			experiences: $scope.input.experience
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				$timeout(function() {
					userServices.sync();
				}, 2000)
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	// 认证状态
	$scope.authenication_status = ["未认证", "审核中", "审核通过", "审核失败"];
	$scope.get_status = function(status) {
		return $scope.authenication_status[status];
	};
	// 重新认证
	$scope.reauthen = function() {
		$rootScope.user.authen_status = 0;
	}
});
// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("uploadIdcardController", function($scope, errorServices, toastServices, localStorageService, config) {
	var filename, extension, is_big = false;
	$scope.$on("flow::filesSubmitted", function(event, flow) {
		if (flow.files.length == 0) return;
		if (is_big) return;
		flow.files[0].name.replace(/.png|.jpg|.jpeg|.gif/g, function(ext) {
			extension = ext;
			return ext;
		})
		filename = Math.round(Math.random()*100000000);
		filename += new Date().getTime() + extension;
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
			toastServices.hide();
			errorServices.autoHide("必须上传图片")
			event.preventDefault(); //prevent file from uploading
			return;
		}
		if (parseFloat(flow.size) / 1000 > 500) {
			is_big = true;
			toastServices.hide();
			errorServices.autoHide("图片太大，保证图片在500kb以内")
			event.preventDefault(); //prevent file from uploading
			return;
		}
		is_big = false;
		$scope.card.url = "";
	});
	$scope.$on('flow::fileSuccess', function(file, message, chunk) {
		$scope.card.url = filename;
		toastServices.hide();
	});
})