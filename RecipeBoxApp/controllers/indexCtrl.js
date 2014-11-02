var app = angular.module('RecipeBoxApp');

app.controller('indexCtrl', function($scope, $cookieStore, userService, $location){
	
	$scope.getUsername = function(){
		$scope.username = $cookieStore.get('user');
	}
	
	//TODO: why is this running several times?
	//the scope must be getting recreated several times
	$scope.showLogin = function(){
		if($scope.username){
			return false
		} else if ($location.$$path === '/'){
			console.log('what is the path', $location.$$path)
			return false
		} else {
			return true
		}
	}
	$scope.showLogout = function(){
		if($scope.username){
			return true
		} else {
			return false
		}
	}
	
	$scope.logout = function(){
		$cookieStore.remove('user');
	}	
})