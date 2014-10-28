var app = angular.module('RecipeBoxApp');

app.service('recipeService', function($http, $q){

	this.addNewRecipe = function(recipe, userid){
		//console.log(recipe)
		//console.log(userid)
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: 'http://localhost:3000/recipes/' + userid,
			data: recipe
		}).then(function(res){
			console.log('recipe id? ', res.data[0]._id)
			deferred.resolve(res);
		})
		return deferred.promise
		
	}

	this.getRecipes = function(){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://localhost:3000/recipes'
		}).then(function(res){
			console.log('recipes', res);
			deferred.resolve(res.data);
		})
		return deferred.promise;
	}

	this.deleteRecipe = function(recipeId){
		$http({
			method: 'DELETE',
			url: 'http://localhost:3000/recipes/' + recipeId
		});

	}

})