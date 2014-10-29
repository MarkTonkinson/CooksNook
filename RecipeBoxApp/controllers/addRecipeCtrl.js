var app = angular.module("RecipeBoxApp");

app.controller('addRecipeCtrl', function($scope, recipeService, $cookieStore){

	$scope.newRecipe = {
		ingredients: [{},{},{},{},{},{}]   //why do I have to specify?  What will happen when I submit 3 ingredients instead of the max?
	}
	
	$scope.addIngredient = function(){
		$scope.newRecipe.ingredients.push({});
	}

	$scope.submitRecipe = function(){
		//get the user's info
		var user = $cookieStore.get('user');
		

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
	
	}


});