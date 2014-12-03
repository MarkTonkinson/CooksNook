var app = angular.module("RecipeBoxApp");

app.controller("searchCtrl", function($scope, searchService, $cookieStore, recipeService, userService){
	$scope.searchSpinner = false;
	$scope.searchResultsText = false;
	$scope.getUsername();
	$scope.tabChange('search');
	$scope.user = $cookieStore.get('user');
		var userid = $scope.user.facebookId;

	$scope.searchTypes = ["Ingredient", "Type", "Author", "RecipeName"];
	


	$scope.updateCollection = function(){
		userService.updateCollection($scope.selectedCollection, $scope.user._id)
		.then(function(res){
			$scope.selectedCollection = ''
		})
	}	

	$scope.getCollections = function(){
		userService.getCollections($scope.user._id)
		.then(function(res){
			//console.log(res)
			$scope.collections = res;
			// if($scope.collections.length){
			// 	$scope.existsCollection = true;
			// }
		})
	}

	$scope.getCollections();
	

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

	//am i still using this?  TODO: FIND OUT AND DELETE OTHERWISE
	$scope.search = function(){
		$scope.searchResultsText = false;
		$scope.searchSpinner = true;
		searchService.search($scope.searchText, userid)
		.then(function(res){
			var arr = res.data
			// var newArr = []
			// for(var i = 0; i < arr.length; i++){
			// 	newArr.push(arr[i].ingredients)
			// }
			$scope.recipes = res.data;
			$scope.searchSpinner = false;
			$scope.searchResultsText = true;
		})
	}

	$scope.searchLocation = function(){
		$scope.searchResultsText = false;
		$scope.searchSpinner = true;
		searchService.searchLocation($scope.locationSearchText, userid)
		.then(function(res){
			$scope.recipes = res.data
			$scope.searchSpinner = false;
			$scope.searchResultsText = true;
		})
	}
	$scope.checkForBook = function(page){
		//console.log('the page', page)
		if(page){
			return true
		} else {
			return false
		}
	}

	$scope.searchAuthor = function(){
		$scope.searchResultsText = false;
		$scope.searchSpinner = true;
		searchService.searchAuthor($scope.authorSearchText, userid)
		.then(function(res){
			$scope.recipes = res.data;
			$scope.searchSpinner = false;
			$scope.searchResultsText = true;
		})
	}

	$scope.searchRecipeName = function(){
		$scope.searchResultsText = false;
		$scope.searchSpinner = true;
		searchService.searchRecipeName($scope.recipeNameSearchText, userid)
		.then(function(res){
			$scope.recipes = res.data;
			$scope.searchSpinner = false;
			$scope.searchResultsText = true;
		})
	}

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

		for(var i = 0; i < arr.length; i++){
			if(arr[i] === recipeid){
				arr.splice(i,1)
				break;
			}

		}
		
		var unfavoriteReqBody = {
			_id : $scope.user._id,
			favorites : $scope.user.favorites
		}
		recipeService.updateUser(unfavoriteReqBody)
		.then(function(res){
			$scope.search()
		})
	}

	$scope.removeRecipe = function(recipeId, index){
		//if you remove it from the page, you want to remove it from the collection as well.
		var arr = $scope.collections
		for (var i = 0; i < arr.length; i++){
			if(arr[i].recipes.indexOf(recipeId) > -1){
				arr[i].recipes.splice(arr[i].recipes.indexOf(recipeId), 1)
				$scope.selectedCollection = arr[i];
				$scope.updateCollection()
			}
		}


		recipeService.deleteRecipe(recipeId, $scope.user.facebookId);
		$scope.recipes.splice(index, 1);

	}

})