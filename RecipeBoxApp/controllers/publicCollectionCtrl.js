var app = angular.module('RecipeBoxApp');

app.controller('publicCollectionCtrl', function($scope, $cookieStore, getCollection, getCollectionRecipes, recipeService, userService){
	$scope.getUsername();
	console.log($scope.getUsername());
	//this may make it an issue if someone comes to see the site without logging in . . .
	$scope.user = $cookieStore.get('user');
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


	//Need user recipes so you can save the recipes if they add it to the user.
	// WRAPPER FUNCTION ANYTHING FOR USER HAS TO BE IN HERE
	if($scope.getUsername() !== undefined){


		$scope.getRecipes = function(){
			recipeService.getUserRecipes($scope.user.facebookId)
			.then(function(res){
				$scope.userRecipes = []
				console.log('res ', res)
				for(var i = 0; i < res.length; i++){
					$scope.userRecipes.push(res[i]._id);
				}
				console.log($scope.userRecipes)
			})
		}
		$scope.getRecipes();
	
		
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
				$scope.userRecipes.splice($scope.userRecipes.indexOf(recipeid), 1);
			} else if (addornot === 'pushRecipe') {
				$scope.selectedCollection.recipes.push(recipeid);
				$scope.userRecipes.push(recipeid);		
			} 
		}
		


		$scope.pushToCollection = function(recipeid){
			$scope.selectedCollection.recipes.push(recipeid);
			$scope.userRecipes.push(recipeid);

		}

		$scope.updateCollection = function(){
			var userRecipesReqBody = {
				_id : $scope.user._id,
				recipes : $scope.userRecipes
			}
			
			recipeService.updateUser(userRecipesReqBody)
			.then(function(res){
				console.log('recipes saved')
			})

			userService.updateCollection($scope.selectedCollection, $scope.user._id)
			.then(function(res){
				$scope.selectedCollection = ''
			})
		}
	}		

})