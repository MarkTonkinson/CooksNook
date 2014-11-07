var app = angular.module('RecipeBoxApp');

app.controller('publicCollectionCtrl', function($scope, getCollection, getCollectionRecipes){
	$scope.getUsername();
	$scope.recipes = getCollectionRecipes;
	$scope.collection = getCollection;

	$scope.recipeImageShow = function(recipeimage){
		if(recipeimage ===''){
			return true
		} else if (recipeimage === 'none'){
			return false
		} else {
			return true
		}
	}
})