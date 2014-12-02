var app = angular.module('RecipeBoxApp');

app.service('userService', function($http, $q, $cookieStore, recipeService){
	
	this.getFacebookUser = function(){
		if($cookieStore.get('user')){
			//console.log('we already did this');  //if they are already here, we don't need to do this resolve over again- it will get undefined
		} else {
			var deferred = $q.defer();
			$http ({
				method: 'GET',
				url: '/me'
			}).then(function(res){
				var fbUser = res.data;
				$cookieStore.put('user', fbUser);
				//console.log(res.data)
				return deferred.resolve(fbUser);
			})
			return deferred.promise;
		}
	}
	
	this.getUser = function(userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/user/' + userid,
		}).then(function(res){
			return deferred.resolve(res.data)
		})
		return deferred.promise

	}
	this.saveCollection = function(newCollection, userid){
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: '/api/collections/' + userid,
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
			url: '/api/collections/' + userid,
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
			url: '/api/collections/' + userid
		}).then(function(res){
			return deferred.resolve(res.data)
		})
		return deferred.promise
	}

	this.getCollection = function(collectionid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/collection/' + collectionid
		}).then(function(res){
			return deferred.resolve(res.data);
		})
		return deferred.promise;	
	}

	this.getRecipesInCollection = function(collectionid){
		//console.log(collectionid)
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/recipesInCollection/' + collectionid
		}).then(function(res){
			return deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.deleteUserCollection = function(collectionid, userid){
		var deferred = $q.defer();
		$http({
			method: 'DELETE',
			url: '/api/collections/' + collectionid + '/' +userid
		}).then(function(res){
			return deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.getPublicCollections = function(){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/publicCollections'
		}).then(function(res){
			return deferred.resolve(res.data);
		})
		return deferred.promise;

	}

	this.getUserNotes = function(userid){

		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/usernotes/' + userid
		}).then(function(res){

			return deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.getRecipeNotes = function(recipeid){

		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/recipenotes/' + recipeid
		}).then(function(res){

			return deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.postNote = function(note){
		
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: '/api/notes/' + note.userid,
			data: note
		}).then(function(res){

			return deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.editNote = function(note){
		var deferred = $q.defer();
		$http({
			method: 'PUT',
			url: '/api/notes/' + note.userid,
			data: note
		}).then(function(res){
			
			return deferred.resolve(res.data);
		})
		return deferred.promise;	
	}

	this.getFriends = function(userid){
		
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/userfriends/' + userid
		}).then(function(res){

			return deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.getFriendRequests = function(userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/userFriendRequests/' + userid
		}).then(function(res){

			return deferred.resolve(res.data);
		})
		return deferred.promise;

	}

	this.updateFriend = function(friend){
		var deferred = $q.defer();
		$http({
			method: 'PUT',
			url: '/api/friend/' + friend._id,
			data: friend
		}).then(function(res){

			return deferred.resolve(res.data);
		})
		return deferred.promise;	
	}

	this.getFriendProfile = function(id){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/friendProfile/' + id
		}).then(function(res){

			return deferred.resolve(res.data);
		})
		return deferred.promise;	
	
	}

})