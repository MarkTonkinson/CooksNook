var app = angular.module('RecipeBoxApp');

app.controller('indexCtrl', function($scope, $cookieStore, userService){
	
	$scope.getUsername = function(){
		$scope.username = $cookieStore.get('user');
	}
	
	
	
	$scope.logout = function(){
		$cookieStore.remove('user');
	}	
})