angular.module('musicPopularity')
.factory('spotify', ['$q', '$http', function($q, $http) {

	var self = this;
	
	//ToDo: Should probably figure out how to make this work
	self.requestAuth = function(){
		$http.get('/api/authorize');
	}

	return self;
}]);