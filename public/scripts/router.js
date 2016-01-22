var app = angular.module('mainRoutes', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
	'use strict'

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/views/home.html',
			controller: 'IndexCtrl',
			controllerAs: 'index',
		})

		.state('temp', {
			url : '/temp',
			templateUrl: '/views/temp.html',
			controller: 'TempCtrl',
			controllerAs: 'temp'
		})
		
	$urlRouterProvider.otherwise('/');
}]);