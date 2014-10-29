var app = angular.module('RecipeBoxApp');

app.controller('homeCtrl', function($scope, user, userService, recipeService, $cookieStore){

	$scope.getUsername();

	$scope.user = $cookieStore.get('user');
	console.log($scope.user)
	

	$scope.getRecipes = function(){
		recipeService.getUserRecipes($scope.user.facebookId)
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