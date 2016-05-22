angular.module('musicPopularity')
.factory('spotify', ['$q', '$http', function($q, $http) {

	var self = this;
	self.access_token = null;
	self.refresh_token = null;
	
	self.storeTokens = function(access_token, refresh_token) {
		var deferred = $q.defer();
		self.access_token = access_token;
		self.refresh_token = refresh_token;
		deferred.resolve();
		return deferred.promise;
	}

	self.getMyInfo = function(){
		var req = {
			method: 'GET',
			url: 'https://api.spotify.com/v1/me',
			headers: {
				'Authorization': 'Bearer ' + self.access_token
			}
		}
		return $http(req);
	}

	self.search = function(searchTerm) {
		var url = 'https://api.spotify.com/v1/search';
		url += '?q='+searchTerm;
		url += '&type=track,album,artist';
		url += '&limit=10';

		var req = {
			method: 'GET',
			url: url,
			headers: {
				'Authorization': 'Bearer ' + self.access_token
			},
			json: true
		}
		return $http(req);
	}

	self.getMultAlbumInfo = function(albumIds){
		var req = {
			method: 'GET',
			url: 'https://api.spotify.com/v1/albums?ids='+albumIds,
			headers: {
				'Authorization': 'Bearer ' + self.access_token
			}
		}
		return $http(req);
	}

	//ToDo: Should probably figure out how to make this work
	self.requestAuth = function(){
		$http.get('/api/authorize');
	}

	return self;
}]);