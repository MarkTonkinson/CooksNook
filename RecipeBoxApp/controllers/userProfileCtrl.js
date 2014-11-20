var app = angular.module("RecipeBoxApp");

app.controller('userProfileCtrl', function($scope, userService, $cookieStore){
	
	$scope.getUsername();
	$scope.getter = $cookieStore.get('user');

	userService.getCollections($scope.getter._id)
	.then(function(res){
		$scope.collections = res;
		
	})
	
	userService.getUser($scope.getter._id)
	.then(function(res){
		$scope.user = res;
	})




});