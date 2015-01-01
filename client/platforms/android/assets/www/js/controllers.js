'use strict';

var qolloControllers = angular.module('qolloControllers', []);

qolloControllers.controller('SplashCtrl', ['AuthService', '$scope', '$state',
	function(AuthService, $scope, $state) {

		$scope.loadingMessage = "Loading";
		AuthService.authenticate().then(
			function(data) {
				var userId = data["auth"];
				if (exists(userId)) {
					window.localStorage.setItem("userId", userId);
					$state.go('app.notifications');
				}
				else {
					AuthService.logout();
					$state.go('login');
				}
			},
			function(error) {
				AuthService.logout();
				$state.go('login');
			}
		);
}]);

qolloControllers.controller('LoginCtrl', ['AuthService', '$scope', '$state',
    function(AuthService, $scope, $state) {

        $scope.user = {};
        $scope.errors = {};

        $scope.login = function() {
        	startLoading();
        	AuthService.login($scope.user).then(
        		function(data) {
            		var successInfo = data["success"];
                	var errorInfo = data["errors"];

                	if (exists(successInfo)) {
                		window.localStorage.setItem("tokenPublic", successInfo["tokenPublic"]);
						window.localStorage.setItem("tokenPrivate", successInfo["tokenPrivate"]);
						window.localStorage.setItem("userId", successInfo["userId"]);

						$state.go('app.notifications');
                	}
                	else if (exists(errorInfo)) {
                		$scope.errors = errorInfo;
            		}
            		else {
            			$scope.errors["server"] = "The server failed to log you in. Please retry.";
            		}
        			stopLoading();
        		},
        		function(error) {
        			$scope.errors["server"] = "The server failed to log you in. Please retry.";
        			stopLoading();
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
					var successInfo = data["success"];
					var errorInfo = data["errors"];

					if (exists(successInfo)) {
						window.localStorage.setItem("tokenPublic", successInfo["tokenPublic"]);
                       	window.localStorage.setItem("tokenPrivate", successInfo["tokenPrivate"]);
                        window.localStorage.setItem("userId", successInfo["userId"]);

                        $state.go('app.notifications');
					}
					else if (exists(errorInfo)) {
						$scope.errors = errorInfo;
					}
					else {
						$scope.errors["server"] = "The server failed to register. Please retry.";
					}
					stopLoading();
				},
				function(error) {
					$scope.errors["server"] = "The server failed to register. Please retry.";
					stopLoading();
				}
			);
		};

}]);

qolloControllers.controller('MenuCtrl', ['AuthService', '$scope', '$state', '$window',
	function(AuthService, $scope, $state, $window) {

		$scope.logout = function() {
			AuthService.logout();
			$state.go('login');
		};

		$scope.getCurrentState = function() {
			return $state.current.title;
		};

		$scope.getCurrentStateIcon = function() {
			return $state.current.icon;
		};

		$scope.goBack = function() {
			$window.history.back();
		};
}]);

qolloControllers.controller('ProfileCtrl', ['UserService', '$scope', '$state',
	function(UserService, $scope, $state) {

		$scope.data = {};
		$scope.errors = {};

		startLoading();
		UserService.getProfile().then(
			function(data) {
				var successInfo = data["success"];
				var errorInfo = data["errors"];

				if (exists(successInfo)) {
					$scope.data = successInfo;
					$scope.data["timeCreatedFormatted"] = DateFormatter.formatRelative(Date.parse(successInfo["timeCreated"]));
				}
				else if (exists(errorInfo)) {
					$scope.errors = errorInfo;
				}
				else {
					$scope.errors["server"] = "The server failed to retrieve your user. Please retry.";
				}
				stopLoading();
			},
			function(error) {
				$scope.errors["server"] = "The server failed to retrieve your user. Please retry.";
				stopLoading();
			}
		);
}]);