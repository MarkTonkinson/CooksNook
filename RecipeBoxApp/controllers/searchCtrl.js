var app = angular.module("RecipeBoxApp");

app.controller("searchCtrl", function($scope, searchService, $cookieStore, recipeService){
	
	$scope.getUsername();
	$scope.user = $cookieStore.get('user');
		var userid = $scope.user.facebookId;

	$scope.searchTypes = ["Ingredient", "Type", "Author", "RecipeName"];
	
	$scope.selected = $scope.ingredient;
	$scope.searching = function(){
		if($scope.selected === 'Ingredient'){
			$scope.ingredient = true;
		} else {
			$scope.ingredient = false;
		}

		if($scope.selected ==="Type"){
			$scope.location = true;
		} else {
			$scope.location = false;
		}

		if($scope.selected ==="Author"){
			$scope.author = true;
		} else {
			$scope.author = false;
		}

		if($scope.selected ==="RecipeName"){
			$scope.recipeName = true;
		} else {
			$scope.recipeName = false;
		}
	}

	$scope.search = function(){
		
		searchService.search($scope.searchText, userid)
		.then(function(res){
			var arr = res.data
			// var newArr = []
			// for(var i = 0; i < arr.length; i++){
			// 	newArr.push(arr[i].ingredients)
			// }
			$scope.recipes = res.data;
		})
	}

	$scope.searchLocation = function(){
		searchService.searchLocation($scope.locationSearchText, userid)
		.then(function(res){
			$scope.recipes = res.data
		})
	}
	$scope.checkForBook = function(page){
		console.log('the page', page)
		if(page){
			return true
		} else {
			return false
		}
	}

	$scope.searchAuthor = function(){
		searchService.searchAuthor($scope.authorSearchText, userid)
		.then(function(res){
			$scope.recipes = res.data;
		})
	}

	$scope.searchRecipeName = function(){
		searchService.searchRecipeName($scope.recipeNameSearchText, userid)
		.then(function(res){
			$scope.recipes = res.data;
		})
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