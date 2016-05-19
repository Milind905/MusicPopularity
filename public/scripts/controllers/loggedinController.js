angular.module('musicPopularity')
.controller('LogCtrl', ['$stateParams', '$http', '$q', 'spotify', function($stateParams, $http, $q, spotify){
	var self = this;

	self.access_token = null;
	self.refresh_token = null;
	self.userInfo = null;

	self.obtainTokens = function() {
		self.access_token = $stateParams.access_token;
		self.refresh_token = $stateParams.refresh_token;
		
		//potentially move into spotify services
		var req = {
		 	method: 'GET',
		 	url: 'https://api.spotify.com/v1/me',
		 	headers: {
              'Authorization': 'Bearer ' + self.access_token
            }
		}

		$http(req).then(function(res){
			self.userInfo = res.data;
		}, function(err){
			//do something
		});
	};

    self.obtainTokens();
}]);