var app = angular.module('RecipeBoxApp');

app.controller('bookmarkletCtrl', function($scope, $cookieStore){
	$scope.getUsername();
	$scope.tabChange('other');
	$scope.user = $cookieStore.get('user');
})