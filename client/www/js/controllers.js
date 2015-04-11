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

qolloControllers.controller('MenuCtrl', ['AuthService', 'DatabaseService', '$scope', '$state', '$window',
	function(AuthService, DatabaseService, $scope, $state, $window) {

		$scope.logout = function() {
			DatabaseService.resetContactCache("friends");
			DatabaseService.resetContactCache("users");
			DatabaseService.resetContactCache("contacts");
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

qolloControllers.controller('NotificationsCtrl', ['DatabaseService', 'FriendService', '$scope', '$state',
	function(DatabaseService, FriendService, $scope, $state) {

		$scope.friendships = {
			loading : true,
			data : {},
			error : null
		};

		FriendService.getFriendshipNotifications().then(
			function(notifications) {
				DatabaseService.attachContactData(notifications).then(
					function(data) {
						$scope.friendships.loading = false;
						$scope.friendships.data = data;
						$scope.friendships.error = null;
					},
					function(error) {
						$scope.friendships.loading = false;
						$scope.friendships.data = {};
						$scope.friendships.error = error;
					}
				)
			},
			function(error) {
				$scope.friendships.loading = false;
				$scope.friendships.data = {};
				$scope.friendships.error = error;
			}
		);

		$scope.updateStatus = function(contactIndex, status) {
			var contact = $scope.friendships.data[contactIndex];
			var contacts = [contact];
			FriendService.updateStatus(contacts, status).then(
        		function(data) {
        			DatabaseService.updateContactsStatus(contacts, status);
        		}
        	);

        	$scope.friendships.data = removeFromArray(contact, $scope.friendships.data);

        	if (status == "accepted") {
        		DatabaseService.resetContactCache("friends");
        	}
        	else if (status == "denied") {
        		DatabaseService.resetContactCache("users");
        	}
		};
}]);

qolloControllers.controller('PeopleCtrl', ['DatabaseService', 'FriendService', '$rootScope', '$scope', '$state', '$timeout',
	function(DatabaseService, FriendService, $rootScope, $scope, $state, $timeout) {

    	if ($state.current.name == "app.people") {
    		$state.go('app.people.friends');
    	}

		$scope.contacts = [];
		$scope.contactsSelected = [];

		$scope.message = null;
		$scope.loading = true;

		$scope.confirmMessage = null;
		$scope.confirmLoading = false;

		$scope.select = function(contactIndex) {
			var contact = $scope.contacts[contactIndex];
			if (contact.selected) {
				$scope.contactsSelected.push(contact);
			}
			else {
				$scope.contactsSelected = removeFromArray(contact, $scope.contactsSelected);
			}
		};

		$scope.updateContactsStatusOnUi = function(status) {
			for (var i = 0; i < $scope.contacts.length; i++) {
				var contact = unfreeze($scope.contacts[i]);
				if (contact.selected) {
                	if (status == "invited") {
                    	contact.invited = 1;
                	}
                	else if (status == "new") {
                    	contact.friendshipStatus = "new";
                    	contact.friendshipType = "sent";
                	}
                	else if (status == "ended") {
                    	contact.friendshipStatus = "ended";
                    	contact.friendshipType = null;
                	}
                	else if (status == "denied") {
                    	contact.friendshipStatus = "denied";
                	}
                	else if (status == "accepted") {
                    	contact.friendshipStatus = "accepted";
                	}

   					log("updated {0}", contact);
				}
			}
		}

		$scope.confirm = function(status) {
			$scope.confirmLoading = true;
			$scope.confirmMessage = null;
			FriendService.updateStatus($scope.contactsSelected, status).then(
				function(data) {
					$scope.confirmLoading = false;
					var successInfo = data["success"];
					var errorInfo = data["errors"];

					if (exists(successInfo)) {
						DatabaseService.updateContactsStatus($scope.contactsSelected, status);
						$scope.confirmMessage = "Success!";
						$timeout(function() {
							DatabaseService.resetContactCache($state.current.contactType);
							if ($state.current.contactType == "friends") {
								DatabaseService.resetContactCache("users");
							}
							$scope.closeModal();
							$scope.confirmMessage = null;
							$scope.onload();
						}, 300);
					}
					else if (exists(errorInfo)) {
						$scope.confirmMessage = errorInfo;
					}
					else {
						$scope.confirmMessage = "Failed to contact the server";
					}
				},
				function(error) {
					$scope.confirmLoading = false;
					$scope.confirmMessage = "Failed to contact the server";
				}
			);
		};

		$scope.cancel = function() {
			for (var i = 0; i < $scope.contacts.length; i++) {
				$scope.contacts[i].selected = false;
			}
			$scope.contactsSelected = [];
		};

		$scope.openModal = function() {
			$("#modal-people").foundation('reveal', 'open');
		};

		$scope.closeModal = function() {
			$("#modal-people").foundation('reveal', 'close');
		};

		$scope.onload = function() {
			$scope.loading = true;
			$scope.message = null;
			$scope.contacts = [];
			$scope.contactsSelected = [];
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
							if (contact.selected) {
								$scope.contactsSelected++;
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

qolloControllers.controller('FriendsCtrl', ['DatabaseService', 'ImageService', '$controller', '$rootScope', '$scope', '$state', '$timeout',
	function(DatabaseService, ImageService, $controller, $rootScope, $scope, $state, $timeout) {
		$controller('PeopleCtrl', {DatabaseService : DatabaseService, $rootScope : $rootScope, $scope : $scope, $state : $state, $timeout : $timeout});

		$scope.onload();

		$scope.send = function() {
			$scope.confirmLoading = true;
			$scope.confirmMessage = null;
			var contactsSelectedIds = getObjectValues($scope.contactsSelected, "userId");
			ImageService.sendImage(contactsSelectedIds).then(
				function(data) {
					$scope.confirmLoading = false;
					var successInfo = data.success;
					var errorInfo = data.errors;

					if (exists(successInfo)) {
						$scope.confirmMessage = "Success!";
						$timeout(function() {
							$scope.closeModal();
							$scope.confirmMessage = null;
							$scope.onload();
						}, 300);
					}
					else if (exists(errorInfo)) {
						$scope.confirmMessage = errorInfo;
					}
					else {
						$scope.confirmMessage = "Failed to contact the server";
					}
				},
				function(error) {
					$scope.confirmLoading = false;
					$scope.confirmMessage = "Failed to contact the server";
				}
			)
		};

}]);

qolloControllers.controller('UsersCtrl', ['DatabaseService', '$controller', '$rootScope', '$scope', '$state', '$timeout',
	function(DatabaseService, $controller, $rootScope, $scope, $state, $timeout) {
		$controller('PeopleCtrl', {DatabaseService : DatabaseService, $rootScope : $rootScope, $scope : $scope, $state : $state, $timeout : $timeout});

		$scope.onload();

}]);

qolloControllers.controller('ContactsCtrl', ['DatabaseService', '$controller', '$rootScope', '$scope', '$state', '$timeout',
	function(DatabaseService, $controller, $rootScope, $scope, $state, $timeout) {
		$controller('PeopleCtrl', {DatabaseService : DatabaseService, $rootScope : $rootScope, $scope : $scope, $state : $state, $timeout : $timeout});

		$scope.onload();

}]);

qolloControllers.controller('TakeCtrl', ['ImageService', '$scope', '$state',
	function(ImageService, $scope, $state) {

		$scope.image = ImageService.getImage();

		$scope.takePicture = function(type) {
			var promise = null;
			if (type == "camera") {
				promise = ImageService.getCamera();
			}
			else {
				promise = ImageService.getAlbum();
			}
			startLoading();
			promise.then(
				function(imageUri) {
					$scope.image = imageUri;
					stopLoading();
				},
				function(error) {
					$scope.image = null;
					stopLoading();
				});
		};

		$scope.send = function() {
			ImageService.setImage($scope.image);
			$state.go('menu.share');
		};

		$scope.cancel = function() {
			navigator.camera.cleanup();
			$scope.image = null;
		};

}]);