var app = angular.module('RecipeBoxApp');

app.service('adminService', function($http, $q){
	this.getUsers = function(){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/admin/getUsers'
		}).then(function(res){
			deferred.resolve(res.data)
		})
		return deferred.promise;
		
	}
})