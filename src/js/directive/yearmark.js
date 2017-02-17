// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('yearMark', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            var month_reg = /[0-9]/,
                is_backspace = false;
            ctrl.$parsers.push(function(viewValue) {
                if (is_backspace) {
                    is_backspace = false;
                    return;
                }
                viewValue = format_year(viewValue);
                ctrl.$setViewValue(viewValue);
                if (month_reg.test(viewValue)) {
                    ctrl.$setValidity("yearMark", true);
                } else {
                    ctrl.$setValidity("yearMark", false);
                }
                ctrl.$render();
                return viewValue;
            });
            $(element).bind("keydown", function(e) {
                if (!(e.key.match(/[0-9]/) || e.key == "Backspace" || e.key == "Tab")) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                if (e.key == "Backspace" && ctrl.$viewValue) {
                    is_backspace = true;
                    return;
                }
            });

            function format_year(str) {
                if (!str) return;
                if (parseFloat(str) < parseFloat(new Date().getFullYear())) {
                    str = new Date().getFullYear();
                }
                str = str.toString().slice(0, 4);
                return str;
            };
        }
    };
});