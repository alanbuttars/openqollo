'use strict';

var qolloApp = angular.module('qolloApp', [ 'ui.router', 'qolloControllers' ]);

qolloApp.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('login', {
		url : '/login',
		templateUrl : 'templates/login.html'
	})
	.state('register', {
		url : '/register',
		templateUrl : 'templates/register.html'
	})
	.state('app', {
		url : '/app',
		templateUrl : 'templates/app.html'
	})
	.state('forgot', {
		url : '/forgot',
		templateUrl : 'templates/forgot.html'
	});

	$urlRouterProvider.otherwise('/login');

});