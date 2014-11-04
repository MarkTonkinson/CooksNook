var app = angular.module('RecipeBoxApp');

app.controller('homeCtrl', function($scope, user, userService, recipeService, $cookieStore){
	
	//The problem is that because those recipes are added externally the user doesn't get saved in cookie store when they come back
	//so when the user gets updated, the recipes aren't in the recipe array, so the user data gets overwritten.
	//in the long term- you wouldn't have to rewrite the whole user I don't think . . .
	//a temporary fix would be to loop over the response from server and save new incoming recipes.
	///another option would be to just update the new favorite . .
	//do it just like the post, get back the user- add to set and save- don't update the user that way.
	//
	//this happens in part because I wrote the code so it wouldn't ping the server every single time 
	//the page needed something off the user . . 

	$scope.getUsername();

	$scope.user = $cookieStore.get('user');
	//this solves one problem- but what if it is shared?
	//how do you give a copy?- remove the id when it's gone?
	var uId = $scope.user._id

	console.log($scope.user)

	$scope.checkPermissions = function(permish){
		if($scope.user.admin === true){
			return true
		} else if(permish === 'shared'){
			return false
		} else if (permish === $scope.user._id){
			return true
		} else {
			return false
		}
	}

	
	

//*****************Getting/Deleting Recipes*************
	$scope.recipeSpinner = false;
	$scope.getRecipes = function(){
		$scope.recipeSpinner = true;
		recipeService.getUserRecipes($scope.user.facebookId)
		.then(function(res){
			
			$scope.recipes = res;
			$scope.recipeSpinner = false		
		})
	}
	$scope.getRecipes();

	$scope.removeRecipe = function(recipeId){
		recipeService.deleteRecipe(recipeId, $scope.user.facebookId);
		$scope.getRecipes();
	}	


// **********FAVORITES FUNCTIONALITY*************
	$scope.checkFavorites = function(recipeid){
		//if it's a favorite- return false
		if($scope.user.favorites.indexOf(recipeid) !== -1){
			return false
		} else {
			return true

		}

	}

	$scope.checkFavorites2 = function(recipeid){
		//if it's a favorite- return false
		if($scope.user.favorites.indexOf(recipeid) !== -1){
			return true
		} else {
			return false

		}

	}
	

	$scope.addToFavorites = function(recipeid){
		$scope.user.favorites.push(recipeid);

		recipeService.favoriteRecipe($scope.user)
		.then(function(res){
			//console.log($scope.user);
		})
	}

	$scope.unfavorite = function(recipeid){
		var arr = $scope.user.favorites;
		//console.log(recipeid)
		//console.log(arr)
		for(var i = 0; i < arr.length; i++){
			if(arr[i] === recipeid){
				arr.splice(i,1)
				break;
			}
			//
			//
			}
		
		//debugger;
		recipeService.favoriteRecipe($scope.user)
		.then(function(res){
			$scope.getRecipes();
		})
	}
	
	
	

})