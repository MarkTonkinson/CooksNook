var app = angular.module('RecipeBoxApp');

app.controller('homeCtrl', function($scope, user, userService, recipeService, $cookieStore){

	$scope.getUsername();

	$scope.user = $cookieStore.get('user');
	//this solves one problem- but what if it is shared?
	//how do you give a copy?- remove the id when it's gone?
	var uId = $scope.user._id
	$scope.checkPermissions = function(permish){
		if(permish === 'shared'){
			return false
		} else if (permish === $scope.user._id){
			return true
		} else {
			return false
		}
	}

	$scope.checkFavorites = function(recipeid){
		if($scope.user.favorites.indexOf(recipeid) !== -1){
			//console.log($scope.user.favorites)
			return false
		} else {
			return true
		}

	}


	$scope.getRecipes = function(){
		recipeService.getUserRecipes($scope.user.facebookId)
		.then(function(res){
			
			$scope.recipes = res;		
		})
	}
	$scope.getRecipes();
	//$scope.checkFavorites();
	
	
	

	$scope.addToFavorites = function(recipeid){
		$scope.user.favorites.push(recipeid);
		recipeService.favoriteRecipe($scope.user)
		.then(function(res){
			console.log($scope.user);
		})
	}
	
	
	
	$scope.removeRecipe = function(recipeId){
		recipeService.deleteRecipe(recipeId, $scope.user.facebookId);
		$scope.getRecipes();
	}	
})