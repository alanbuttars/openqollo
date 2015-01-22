'use strict';

var qolloControllers = angular.module('qolloControllers', []);

qolloControllers.controller('SplashCtrl', ['AuthService', 'ContactService', 'DatabaseService', 'UserService', '$scope', '$state',
	function(AuthService, ContactService, DatabaseService, UserService, $scope, $state) {

		$scope.loadingMessage = "Authenticating";

		AuthService.authenticate().then(
			function(data) {
				var userId = data["auth"];
				if (exists(userId)) {
					window.localStorage.setItem("userId", userId);

					$scope.loadingMessage = "Loading contacts";
					ContactService.getContacts().then(
						function(contacts) {
							$scope.loadingMessage = "Finding OpenQollo users";
							UserService.getUserDetails(contacts).then(
								function(userDetailPromises) {
									$scope.loadingMessage = "Storing OpenQollo contacts";
									DatabaseService.storeContactPromises(userDetailPromises).then(
										function() {
											$state.go('app.notifications');
										},
										function(storageError) {
											$scope.loadingMessage = "Failed to store OpenQollo contacts";
										}
									);
								},
								function(userDetailsError) {
									$scope.loadingMessage = "Failed to find OpenQollo users";
								}
							);
						},
						function(contactsError) {
							$scope.loadingMessage = "Failed to load contacts";
						}
					);
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

						$state.go('splash');
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

                        $state.go('splash');
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

qolloControllers.controller('AppCtrl', ['$rootScope', '$scope', '$state',
	function($rootScope, $scope, $state) {
		$scope.searchOn = false;
		$scope.searchAvailable = false;
		$rootScope.root = { query : "" };

		$scope.toggleSearch = function() {
			if ($scope.searchOn) {
				$rootScope.root = { query : "" };
				$scope.searchOn = false;
			}
			else {
				$scope.searchOn = true;
			}
		};

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			$scope.searchAvailable = toState.name.indexOf("app.people") == 0;
		});
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
					$scope.data["timeCreatedFormatted"] = DateFormatter.toCalendarTime(successInfo["timeCreated"]);
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

qolloControllers.controller('PeopleCtrl', ['DatabaseService', '$rootScope', '$scope', '$state',
	function(DatabaseService, $rootScope, $scope, $state) {

    	if ($state.current.name == "app.people") {
    		$state.go('app.people.friends');
    	}

		$scope.contacts = [];
		$scope.contactsSelected = [];

		$scope.message = null;
		$scope.loading = true;

		$scope.select = function(contactIndex) {
			var contact = $scope.contacts[contactIndex];
			if (contact["selected"]) {
				$scope.contactsSelected.push(contact);
			}
			else {
				$scope.contactsSelected = removeFromArray(contact, $scope.contactsSelected);
			}
		};

		$scope.cancel = function() {
			for (var i = 0; i < $scope.contacts.length; i++) {
				$scope.contacts[i]["selected"] = false;
			}
			$scope.contactsSelected = [];
		};

		$scope.openModal = function() {
			$("#modal-people").foundation('reveal', 'open');
		};

		$scope.onload = function() {
			DatabaseService.getContactsByType($state.current.contactType).then(
				function(contacts) {
					$scope.loading = false;
					if (isEmpty(contacts)) {
						$scope.message = $state.current.messageEmpty;
					}
					else {
						$scope.contacts = contacts;
						for (var i = 0; i < $scope.contacts.length; i++) {
							var contact = $scope.contacts[i];
							if (contact["selected"]) {
								$scope.contactsSelected.push(contact);
							}
						}
					}
				},
				function(friendsError) {
					$scope.loading = false;
					$scope.message = "Failed to load " + $state.current.contactType;
				}
			);
		};

}]);

qolloControllers.controller('FriendsCtrl', ['DatabaseService', '$controller', '$rootScope', '$scope', '$state',
	function(DatabaseService, $controller, $rootScope, $scope, $state) {
		$controller('PeopleCtrl', {DatabaseService : DatabaseService, $rootScope : $rootScope, $scope : $scope, $state : $state});

		$scope.onload();

		$scope.confirm = function() {
		};

}]);

qolloControllers.controller('UsersCtrl', ['DatabaseService', '$controller', '$rootScope', '$scope', '$state',
	function(DatabaseService, $controller, $rootScope, $scope, $state) {
		$controller('PeopleCtrl', {DatabaseService : DatabaseService, $rootScope : $rootScope, $scope : $scope, $state : $state});

		$scope.onload();

		$scope.confirm = function() {
       	};

}]);

qolloControllers.controller('ContactsCtrl', ['DatabaseService', '$controller', '$rootScope', '$scope', '$state',
	function(DatabaseService, $controller, $rootScope, $scope, $state) {
		$controller('PeopleCtrl', {DatabaseService : DatabaseService, $rootScope : $rootScope, $scope : $scope, $state : $state});

		$scope.onload();

		$scope.confirm = function() {
        };
}]);