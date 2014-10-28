var app = angular.module('RecipeBoxApp', ['ngRoute', 'ngCookies']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: '../views/login.html',
		controller: 'indexCtrl'
	})
	.when('/home/:user', {
		templateUrl: '../views/home.html',
		controller: 'homeCtrl',
		resolve: 
			{
			user: function(userService){
				return userService.getFacebookUser();
			}
		}
	})
	.when('/newRecipe/:person', {
		templateUrl: '../views/newrecipe.html',
		controller: 'addRecipeCtrl'
		// resolve: {
		// 	addRecipe: function($route, recipeService){
		// 		recipeService.addRecipe($scope.newRecipe, $route.current.params.user);
		// 	}
		// }
		
	})
	.otherwise({
		redirectTo: '/'
	})
}])