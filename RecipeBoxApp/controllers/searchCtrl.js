var app = angular.module("RecipeBoxApp");

app.controller("searchCtrl", function($scope, searchService, $cookieStore){
	
	$scope.getUsername();
	var user = $cookieStore.get('user');
		var userid = user.facebookId;

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
})