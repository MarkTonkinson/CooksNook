var app = angular.module('RecipeBoxApp');

app.controller('singleRecipeCtrl', function($scope, getRecipeToView, recipeService, $cookieStore){
	$scope.getUsername();
	 $scope.recipe = getRecipeToView
	$scope.getUser = function(){
		if(!$scope.username){
			//console.log("we are ok")
		}else if($scope.username){
			$scope.user = $cookieStore.get('user');
			var uId = $scope.user._id
		}
	}
	$scope.getUser();
	
	$scope.checkPermissions = function(permish){
		if(!$scope.user){
			return false
		} else if($scope.user.admin === true){
			return true
		} else if (permish === 'shared'){
			return false
		} else if (permish === $scope.user._id){
			return true
		} else {
			return false
		}
	}

	$scope.checkForBook = function(page){
		console.log('the page', page)
		if(page){
			return true
		} else {
			return false
		}
	}


// **********FAVORITES FUNCTIONALITY*************
	
	$scope.checkFavorites = function(recipeid){
		
		if(!$scope.user){
			return false
		}
		//if it's a favorite- return false
		else if($scope.user.favorites.indexOf(recipeid) !== -1){
			return false
		} else {
			return true

		}

	}

	$scope.checkFavorites2 = function(recipeid){
		if(!$scope.user){
			return false
		}
		//if it's a favorite- return false
		else if($scope.user.favorites.indexOf(recipeid) !== -1){
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