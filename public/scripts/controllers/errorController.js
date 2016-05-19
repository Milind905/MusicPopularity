angular.module('musicPopularity')
.controller('ErrorCtrl', ['$q', '$stateParams', function($q, $stateParams){
	var self = this;
	self.apiError = $stateParams.apierror;
}]);