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
	})
	.state('app.notifications', {
		url : '/notifications',
		templateUrl : 'templates/app-notifications.html'
	})
	.state('app.friends', {
		url : '/friends',
		templateUrl : 'templates/app-friends.html'
	})

	/* Menu states */
	.state('menu', {
		url : '/menu',
		templateUrl : 'templates/menu.html'
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

	$urlRouterProvider.otherwise('/splash');

});