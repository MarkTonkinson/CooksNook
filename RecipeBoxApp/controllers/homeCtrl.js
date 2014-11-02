var app = angular.module('RecipeBoxApp');

app.controller('homeCtrl', function($scope, user, userService, recipeService, $cookieStore){
	
	$scope.getUsername();

	$scope.user = $cookieStore.get('user');
	//this solves one problem- but what if it is shared?
	//how do you give a copy?- remove the id when it's gone?
	var uId = $scope.user._id

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
	$scope.getRecipes = function(){
		recipeService.getUserRecipes($scope.user.facebookId)
		.then(function(res){
			
			$scope.recipes = res;		
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