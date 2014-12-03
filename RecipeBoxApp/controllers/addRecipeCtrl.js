var app = angular.module("RecipeBoxApp");

app.controller('addRecipeCtrl', function($scope, recipeService, $cookieStore, $location, $routeParams){
	
	$scope.tabChange('addRecipe');
	//get the user's info
	$scope.getUsername();
	var user = $cookieStore.get('user');
	$scope.person = user.userName;
	//console.log('the user ',$scope.person)

	$scope.recipeNameUsed = false;
	$scope.newRecipe = {
		ingredients: [{},{},{},{},{},{}],   //why do I have to specify?  What will happen when I submit 3 ingredients instead of the max?
		instructions:[{},{},{},{},{},{}],
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
		//console.log("check requirement", $scope.websiteRequired + ' ' + $scope.bookRequired)
	}


	$scope.submitRecipe = function(){
		//for now I don't think I want hand typed recipes to go public . . . a lot of issues if people grab recipes from other sources
		//and then the server automatically generates a colleciton for Alton Brown, A. Brown, a. brown, etc.
		// if($scope.newRecipe.location === "Personal"){
		// 	$scope.newRecipe.permissionsTag = user._id;
		// } else {
		// 	$scope.newRecipe.permissionsTag = "shared"
		// }

		if($scope.newRecipe.recipeImage === ''){
			$scope.newRecipe.recipeImage = "../images/default.png"
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

		if($scope.newRecipe.location === 'Website'){
			$scope.newRecipe.instructions = [];
			$scope.newRecipe.instructions.push("<a href='" + $scope.newRecipe.recipeUrl + "'> Link to original directions!</a>")
		} else {
			var arr2 = $scope.newRecipe.instructions
			//console.log(arr2)
			var instArr = []
			for(var j = 0; j < arr2.length; j++){
				if(Object.keys(arr2[j]).length >= 2){
					instArr.push(arr2[j])
				}		
			}
			$scope.newRecipe.instructions = instArr;
		}



		$scope.newRecipe.permissionsTag = user._id;
		//console.log($scope.newRecipe);
		recipeService.addNewRecipe($scope.newRecipe, user._id)
		.then(function(res){
			if(res.data === "You already have this recipe. :)"){
				//alert("You've already used this name, please use a different name for your recipe.")
				$scope.recipeNameUsed = true;
			} else {
				$scope.newRecipe = ''
				$location.path('/home/' + $scope.person)
			}
			
		})
		
	}


});