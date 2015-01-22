'use strict';

var qolloApp = angular.module('qolloApp', [ 'ui.router', 'qolloControllers' ]);

qolloApp.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    /* Introduction states */
    .state('splash', {
    	url : '/splash',
    	templateUrl : 'templates/splash.html',
    	controller : 'SplashCtrl'
    })
    .state('login', {
		url : '/login',
		templateUrl : 'templates/login.html',
		controller : 'LoginCtrl'
	})
	.state('register', {
		url : '/register',
		templateUrl : 'templates/register.html',
		controller : 'RegisterCtrl'
	})
	.state('forgot', {
    	url : '/forgot',
    	templateUrl : 'templates/forgot.html'
    })

    /* App states */
	.state('app', {
		url : '/app',
		templateUrl : 'templates/app.html',
		controller : 'AppCtrl'
	})
	.state('app.notifications', {
		url : '/notifications',
		templateUrl : 'templates/app-notifications.html'
	})
	/* App people states */
	.state('app.people', {
		url : '/people',
		templateUrl : 'templates/app-people.html',
		controller : 'PeopleCtrl',
	})
	.state('app.people.friends', {
		url : '',
		templateUrl : 'templates/app-people-friends.html',
		controller : 'FriendsCtrl',
		contactType : 'friends',
		messageEmpty : "You have 0 friends on OpenQollo"
	})
	.state('app.people.users', {
		url : '/users',
		templateUrl : 'templates/app-people-users.html',
		controller : 'UsersCtrl',
		contactType : 'users',
		messageEmpty : "You have 0 contacts on OpenQollo"
	})
	.state('app.people.contacts', {
		url : '/contacts',
		templateUrl : 'templates/app-people-contacts.html',
		controller : 'ContactsCtrl',
		contactType : 'contacts',
		messageEmpty : "We couldn't read your phone contacts"
	})

	/* Menu states */
	.state('menu', {
		url : '/menu',
		templateUrl : 'templates/menu.html',
		controller : 'MenuCtrl'
	})
	.state('menu.profile', {
		url : '/profile',
		templateUrl : 'templates/menu-profile.html',
		controller : 'ProfileCtrl',
		title : 'Profile',
		icon : 'fi-torso'
	})
	.state('menu.account', {
		url : '/account',
		templateUrl : 'templates/menu-account.html',
		title : 'Account',
		icon : 'fi-widget'
	})
	.state('menu.info', {
		url : '/info',
		templateUrl : 'templates/menu-info.html',
		title : 'Info',
		icon : 'fi-info'
	})

	/* Other states */
	.state('camera', {
    	url : '/camera',
    	templateUrl : 'templates/camera.html'
   	});

	$urlRouterProvider.when('/app/people', '/app/people/friends');

	$urlRouterProvider.otherwise('/splash');

});

qolloApp.run(function($http) {
	$http.defaults.headers = { 'content-type':'application/json' };
});