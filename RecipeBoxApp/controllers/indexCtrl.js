var app = angular.module('RecipeBoxApp');

app.controller('indexCtrl', function($scope, $cookieStore){
	$scope.username = $cookieStore.get('user');
	
})