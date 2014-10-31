var app = angular.module('RecipeBoxApp');

app.controller('singleRecipeCtrl', function($scope, getRecipeToView, recipeService, $cookieStore){
	$scope.getUsername();
	$scope.recipe = getRecipeToView
	$scope.user = $cookieStore.get('user');
	var uId = $scope.user._id
	$scope.checkPermissions = function(permish){
		if(permish === 'shared'){
			return false
		} else if (permish === $scope.user._id){
			return true
		} else {
			return false
		}
	}
})