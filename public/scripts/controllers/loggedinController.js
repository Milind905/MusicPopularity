angular.module('musicPopularity')
.controller('LogCtrl', ['$stateParams', '$q', 'spotify', function($stateParams, $q, spotify){
	var self = this;

	self.userInfo = null;
	self.searchBox = null;
	self.searchResults = null;
	self.modSearchResults = {};

	self.obtainTokens = function() {
		return spotify.storeTokens($stateParams.access_token, $stateParams.refresh_token);
	};

	self.search = function() {
		spotify.search(self.searchBox).then(function(res){
			self.searchResults = res.data;
			self.sortSearchResults();
		}, function(err){
			//do something
		});
	}

	self.sortSearchResults = function(){
		var albumIds = [];

		for(var i=0; i<self.searchResults.albums.items.length; i++){
			albumIds[i] = self.searchResults.albums.items[i].id;
		}
		spotify.getMultAlbumInfo(albumIds.toString()).then(function(res){
			modAlbumInfo(res);
			modArtistInfo(res);
		}, function(err){
			//do something
		}).then(function(res){
					});
	}

    self.obtainTokens().then(function(){
		return spotify.getMyInfo();
	}).then(function(res){
		self.userInfo = res.data;
	}, function(err){
		//do something
	});

	/***** Helper Functions *****/
	function modAlbumInfo(res){
		var deferred = $q.defer();
		var albumInfo = [];
		var artists;
		var tracks;

		for(var i=0; i<res.data.albums.length; i++){
			artists = [];
			tracks = [];

			for(var j=0; j<res.data.albums[i].artists.length; j++){
				artists[j] = res.data.albums[i].artists[j].name;
			}
			for(var j=0; j<res.data.albums[i].tracks.items.length; j++) {
				tracks[j] = res.data.albums[i].tracks.items[j].name;
			}

			albumInfo[i] = {
				artists: artists.toString(),
				href: res.data.albums[i].href,
				id: res.data.albums[i].id,
				imageLarge: res.data.albums[i].images[0],
				imageMedium: res.data.albums[i].images[1],
				imageSmall: res.data.albums[i].images[2],
				name: res.data.albums[i].name,
				popularity: res.data.albums[i].popularity,
				release_date: res.data.albums[i].release_date,
				tracks: tracks.toString()
			} 
		}

		self.modSearchResults.albums = albumInfo;
		deferred.resolve();
		return deferred.promise;
	}

}]);