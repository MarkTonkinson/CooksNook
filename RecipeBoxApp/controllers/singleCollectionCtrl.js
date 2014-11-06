var app = angular.module('RecipeBoxApp');

app.controller('singleCollectionCtrl', function($scope, getCollection, getCollectionRecipes, recipeService, $cookieStore, userService, $route, $location){

$scope.getUsername();

$scope.user = $cookieStore.get('user')


$scope.collection = getCollection;
console.log($scope.collection)

$scope.recipes = getCollectionRecipes;
//this saves us long enough to use it

	$scope.checkPermissions = function(permish){
		if($scope.user.admin === true){
			return true
		} else if($scope.collection.tag === 'Public'){
			return false
		} else if ($scope.collection.tag === $scope.user._id){
			return true
		} else {
			return false
		}
	}

	$scope.checkCollection = function(addornot, recipeid){
		if(addornot === 'spliceValue'){
			$scope.collection.recipes.splice($scope.collection.recipes.indexOf(recipeid), 1);
		} else if (addornot === 'dontDelete') {
			$scope.collection.recipes.push(recipeid);
		
		} 
	}

	$scope.verifyDelete = function(){
		$scope.verify = !$scope.verify;
	}
	$scope.deleteCollection = function(){
		userService.deleteUserCollection($scope.collection._id, $scope.user._id)
		.then(function(res){
			$location.path('/collections/' + $scope.user.displayName);
		})

	}

	$scope.updateCollection = function(){

		userService.updateCollection($scope.collection, $scope.user._id)
		.then(function(res){
			$route.reload(); //so much simpler than everything i tried- unfortunately it means an extra server request

		})
	}



})