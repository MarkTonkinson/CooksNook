var app = angular.module('RecipeBoxApp');

app.service('userService', function($http, $q, $cookieStore){
	this.getFacebookUser = function(){
		if($cookieStore.get('user')){
			//console.log('we already did this');  //if they are already here, we don't need to do this resolve over again- it will get undefined
		} else {
			var deferred = $q.defer();
			$http ({
				method: 'GET',
				url: 'http://localhost:3000/me'
			}).then(function(res){
				var fbUser = res.data;
				$cookieStore.put('user', fbUser);
				console.log(res.data)
				return deferred.resolve(fbUser);
			})
			return deferred.promise;
		}
	}
	
	this.saveCollection = function(newCollection, userid){
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: 'http://localhost:3000/api/collections/' + userid,
			data: newCollection
		}).then(function(res){
			return deferred.resolve(res.data)
		})
		return deferred.promise

	}

	this.updateCollection = function(collection, userid){
		var deferred = $q.defer();
		$http({
			method: 'PUT',
			url: 'http://localhost:3000/api/collections/' + userid,
			data: collection
		}).then(function(res){
			return deferred.resolve(res.data)
		})
		return deferred.promise
	}

	this.getCollections = function(userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://localhost:3000/api/collections/' + userid
		}).then(function(res){
			return deferred.resolve(res.data)
		})
		return deferred.promise
	}

	this.getCollection = function(collectionid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://localhost:3000/api/collection/' + collectionid
		}).then(function(res){
			return deferred.resolve(res.data);
		})
		return deferred.promise;	
	}

	this.getRecipesInCollection = function(collectionid){
		console.log(collectionid)
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://localhost:3000/api/recipesInCollection/' + collectionid
		}).then(function(res){
			return deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.deleteUserCollection = function(collectionid, userid){
		var deferred = $q.defer();
		$http({
			method: 'DELETE',
			url: 'http://localhost:3000/api/collections/' + collectionid + '/' +userid
		}).then(function(res){
			return deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.getPublicCollections = function(){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://localhost:3000/api/publicCollections'
		}).then(function(res){
			return deferred.resolve(res.data);
		})
		return deferred.promise;

	}

})