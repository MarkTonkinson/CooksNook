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

	this.getUser = function(userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/admin/getUser/' + userid
		}).then(function(res){
			deferred.resolve(res.data)
		})
		return deferred.promise;
	}

	this.updateUser = function(user){
		var deferred = $q.defer();
		$http({
			method: 'PUT',
			url: '/admin/updateUser/' + user._id,
			data: user
		}).then(function(res){
			deferred.resolve(res.data)
		})
		return deferred.promise;
	}
})