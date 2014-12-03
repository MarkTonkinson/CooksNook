var app = angular.module('RecipeBoxApp');

app.controller('editRecipeCtrl', function($scope, getRecipe, recipeService, $routeParams, $location, $cookieStore){
	$scope.recipe = getRecipe;
	$scope.tabChange('other');
	
	$scope.getUsername();
	var user = $cookieStore.get('user');
	
	$scope.user = user.userName;
	//console.log("hey there ", $scope.user)

	$scope.require = function(){
		if($scope.recipe.location === 'Website'){
			$scope.websiteRequired = true;
			$scope.bookRequired = false;
			$scope.recipe.bookTitle = '';
			$scope.recipe.bookPageNumber = '';

		} else if ($scope.recipe.location === 'Book'){
			$scope.bookRequired = true;
			$scope.websiteRequired = false;
			$scope.recipe.recipeUrl = '';
		} else {
			$scope.websiteRequired =false;
			$scope.bookRequired = false; 
		}
		//console.log("check requirement", $scope.websiteRequired + ' ' + $scope.bookRequired)
	}

	$scope.editRecipe = function(){
		var paramsid = $routeParams //comes back as an object, very interesting
		var id = paramsid.recipeid;

		if($scope.recipe.recipeImage === ''){
			$scope.recipe.recipeImage = "../images/default.png"
		}

		var arr = $scope.recipe.ingredients
		//console.log(arr);
		var newIngArr=[];
		for(var i=0; i < arr.length; i++){
			if(Object.keys(arr[i]).length >= 2) { //always has a hash
				newIngArr.push(arr[i])
			} 
		$scope.recipe.ingredients = newIngArr;
		}

		var arr2 = $scope.recipe.instructions
		//console.log(arr2)
		var instArr = []
		for(var j = 0; j < arr2.length; j++){
			if(Object.keys(arr2[j]).length > 0){
				instArr.push(arr2[j])
			}		
		}
		$scope.recipe.instructions = instArr;
		


		recipeService.editRecipe(id, $scope.recipe)
		.then(function(res){
			$scope.recipe = '';
			$location.path('/home/' + $scope.user);

		})
	}

	$scope.addIngredient = function(){
		$scope.recipe.ingredients.push({});
	}

	$scope.addStep = function(){
		$scope.recipe.instructions.push({});
	}

	$scope.removeIngredient = function(index){
		//console.log('indexed ing ',index)
		$scope.recipe.ingredients.splice(index, 1)
	}

	$scope.removeStep = function(index){
		$scope.recipe.instructions.splice(index, 1)
	}

})