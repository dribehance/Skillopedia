// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("fillinorderController", function($scope, $rootScope, $window, $timeout, $location, $filter, $routeParams, $sce, skillopediaServices, googleMapServices, orderServices, scheduleServices, userServices, coursesServices, errorServices, toastServices, localStorageService, config) {
    $scope.input = {};
    $scope.course = {};
    toastServices.show();
    orderServices.query_course({
        course_id: $routeParams.course_id,
        latitude: 0,
        longitude: 0
    }).then(function(data) {
        toastServices.hide()
        if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
            $scope.course = data.Course;
            $scope.old_course = angular.copy($scope.course);
            $scope.teaching_location_map = $scope.get_map($scope.course.city, $scope.course.area, $scope.course.street, $scope.course.address, 1);
            $scope.input.total_course_price = $scope.course.session_rate;
            // discount handle
            $scope.discounts = [];
            if ($scope.course.discount_price_01 > 0) {
                $scope.discounts.push({
                    purchase: $scope.course.discount_onetion_pur_money_01,
                    off: $scope.course.discount_price_01
                })
            }
            if ($scope.course.discount_price_02 > 0) {
                $scope.discounts.push({
                    purchase: $scope.course.discount_onetion_pur_money_02,
                    off: $scope.course.discount_price_02
                })
            }
            if ($scope.course.discount_price_03 > 0) {
                $scope.discounts.push({
                    purchase: $scope.course.discount_onetion_pur_money_03,
                    off: $scope.course.discount_price_03
                })
            }
            $scope.discounts.sort(function(x, y) {
                return parseFloat(x.purchase) > parseFloat(y.purchase);
            });
            // coupons handle
            $scope.query_coupons();
        } else {
            errorServices.autoHide(data.message);
        }
    }).then(function(data) {
        $scope.query_schedule($filter("date")(new Date().getTime(), "yyyy-MM-dd"));
    });
    // 优惠券
    $scope.coupons = [];
    $scope.input.coupons = {
        selected: "",
        all: []
    };
    $scope.query_coupons = function() {
        if (!$rootScope.is_signin()) {
            $scope.calculate();
            return;
        }
        toastServices.show();
        orderServices.query_coupons({
            category_01_id: $scope.course.category_01_id,
            category_02_id: $scope.course.category_02_id,
            user_id: $scope.course.user_id,
            course_id: $scope.course.course_id
        }).then(function(data) {
            toastServices.hide()
            if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                $scope.coupons = data.Result.CourseCoupons;
                $scope.calculate();
            } else {
                errorServices.autoHide(data.message);
            }
        })
    };
    $scope.get_from_time = function(t) {
        return t.split("-")[0]
    }
    $scope.get_to_time = function(t) {
        return t.split("-")[1]
    };
    // 编辑地址 
    $scope.edit = function() {
        $.magnificPopup.open({
            items: {
                src: '#location-popup'
            },
            type: 'inline'
        }, 0);
    };
    $scope.input.street = "";
    $scope.input.address = "";
    $scope.input.area = "";
    $scope.input.city = "";
    // 默认不上门服务
    $scope.input.travel_to_session = 0;
    $scope.save_location = function() {

        // $scope.map_url = $scope.get_map($scope.input.state, $scope.input.city, $scope.input.street, $scope.input.apt);
        toastServices.show();
        googleMapServices.geocoding({
            address: $scope.input.street + "," + $scope.input.address + "," + $scope.input.area + "," + $scope.input.city + "," + $scope.input.zipcode
        }).then(function(data) {
            toastServices.hide();
            // valid address is legal
            var result = data.results.filter(function(r) {
                return !r.partial_match;
            });
            if (result.length == 0) {
                $scope.street_error = "the street name or number appears to be invalid";
                return;
            }
            $scope.street_error = "";
            $scope.lat_lng = result[0].geometry.location;
            $scope.format_address = result[0].formatted_address;
            // valid address is in services
            toastServices.show();
            skillopediaServices.query_location_in_services({
                course_id: $routeParams.course_id,
                latitude: $scope.lat_lng.lat || "0",
                longitude: $scope.lat_lng.lng || "0"
            }).then(function(data) {
                toastServices.hide();
                if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                    $scope.input.travel_to_session = 1;
                    $scope.calculate();
                    $.magnificPopup.close();
                } else {
                    errorServices.autoHide(data.message);
                }
            });
        })
    };
    $scope.reset_location = function() {
        $scope.teaching_location_map = $scope.get_map($scope.old_course.city, $scope.old_course.area, $scope.old_course.street, $scope.old_course.address, 1);
        $scope.course.city = $scope.old_course.city;
        $scope.course.area = $scope.old_course.area;
        $scope.course.street = $scope.old_course.street;
        $scope.course.address = $scope.old_course.address;
        $scope.course.zipcode = $scope.old_course.zipcode;
        $scope.input.travel_to_session = 0;
        $scope.calculate();
        $.magnificPopup.close();
    };
    // parse iframe map url
    $scope.get_map = function(state, city, street, unit, type) {
        // var map_url = "https://maps.google.com/maps?q=" + state + city + street + "&output=embed";
        // return $sce.trustAsResourceUrl(map_url);
        var state = state || "",
            city = city || "",
            street = street || "",
            unit = unit || "",
            type = type || "1";
        var address;
        type == "1" && (address = street + "," + city + "," + state);
        type == "2" && (address = street + "," + unit + "," + city + "," + state);
        googleMapServices.geocoding({
            address: address
        }).then(function(data) {
            $scope.lat_lng = data.results[0].geometry.location;
            $scope.format_address = data.results[0].formatted_address;
            var map = googleMapServices.create_map(document.getElementById('map'), $scope.lat_lng);
            // console.log(map)
            type == "1" && (googleMapServices.create_circle_marker(map, $scope.lat_lng));
            type == "2" && (googleMapServices.create_marker(map, $scope.lat_lng));
        })
    };
    // parse video url
    $scope.get_video = function(video) {
        if (video) {
            // ?autoplay=0
            var video = video.replace("watch?v=", "embed/");
            return $sce.trustAsResourceUrl(video);
        }
    };
    // 加入收藏
    $scope.like = function() {
        if (!$rootScope.is_signin()) {
            $rootScope.signin();
            return;
        }
        toastServices.show();
        userServices.like({
            course_id: $scope.course.course_id
        }).then(function(data) {
            toastServices.hide()
            if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                errorServices.autoHide(data.message);
            } else {
                errorServices.autoHide(data.message);
            }
        })
    };
    // schedule
    $scope.calendar = {
        mode: "edit",
        disabled: false,
        disabled_message: "All Day Busy",
        times: [],
        size: 1
    }
    $scope.query_schedule = function(day) {
        $scope.calendar.selected = $scope.calendar.selected || [];
        var selected = $scope.calendar.selected.map(function(t) {
            return t.from.day + " " + t.from.hour + "to" + t.to.day + " " + t.to.hour;
        }).join("#");
        toastServices.show();
        scheduleServices.query_by_course({
            course_id: $routeParams.course_id,
            user_id: $scope.course.user_id,
            choice_currentdate: day,
        }).then(function(data) {
            toastServices.hide()
            if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                $scope.calendar.times = data.ScheduleBeans.map(function(time) {
                    time.schedule_state = time.schedule_state;
                    time.schedule_state_message = time.schedule_state_message;
                    time.day = day;
                    var temp = time.day + " " + time.hour;
                    if (selected.indexOf(temp) != -1) {
                        time.schedule_state = 2;
                        time.active = true;
                    }
                    return time;
                })
                $scope.calendar.is_stop_course = data.is_stop_course;
                $scope.calendar.is_busy_24 = data.is_busy_24;
                if ($scope.calendar.is_stop_course == "1" || $scope.calendar.is_busy_24 == "1") {
                    $scope.calendar.disabled = true;
                } else {
                    $scope.calendar.disabled = false;
                }
            } else {
                errorServices.autoHide(data.message);
            }
        })
    }
    $scope.calendar.onDayChange = function() {
        $scope.query_schedule($filter("date")(new Date($scope.calendar.day).getTime(), "yyyy-MM-dd"))
    };
    // action
    $scope.input.amount = 1;
    $scope.add_amount = function() {
        $scope.input.amount = ++$scope.input.amount > 50 ? --$scope.input.amount : $scope.input.amount;
        $scope.calculate();
        // control calendar selected size;
        $scope.calendar.size = $scope.input.amount;
    }
    $scope.minus_amount = function() {
        if (parseFloat($scope.input.amount) < parseFloat($scope.calendar.selected.length) + 1) {
            errorServices.autoHide("You have booking time,before you can change the amount, cancel booking")
            return;
        }
        $scope.input.amount = --$scope.input.amount < 1 ? ++$scope.input.amount : $scope.input.amount;
        $scope.calculate();
        // control calendar selected size;
        $scope.calendar.size = $scope.input.amount;
    }
    $scope.input.partner = 0;
    $scope.add_partner = function() {
        $scope.input.partner = ++$scope.input.partner > $scope.course.additional_partner ? --$scope.input.partner : $scope.input.partner;
        $scope.calculate()
    }
    $scope.minus_partner = function() {
        $scope.input.partner = --$scope.input.partner < 0 ? ++$scope.input.partner : $scope.input.partner;
        $scope.calculate();
    };
    // select package;
    $scope.select_package = function(package) {
        if (parseFloat(package.purchase) < parseFloat($scope.calendar.selected.length)) {
            errorServices.autoHide("You have booking time,before you can change the amount, cancel booking")
            return;
        }
        $scope.input.amount = package.purchase;
        $scope.calendar.size = $scope.input.amount;
        $scope.calculate();
    };
    //鼠标移入提示 
    $scope.show = function() {
        if ($(".hovertips").hasClass("active")) {
            $(".hovertips").removeClass("active")
        } else {
            $(".hovertips").addClass("active")
        }
    }
    $scope.hide = function() {
        if ($(".hovertips").hasClass("active")) {
            $(".hovertips").removeClass("active")
        }
    }
    $scope.calculate = function() {
        $scope.input.discount_total_course_price = $scope.input.discount_total_partner_fee = 0;
        // 总价 = 课程费用+小伙伴费用+首次服务费用+交通费用
        // 课程费用+小伙伴费用 = 课程单价*课程数量+小伙伴单价*小伙伴数量*课程数量
        // 课程费用
        $scope.input.total_course_price = parseFloat($scope.course.session_rate) * parseFloat($scope.input.amount);
        // 小伙伴费用
        $scope.input.total_partner_fee = parseFloat($scope.course.surcharge_for_each) * parseFloat($scope.input.partner) * parseFloat($scope.input.amount);
        // by total amount
        // 课程费用+小伙伴费用参与打折
        $scope.input.discount_total_course_price = $scope.input.discount_total_course_price || $scope.input.total_course_price;
        $scope.input.discount_total_partner_fee = $scope.input.discount_total_partner_fee || $scope.input.total_partner_fee;
        if ($scope.course.discount_type == 2) {
            angular.forEach($scope.discounts, function(discount) {
                if (parseFloat($scope.input.amount) > parseFloat(discount.purchase) - 1) {
                    $scope.input.temp_discount_price = discount.off;
                    // dscount percentage
                    $scope.input.discount_total_course_price = parseFloat($scope.input.total_course_price) * (1 - parseFloat(discount.off) / 100);
                    $scope.input.discount_total_partner_fee = parseFloat($scope.input.total_partner_fee) * (1 - parseFloat(discount.off) / 100);
                }
            });
        }
        $scope.input.coupons.all = $scope.coupons.filter(function(coupon) {
            return parseFloat($scope.input.discount_total_course_price) > parseFloat(coupon.consume_money);
        });
        if ($scope.input.coupons.all.length > 0 && !$scope.is_watch) {
            $scope.input.coupons.selected = $scope.input.coupons.all[0];
        }
        if ($scope.input.coupons.all.length == 0) {
            $scope.is_watch = false;
            $scope.input.coupons.selected = {
                coupon_name: "no coupons available",
                my_coupon_id: "0"
            };
        }
        if ($scope.input.coupons.selected.coupon_money) {
            $scope.input.discount_total_course_price = parseFloat($scope.input.discount_total_course_price) - parseFloat($scope.input.coupons.selected.coupon_money);
        }
        // 交通费用，如果选择上门
        $scope.input.total_traffic_cost = 0;
        // $scope.travel_place = $scope.course.city + $scope.course.area + $scope.course.street;
        // $scope.course_place = $scope.old_course.city + $scope.old_course.area + $scope.old_course.street;
        // if ($scope.course.travel_to_session == '1' && $scope.travel_place != $scope.course_place) {
        if ($scope.course.travel_to_session == '1' && $scope.input.travel_to_session) {
            $scope.input.total_traffic_cost = parseFloat($scope.course.travel_to_session_trafic_surcharge) * parseFloat($scope.input.amount);
        }
        // 首次服务费用 百分比,仅仅单节课程费用的百分比
        $scope.input.total_service_fee = parseFloat($scope.course.session_rate) * parseFloat($scope.course.first_joint_fee) / 100;
        // 计算总价格 课程价格+首次服务费+交通费
        $scope.calculate_total_price();
    }
    $scope.is_watch = false;
    $scope.$watch("input.coupons.selected", function(n, o) {
        if (n === o || o == "") {
            return;
        }
        $scope.is_watch = true;
        $scope.calculate();
    }, true);
    // 加入购物车动画
    var animate_dot = function() {
        $(".animate-dot").addClass("active").css({
            top: $(".shoppingcart").offset().top + 10,
            left: $(".shoppingcart").offset().left + $(".shoppingcart").width() + 10
        });
        $scope.$broadcast("addToCart");
        $timeout(function() {
            $(".animate-dot").removeClass("active");
        }, 500)
        $timeout(function() {
            $(".animate-dot").css({
                top: "50%",
                left: "50%"
            });
        }, 1000)
    };
    $scope.calculate_total_price = function() {
        var total_price = parseFloat($scope.input.total_course_price) + parseFloat($scope.input.total_partner_fee) + parseFloat($scope.input.total_service_fee) + parseFloat($scope.input.total_traffic_cost),
            discount_total_price = parseFloat($scope.input.discount_total_course_price) + parseFloat($scope.input.discount_total_partner_fee) + parseFloat($scope.input.total_service_fee) + parseFloat($scope.input.total_traffic_cost);
        $scope.input.total_price = total_price;
        $scope.input.discount_total_price = discount_total_price;
    };
    // 加入购物车;
    // 下单;
    $scope.fillinorder = function(type) {
        if (!$rootScope.is_signin()) {
            $rootScope.signin();
            return;
        }
        if ($scope.input.message && $scope.input.message.length > 400) {
            errorServices.autoHide("message too long");
            return;
        }
        // 首单服务费+交通费
        $scope.calculate_total_price();
        // var total_session_rate = $scope.input.discount_total_course_price || $scope.input.total_course_price,
        //     total_session_rate = parseFloat(total_session_rate) + parseFloat($scope.input.total_service_fee) + parseFloat($scope.input.total_traffic_cost),
        //     original_total_session_rate = parseFloat($scope.input.total_course_price) + parseFloat($scope.input.total_service_fee) + parseFloat($scope.input.total_traffic_cost);
        toastServices.show();
        orderServices.fillinorder({
            order_type: type,
            course_id: $scope.course.course_id,
            title: $scope.course.title,
            address: $scope.course.street + " " + $scope.course.address + ", " + $scope.course.area + ", " + $scope.course.city,
            course_user_id: $scope.course.user_id,
            buy_amount: $scope.input.amount,
            session_rate: $scope.course.session_rate,
            go_door_status: $scope.input.travel_to_session,
            go_door_city: $scope.input.city,
            go_door_area: $scope.input.area,
            go_door_street: $scope.input.street,
            go_door_address: $scope.format_address,
            go_door_latitude: ($scope.lat_lng && $scope.lat_lng.lat) || "0",
            go_door_longitude: ($scope.lat_lng && $scope.lat_lng.lng) || "0",
            go_door_zipcode: $scope.input.zipcode,
            go_door_traffic_cost: $scope.course.travel_to_session_trafic_surcharge,
            my_coupon_id: $scope.input.coupons.selected.my_coupon_id,
            my_coupon_money: $scope.input.coupons.selected.coupon_money,
            leave_message: $scope.input.message,
            discount_type: $scope.course.discount_type,
            discount_price: $scope.input.temp_discount_price,
            take_partner_num: $scope.input.partner,
            surcharge_for_each_cash: $scope.course.surcharge_for_each,
            total_session_rate: $scope.input.discount_total_price,
            original_total_session_rate: $scope.input.total_price,
            schedule_datas: $scope.calendar.selected.map(function(c) {
                return c.from.day + "A" + c.from.hour_index + "A" + c.to.hour_index;
            }).join("#"),
            first_joint_fee: $scope.input.total_service_fee
        }).then(function(data) {
            toastServices.hide()
            if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                errorServices.autoHide(data.message);
                type == "1" && (animate_dot());
                $timeout(function() {
                    var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/#/payment?id=" + data.orders_id;
                    type == "11" && ($window.location.href = url);
                }, 2000)
            } else {
                errorServices.autoHide(data.message);
            }
        })
    }
})