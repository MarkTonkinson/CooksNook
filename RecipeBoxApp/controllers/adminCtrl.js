var app = angular.module('RecipeBoxApp');

app.controller('adminCtrl', function($scope, recipeService, userService, adminService, $cookieStore, $location){

	$scope.getUsername()
	$scope.user = $cookieStore.get('user');
	if($scope.user.userName !== 'Mark Tonkinson'){
		$location.path('/')
	}
	$scope.findRecipe = function(){
		recipeService.getRecipeById($scope.searchid).
		then(function(res){
			$scope.recipe = res;
		})
	}

	$scope.updateRecipe = function(recipeid, recipe){
		recipeService.editRecipe(recipeid, recipe);
	}

	var getPublicCollections = function(){
		userService.getPublicCollections()
		.then(function(res){
			$scope.collections = res;
		})
	}
	getPublicCollections();

	$scope.addToRecipes = function(collection, id){
		if(collection.recipes.indexOf(id)=== -1){
			collection.recipes.push(id)
		} else {
			console.log("this recipe already here")
		}
		
	}

	$scope.saveCollection =function(collection){
		userService.updateCollection(collection, $scope.user._id)
	}

	$scope.deleteCollection = function(collectionid){
		userService.deletePublicCollection(collectionid);
	}

	$scope.findUser = function(userid){
		adminService.getUser(userid)
		.then(function(res){
			$scope.editUser = res;
		})
	}

	$scope.getUsers = function(){
		adminService.getUsers().then(function(res){
			$scope.users = res;
			console.log("USERS, ", res)
		})
		
	}

	$scope.updateUser = function(){
		adminService.updateUser($scope.editUser)
		.then(function(res){
			$scope.editUser = ''
		})	
	}
	$scope.getUsers();
})