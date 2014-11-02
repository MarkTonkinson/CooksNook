var app = angular.module("RecipeBoxApp");

app.controller('addRecipeCtrl', function($scope, recipeService, $cookieStore, $location, $routeParams){
	//get the user's info
	$scope.getUsername();
	var user = $cookieStore.get('user');
	$scope.person = user.userName;
	console.log('the user ',$scope.person)

	$scope.newRecipe = {
		ingredients: [{},{},{},{},{},{}],   //why do I have to specify?  What will happen when I submit 3 ingredients instead of the max?
		instructions:[{},{},{},{},{},{}]
	}
	
	$scope.addIngredient = function(){
		$scope.newRecipe.ingredients.push({});
	}

	$scope.addStep = function(){
		$scope.newRecipe.instructions.push({});
	}

	$scope.removeIngredient = function(index){
		//console.log('indexed ing ',index)
		$scope.newRecipe.ingredients.splice(index, 1)
	}

	$scope.removeStep = function(index){
		$scope.newRecipe.instructions.splice(index, 1)
	}

	//$scope.webPattern = ;
	$scope.require = function(){
		if($scope.newRecipe.location === 'Website'){
			$scope.websiteRequired = true;
			$scope.bookRequired = false;
			$scope.newRecipe.bookTitle = '';
			$scope.newRecipe.bookPageNumber = '';

		} else if ($scope.newRecipe.location === 'Book'){
			$scope.bookRequired = true;
			$scope.websiteRequired = false;
			$scope.newRecipe.recipeUrl = '';
		} else if($scope.newRecipe.location === 'Personal'){
			$scope.websiteRequired =false;
			$scope.bookRequired = false; 
		}
		console.log("check requirement", $scope.websiteRequired + ' ' + $scope.bookRequired)
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
		
		}
		$scope.newRecipe.ingredients = newIngArr;

		var arr2 = $scope.newRecipe.instructions
		console.log(arr2)
		var instArr = []
		for(var j = 0; j < arr2.length; j++){
			if(Object.keys(arr2[j]).length >= 2){
				instArr.push(arr2[j])
			}		
		}
		$scope.newRecipe.instructions = instArr;
		//console.log($scope.newRecipe);
		recipeService.addNewRecipe($scope.newRecipe, user._id)
		.then(function(res){
			$scope.newRecipe = ''
			$location.path('/home/' + $scope.person)
		})
		
	}


});