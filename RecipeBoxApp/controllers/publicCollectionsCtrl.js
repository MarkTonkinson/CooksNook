var app = angular.module('RecipeBoxApp');

app.controller('publicCollectionsCtrl', function($scope, $route, getPublicCollections, userService, recipeService){
	$scope.getUsername();
	$scope.collections = getPublicCollections;
})