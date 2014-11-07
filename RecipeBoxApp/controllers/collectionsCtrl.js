var app = angular.module('RecipeBoxApp');

app.controller('collectionsCtrl', function($scope, recipeService, $cookieStore, userService){

	$scope.getUsername();

	$scope.user = $cookieStore.get('user')

	$scope.getCollections = function(){
		userService.getCollections($scope.user._id)
		.then(function(res){
			console.log(res)
			$scope.collections = res;
		})
	}
	$scope.getCollections();

	$scope.createCollection = function(){
		$scope.newCollection = {
			collectionName: $scope.collectionName,
			collectionCreator: $scope.user.userName,
			tag: $scope.user._id	
		}

		userService.saveCollection($scope.newCollection, $scope.user._id)
		.then(function(res){
			$scope.getCollections();
		})


	}




})