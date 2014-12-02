var app = angular.module("RecipeBoxApp");

app.controller('userProfileCtrl', function($scope, userService, recipeService, $cookieStore, searchService){
	
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

	userService.getFriends($scope.getter._id).
	then(function(res){
		$scope.friends = res;
	})

	userService.getFriendRequests($scope.getter._id).
	then(function(res){
		$scope.friendRequests = res;
	})
		
	
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

	$scope.addFriend = function(friend) {
		if($scope.user.waitingOnFriend.indexOf(friend._id === -1)  && $scope.user.friendRequests.indexOf(friend._id === -1)){
			$scope.user.waitingOnFriend.push(friend._id);
			//else show pending
		}
		if(friend.friendRequests.indexOf($scope.user._id) === -1){
			friend.friendRequests.push($scope.user._id);
		}

		recipeService.updateUser(friend)
		.then(function(res){
			$scope.saveUser();
		})
	}

});