var app = angular.module('RecipeBoxApp');

app.controller('homeCtrl', function($scope, user, userService, recipeService, $cookieStore){

	
	$scope.user = $cookieStore.get('user');

	$scope.getRecipes = function(){
		recipeService.getRecipes()
		.then(function(res){
			$scope.recipes = res;
		})
	}
	$scope.getRecipes();
	

	$scope.removeRecipe = function(recipeId){
		recipeService.deleteRecipe(recipeId);
		$scope.getRecipes();
	}	
})