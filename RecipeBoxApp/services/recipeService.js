var app = angular.module('RecipeBoxApp');

app.service('recipeService', function($http, $q, $cookieStore){

	this.addNewRecipe = function(recipe, userid){
		console.log(recipe)
		console.log(userid)
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: 'http://localhost:3000/recipes/' + userid,
			data: recipe
		}).then(function(res){
			console.log('recipe id? ', res)
			deferred.resolve(res);
		})
		return deferred.promise
		
	}

	this.updateUser = function(user){
		console.log('on the way to update whatever', user);
		var deferred = $q.defer();
		$http({
			method: 'PUT',
			url: 'http://localhost:3000/api/user/update/' + user,
			data: user 
		}).then(function(res){
			updatedData = res.data;
			$cookieStore.put('user', updatedData)
			deferred.resolve(res);
			console.log('user updated ', updatedData)
		})
		return deferred.promise
	}

	//not using this currently
	this.getRecipes = function(){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://localhost:3000/recipes'
		}).then(function(res){
			//console.log('recipes', res);
			deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	
	this.getUserRecipes = function(facebookid){
		//console.log('did we get ', id)
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://localhost:3000/api/user/recipes/' + facebookid
		}).then(function(res){
			//console.log('recipes', res);
			deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.getRecipeById = function(recipeid){ 
		//console.log('got the id from routes ', recipeid);
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://localhost:3000/api/get/recipe/' + recipeid
		}).then(function(res){
			//console.log('got recipe by id', res.data)
			deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.editRecipe = function(recipeid, recipe){ 
		
		return $http({
			method: 'PUT',
			url: 'http://localhost:3000/api/update/recipes/' + recipeid,
			data: recipe
		})
	}

	this.deleteRecipe = function(recipeId, fbId){
		console.log(recipeId  + ' and ' + fbId)
		$http({
			method: 'DELETE',
			url: 'http://localhost:3000/api/' +fbId +'/recipe/' + recipeId
		});

	}

})