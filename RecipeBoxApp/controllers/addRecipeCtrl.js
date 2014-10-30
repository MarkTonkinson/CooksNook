var app = angular.module("RecipeBoxApp");

app.controller('addRecipeCtrl', function($scope, recipeService, $cookieStore, $location, $routeParams){
	//get the user's info
	$scope.getUsername();
	var user = $cookieStore.get('user');
	$scope.person = user.userName;
	console.log('the user ',$scope.person)

	$scope.newRecipe = {
		ingredients: [{},{},{},{},{},{}]   //why do I have to specify?  What will happen when I submit 3 ingredients instead of the max?
	}
	
	$scope.addIngredient = function(){
		$scope.newRecipe.ingredients.push({});
	}

	$scope.submitRecipe = function(){
		if($scope.newRecipe.location === "Personal"){
			$scope.newRecipe.permissionsTag = user._id;
		} else {
			$scope.newRecipe.permissionsTag = "shared"
		}
		
		//stop from posting the empty objects
		var arr = $scope.newRecipe.ingredients
		var newIngArr=[];
		for(var i=0; i < arr.length; i++){
			if(Object.keys(arr[i]).length >= 2) { //always has a hash
				newIngArr.push(arr[i])
			} 
		$scope.newRecipe.ingredients = newIngArr;
		}
		
		//console.log($scope.newRecipe);
		recipeService.addNewRecipe($scope.newRecipe, user._id);
		$scope.newRecipe = ''
		$location.path('/home/' + $scope.person)
	}


});