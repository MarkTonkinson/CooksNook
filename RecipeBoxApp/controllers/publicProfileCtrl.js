var app = angular.module("RecipeBoxApp");

app.controller('publicProfileCtrl', function($scope, getFriendProfile, userService, recipeService, $cookieStore, searchService, $route){
	$scope.profile = getFriendProfile;
	$scope.getUsername();


	userService.getCollections($scope.profile._id)
	.then(function(res){
		$scope.collections = res;

	})
	
	userService.getUser($scope.profile._id)
	.then(function(res){
		$scope.user = res;
	})
	$scope.saveSpinner = false;

	userService.getFriends($scope.profile._id).
	then(function(res){
		$scope.friends = res;
	})

	userService.getFriendRequests($scope.profile._id).
	then(function(res){
		$scope.friendRequests = res;
	})
		
	
	//Todo- have to check that the username is unique? Technically the facebook name could be the same
	//but we don't want them both having the same name.
	$scope.saveUser = function(){
		$scope.saveSpinner = true;
		recipeService.updateUser($scope.user)
		.then(function(res){
			//console.log('res ,', res)
			$cookieStore.put("currentUser", res.data)

			var arr = $scope.collections
			for(var i=0; i < arr.length; i++){
				arr[i].collectionCreator = $scope.user.userName;
			}
			//why am I calling notes here?
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
			userService.getFriends($scope.profile._id).
			then(function(res){
				$scope.friends = res;
			})

			userService.getFriendRequests($scope.profile._id).
			then(function(res){
				$scope.friendRequests = res;
			})
		})
		

	}

	$scope.friendSpinner = false;
	$scope.searchFriend = function(){
		$scope.friendSpinner = true;
		console.log($scope.friendSearchTerm)
		searchService.findUsers($scope.friendSearchTerm.toLowerCase())
		.then(function(res){
			$scope.people = res;
			$scope.friendSpinner = false;
		})
	}



	$scope.deleteFriend = function(friend){

	}
});