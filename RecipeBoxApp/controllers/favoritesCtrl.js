var app = angular.module('RecipeBoxApp');

app.controller('favoritesCtrl', function($scope, $location, recipeService, $cookieStore){
	$scope.getUsername();

	$scope.user = $cookieStore.get('user');
	//console.log($scope.user.favorites)

	$scope.getRecipes = function(){
		recipeService.getUserRecipes($scope.user.facebookId)
		.then(function(res){
			$scope.recipes = []
			for(var i = 0; i < res.length; i++){
				if($scope.user.favorites.indexOf(res[i]._id) !== -1){
					$scope.recipes.push(res[i]);
				}
			}
		})
	}
	$scope.getRecipes();

	$scope.unfavorite = function(recipeid){
		var arr = $scope.user.favorites;
		console.log(recipeid)
		for(var i = 0; i < arr.length; i++){
			arr.splice(arr[i],1)
			break;
			}
		
		debugger;
		recipeService.favoriteRecipe($scope.user)
		.then(function(res){
			$scope.getRecipes();
		})
	}

	$scope.checkPermissions = function(permish){
		if(permish === 'shared'){
			return false
		} else if (permish === $scope.user._id){
			return true
		} else {
			return false
		}
	}
		
})