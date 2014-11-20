var app = angular.module("RecipeBoxApp");

app.controller('userProfileCtrl', function($scope, userService, recipeService, $cookieStore){
	
	$scope.getUsername();
	$scope.getter = $cookieStore.get('user');

	userService.getCollections($scope.getter._id)
	.then(function(res){
		$scope.collections = res;

	})
	
	userService.getUser($scope.getter._id)
	.then(function(res){
		$scope.user = res;
	})
	$scope.saveSpinner = false;
	
	//Todo- have to check that the username is unique? Technically the facebook name could be the same
	//but we don't want them both having the same name.
	$scope.saveUser = function(){
		$scope.saveSpinner = true;
		recipeService.updateUser($scope.user)
		.then(function(res){
			$cookieStore.put("currentUser", res)

			var arr = $scope.collections
			for(var i=0; i < arr.length; i++){
				arr[i].collectionCreator = $scope.user.userName;
			}

			userService.getUserNotes($scope.user._id)
			.then(function(res){
				
				for(var j=0; j < res.length; j++){
					res[j].author = $scope.user.userName;
					userService.editNote(res[j])
					.then(function(res){
						
					})
				}
				
				$scope.saveSpinner = false;
			})
		})
		

	}


});