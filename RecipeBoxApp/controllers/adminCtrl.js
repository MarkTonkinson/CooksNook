var app = angular.module('RecipeBoxApp');

app.controller('adminCtrl', function($scope, recipeService, userService, $cookieStore){

	$scope.test = "hello world"
	$scope.user = $cookieStore.get('user');
	$scope.findRecipe = function(){
		recipeService.getRecipeById($scope.searchid).
		then(function(res){
			$scope.recipe = res;
		})
	}

	var getPublicCollections = function(){
		userService.getPublicCollections()
		.then(function(res){
			$scope.collections = res;
		})
	}
	getPublicCollections();

	$scope.addToRecipes = function(collection, id){
		if(collection.recipes.indexOf(id)=== -1){
			collection.recipes.push(id)
		} else {
			console.log("this recipe already here")
		}
		
	}

	$scope.saveCollection =function(collection){
		userService.updateCollection(collection, $scope.user._id)
	}

	$scope.deleteCollection = function(collectionid){
		userService.deletePublicCollection(collectionid);
	}
})