var app = angular.module('RecipeBoxApp', ['ngRoute', 'ngCookies']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: '../views/login.html',
		controller: 'indexCtrl'
	})
	.when('/search/:user',{
		templateUrl: '../views/search.html',
		controller: 'searchCtrl'
	})
	.when('/home/:user', {
		templateUrl: '../views/home.html',
		controller: 'homeCtrl',
		resolve: 
			{
			user: function(userService, $route){
				return userService.getFacebookUser($route.current.params.user);
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
	.when('/editRecipe/:person/:recipeid', {
		templateUrl: '../views/editRecipe.html',
		controller: 'editRecipeCtrl',
		resolve: {
			getRecipe: function($route, recipeService){
				return recipeService.getRecipeById($route.current.params.recipeid)
			}
		}

	})
	.when('/recipe/:recipeid', {
		templateUrl: '../views/singlerecipe.html',
		controller: 'singleRecipeCtrl',
		resolve: {
			getRecipeToView: function($route, recipeService){
				return recipeService.getRecipeById($route.current.params.recipeid);
			}
		}
	})
	.otherwise({
		redirectTo: '/'
	})
}])


// app.config(function($httpProvider){
// 	$httpProvider.interceptors.push(function($q, $location){
// 		return {
// 			'responseError': function(rejection){
// 				if(rejection.status === 401){
// 					$location.path('/');
// 				}
// 				return $q.reject(rejection)
// 			}
// 		}
// 	})
// })


