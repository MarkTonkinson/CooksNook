var app = angular.module('RecipeBoxApp');

app.controller('publicCollectionCtrl', function($scope, getCollection, getCollectionRecipes){
	$scope.getUsername();
	$scope.recipes = getCollectionRecipes;
	$scope.collection = getCollection;
})