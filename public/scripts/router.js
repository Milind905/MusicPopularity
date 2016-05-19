var app = angular.module('mainRoutes', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
	'use strict'

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/views/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'home',
		})

		.state('error', {
			url : '/error?apierror',
			templateUrl: '/views/error.html',
			controller: 'ErrorCtrl',
			controllerAs: 'error'
		})

		.state('loggedin', {
			url: '/loggedin?access_token&refresh_token',
			templateUrl: '/views/loggedin.html',
			controller: 'LogCtrl',
			controllerAs: 'logged'
		})
		
	$urlRouterProvider.otherwise('/');
}]);