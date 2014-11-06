var app = angular.module('RecipeBoxApp');

app.controller('singleRecipeCtrl', function($scope, $route, getRecipeToView, recipeService, $location, $cookieStore){
	$scope.getUsername();
	 $scope.recipe = getRecipeToView
	 console.log($scope.recipe)
	

	$scope.addRecipe = function(userid){
		if(!userid){
			alert("Log in to add this recipe!")
		} else {
			$scope.userRecipes.push($scope.recipe._id);
				var updateUserReqBody = {
					_id : $scope.user._id,
					recipes : $scope.userRecipes
				}
				recipeService.updateUser(updateUserReqBody)
				.then(function(res){
					$route.reload();

			})
		}
		
	}

	$scope.hasRecipe = false;


	 	//you need this so that you can check whether the user has the recipe
	$scope.checkIfHasRecipe = function(){
		if($scope.userRecipes.indexOf($scope.recipe._id) > -1){
			$scope.canDelete = true;
			return $scope.hasRecipe = true;

		} else {
			return $scope.hasRecipe = false;
		}
	}

	$scope.userRecipes = []
	$scope.getUserRecipes = function(){
		recipeService.getUserRecipes($scope.user.facebookId)
		.then(function(res){
			for(var i = 0; i < res.length; i++){
				$scope.userRecipes.push(res[i]._id);
			}
			console.log($scope.userRecipes);
			$scope.checkIfHasRecipe()
		})
	}

	$scope.getUser = function(){
		if(!$scope.username){
			//console.log("we are ok")
		}else if($scope.username){
			$scope.user = $cookieStore.get('user');
			var uId = $scope.user._id
			$scope.getUserRecipes();
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


	$scope.removeRecipe = function(recipeId){
		recipeService.deleteRecipe(recipeId, $scope.user.facebookId);
		$location.path('/home/' + $scope.username)
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
	
	//TODO: Fix it if so can add to user
	$scope.addToFavorites = function(recipeid){
		
		$scope.user.favorites.push(recipeid);
		var favoritesReqBody = {
			_id : $scope.user._id,
			favorites : $scope.user.favorites
		}
		recipeService.updateUser(favoritesReqBody)
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
		recipeService.updateUser($scope.user)
		.then(function(res){
			$scope.getRecipes();
		})
	}
	


})