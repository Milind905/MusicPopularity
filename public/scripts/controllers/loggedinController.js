angular.module('musicPopularity')
.controller('LogCtrl', ['$stateParams', '$q', 'spotify', function($stateParams, $q, spotify){
	var self = this;

	self.userInfo = null;
	self.searchBox = null;
	self.searchResults = null;

	self.obtainTokens = function() {
		return spotify.storeTokens($stateParams.access_token, $stateParams.refresh_token);
	};

	self.search = function() {
		spotify.search(self.searchBox).then(function(res){
			console.log(res);
			self.searchResults = res.data;
		}, function(err){
			//do something
		});
	}

    self.obtainTokens().then(function(){
		return spotify.getMyInfo();
	}).then(function(res){
		self.userInfo = res.data;
	}, function(err){
		//do something
	});

}]);