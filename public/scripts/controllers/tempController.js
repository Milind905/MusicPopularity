angular.module('musicPopularity')
.controller('TempCtrl', ['spotify', function(spotify){
	var self = this;

	self.test = 'Hello Temp!';
	self.login = function() {
		spotify.requestAuth();
	}
}]);