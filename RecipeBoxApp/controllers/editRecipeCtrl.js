var app = angular.module('RecipeBoxApp');

app.controller('editRecipeCtrl', function($scope, getRecipe, recipeService, $routeParams, $location, $cookieStore){
	$scope.recipe = getRecipe;
	

	var user = $cookieStore.get('user');
	
	$scope.user = user.userName;
	console.log("hey there ", $scope.user)


	$scope.editRecipe = function(){
		var paramsid = $routeParams //comes back as an object, very interesting
		var id = paramsid.recipeid;


		var arr = $scope.recipe.ingredients
		console.log(arr);
		var newIngArr=[];
		for(var i=0; i < arr.length; i++){
			if(Object.keys(arr[i]).length >= 2) { //always has a hash
				newIngArr.push(arr[i])
			} 
		$scope.recipe.ingredients = newIngArr;
		}

		recipeService.editRecipe(id, $scope.recipe)
		.then(function(res){
			$location.path('/home/' + $scope.user)
		})
	}

	$scope.addIngredient = function(){
		$scope.recipe.ingredients.push({});
	}

})