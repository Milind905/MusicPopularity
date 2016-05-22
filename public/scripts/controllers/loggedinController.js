angular.module('musicPopularity')
.controller('LogCtrl', ['$stateParams', '$q', 'spotify', function($stateParams, $q, spotify){
	var self = this;

	self.userInfo = null;
	self.searchBox = null;
	self.searchResults = null;
	self.modSearchResults = {};
	self.topSearchResults = [];

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
			modArtistInfo();
			modTrackInfo();
			getTopTen();
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



	/**********************
		Helper Functions 
	***********************/
	function modAlbumInfo(res){
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
				tracks: tracks.toString(),
				type: res.data.albums[i].type
			} 
		}
		self.modSearchResults.albums = albumInfo;
	}

	function modArtistInfo(){
		var artistInfo = [];

		for(var i=0; i<self.searchResults.artists.items.length; i++){
			artistInfo[i] = {
				href: self.searchResults.artists.items[i].href,
				id: self.searchResults.artists.items[i].id,
				imageLarge: self.searchResults.artists.items[i].images[1],
				imageMedium: self.searchResults.artists.items[i].images[2],
				imageSmall: self.searchResults.artists.items[i].images[3],
				name: self.searchResults.artists.items[i].name,
				popularity: self.searchResults.artists.items[i].popularity,
				type: self.searchResults.artists.items[i].type
			}
		}
		self.modSearchResults.artists = artistInfo;	
	}

	function modTrackInfo() {
		var trackInfo = [];
		var artists;

		for(var i=0; i<self.searchResults.tracks.items.length; i++){
			artists = [];

			for(var j=0; j<self.searchResults.tracks.items[i].artists.length; j++){
				artists[j] = self.searchResults.tracks.items[i].artists[j].name;
			}

			trackInfo[i] = {
				albumId: self.searchResults.tracks.items[i].album.id,
				albumName: self.searchResults.tracks.items[i].album.name,
				artists: artists.toString(),
				duration: self.searchResults.tracks.items[i].duration_ms,
				explicit: self.searchResults.tracks.items[i].explicit,
				href: self.searchResults.tracks.items[i].href,
				id: self.searchResults.tracks.items[i].id,
				name: self.searchResults.tracks.items[i].name,
				preview: self.searchResults.tracks.items[i].preview_url,
				popularity: self.searchResults.tracks.items[i].popularity,
				type: self.searchResults.tracks.items[i].type
			}
		}
		self.modSearchResults.tracks = trackInfo;	
	}

	function getTopTen() {
		var topTenItems = [];

		for(var i=0; i<self.modSearchResults.tracks.length; i++){
			topTenItems.push(self.modSearchResults.tracks[i]);
		}
		for(var i=0; i<self.modSearchResults.albums.length; i++){
			topTenItems.push(self.modSearchResults.albums[i]);
		}
		for(var i=0; i<self.modSearchResults.artists.length; i++){
			topTenItems.push(self.modSearchResults.artists[i]);
		}
		self.topSearchResults = sortOnPopularity(topTenItems);
	}

	function sortOnPopularity(inArray) {
		var outArray = inArray.sort(comparePopularity);
		outArray = outArray.splice(0, 10);
		return outArray;
	}

	function comparePopularity(a, b){
		if(a.popularity < b.popularity){
			return 1;
		} else if(a.popularity > b.popularity){
			return -1;
		} else {
			return 0;
		}
	}

}]);