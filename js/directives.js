var module = angular.module('example.directives', []);

module.directive('fullpage', ['$timeout', '$log', function($timeout, $log) {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',

        // responsible for registering DOM listeners as well as updating the DOM
        link: function($scope, element, attrs) {

            $scope.initFP = function(){
                if($(element).fullpage && $(element).fullpage.destroy){
                    console.log("Destroying fullpage for element " + JSON.stringify(element));
                    $(element).fullpage.destroy('all');
                }
                console.log("Initializing fullpage with " + JSON.stringify(attrs.fullpage) + " for element " + JSON.stringify(element));
                $(element).fullpage($scope.$eval(attrs.fullpage));
                $(element).fullpage.setMouseWheelScrolling(false);
                //$(element).fullpage.setAllowScrolling(false);
            };

            $scope.rebuildFP = function(){
                $log.debug("Called rebuildFP");
                $timeout(function(){
                    if($(element).fullpage && $(element).fullpage.reBuild){
                        console.log("Rebuilding fullpage for element " + JSON.stringify(element));
                        $(element).fullpage.reBuild();
                    }
                },500);

            };

            $scope.initFP();
        }
    };
}]);