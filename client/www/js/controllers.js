'use strict';

var qolloControllers = angular.module('qolloControllers', []);

qolloControllers.controller('LoginCtrl', ['AuthService', '$scope', '$state',
    function(AuthService, $scope, $state) {

        $scope.user = {};
        $scope.errors = {};

        $scope.login = function() {
        	startLoading();
        	AuthService.login($scope.user).then(
        		function(data) {
        			stopLoading();
            		var successInfo = data["success"];
                	var errorInfo = data["errors"];

                	if (exists(successInfo)) {
                		window.localStorage.setItem("token-public", successInfo["tokenPublic"]);
						window.localStorage.setItem("token-private", successInfo["tokenPrivate"]);
						window.localStorage.setItem("userId", successInfo["userId"]);

						$state.go('app');
                	}
                	else if (exists(errorInfo)) {
                		$scope.errors = errorInfo;
            		}
            		else {
            			$scope.errors["server"] = "The server failed to log you in. Please retry.";
            		}
        		},
        		function(error) {
        			stopLoading();
        			$scope.errors["server"] = "The server failed to log you in. Please retry.";
        		}
        	);
        };

}]);

qolloControllers.controller('RegisterCtrl', ['AuthService', '$scope', '$state',
    function(AuthService, $scope, $state) {

		$scope.user = {};
		$scope.errors = {};

		$scope.register = function() {
			startLoading();
			AuthService.register($scope.user).then(
				function(data) {
        			stopLoading();

					var successInfo = data["success"];
					var errorInfo = data["errors"];

					if (exists(successInfo)) {
						window.localStorage.setItem("tokenPublic", successInfo["to0kenPublic"]);
                       	window.localStorage.setItem("tokenPrivate", successInfo["tokenPrivate"]);
                        window.localStorage.setItem("userId", successInfo["userId"]);

                        $state.go('app');
					}
					else if (exists(errorInfo)) {
						$scope.errors = errorInfo;
					}
					else {
						$scope.errors["server"] = "The server failed to register. Please retry.";
					}
				},
				function(error) {
					stopLoading();
					$scope.errors["server"] = "The server failed to register. Please retry.";
				}
			);
		};

}]);