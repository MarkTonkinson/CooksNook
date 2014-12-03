var app = angular.module('RecipeBoxApp');

app.controller('homeCtrl', function($scope, user, userService, recipeService, $cookieStore, $route){
	
	//The problem is that because those recipes are added externally the user doesn't get saved in cookie store when they come back
	//so when the user gets updated, the recipes aren't in the recipe array, so the user data gets overwritten.
	//in the long term- you wouldn't have to rewrite the whole user I don't think . . .
	//a temporary fix would be to loop over the response from server and save new incoming recipes.
	///another option would be to just update the new favorite . .
	//do it just like the post, get back the user- add to set and save- don't update the user that way.
	//
	//this happens in part because I wrote the code so it wouldn't ping the server every single time 
	//the page needed something off the user . . 
	//I could also fix this by picking more specific data to store to the cookie rather than everything-
	//that would just get more busy  . . .

	$scope.getUsername();
	$scope.tabChange('home');

	$scope.user = $cookieStore.get('user');

	//this solves one problem- but what if it is shared?
	//how do you give a copy?- remove the id when it's gone?
	var uId = $scope.user._id

	//console.log($scope.user)

	

	$scope.recipeImageShow = function(recipeimage){
		if(recipeimage ===''){
			return true
		} else if (recipeimage === 'none'){
			return false
		} else {
			return true
		}
	}

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

	$scope.existsCollection = false;
	$scope.getCollections = function(){
		userService.getCollections($scope.user._id)
		.then(function(res){
			//console.log(res)
			$scope.collections = res;
			if($scope.collections.length){
				$scope.existsCollection = true;
			}
		})
	}

	$scope.getCollections();


	$scope.checkCollection = function(addornot, recipeid){
		if(addornot === 'spliceValue'){
			$scope.selectedCollection.recipes.splice($scope.selectedCollection.recipes.indexOf(recipeid), 1);
		} else if (addornot === 'pushRecipe') {
			$scope.selectedCollection.recipes.push(recipeid);
		
		} 
	}
	


	$scope.pushToCollection = function(recipeid){
		$scope.selectedCollection.recipes.push(recipeid);

	}
	$scope.updateCollection = function(){
		userService.updateCollection($scope.selectedCollection, $scope.user._id)
		.then(function(res){
			$scope.selectedCollection = ''
		})
	}	
	

//*****************Getting/Deleting Recipes*************
	$scope.recipeSpinner = false;
	$scope.getRecipes = function(){
		$scope.recipeSpinner = true;
		recipeService.getUserRecipes($scope.user.facebookId)
		.then(function(res){
			
			$scope.recipes = res.reverse();
			$scope.recipeSpinner = false		
		})
	}
	$scope.getRecipes();
	
	$scope.removeRecipe = function(recipeId){
		//if you remove it from the page, you want to remove it from the collection as well.
		var arr = $scope.collections
		for (var i = 0; i < arr.length; i++){
			if(arr[i].recipes.indexOf(recipeId) > -1){
				arr[i].recipes.splice(arr[i].recipes.indexOf(recipeId), 1)
				$scope.selectedCollection = arr[i];
				$scope.updateCollection()
			}
		}


		recipeService.deleteRecipe(recipeId, $scope.user.facebookId)
		.then(function(res){
			$scope.getRecipes();
		})
		
	}

	//All removes are soft now, unless logged in as admin, which have to fix elsewhere . . .
	// $scope.softRemove = function(recipeid){
	// 	userService.updateUser($scope.user)
	// 	$scope.getRecipes();
	// }	


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
		var unfavoriteReqBody = {
			_id : $scope.user._id,
			favorites : $scope.user.favorites
		}
		for(var i = 0; i < arr.length; i++){
			if(arr[i] === recipeid){
				arr.splice(i,1)
				break;
			}
			//
			//
			}
		
		//debugger;
		recipeService.updateUser(unfavoriteReqBody)
		.then(function(res){
			$scope.getRecipes();
		})
	}
	
	
	

})