var app = angular.module("RecipeBoxApp");

app.controller('userProfileCtrl', function($scope, userService, recipeService, $cookieStore, searchService, $route){
	
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
			userService.getFriends($scope.getter._id).
			then(function(res){
				$scope.friends = res;
			})

			userService.getFriendRequests($scope.getter._id).
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


	$scope.addFriend = function(friend) {
		if($scope.user.waitingOnFriend.indexOf(friend._id) === -1  && $scope.user.friendRequests.indexOf(friend._id) === -1){
			$scope.user.waitingOnFriend.push(friend._id);
			//else show pending
		}
		if(friend.friendRequests.indexOf($scope.user._id) === -1 && friend.friendRequests.indexOf($scope.user._id) === -1) {
			friend.friendRequests.push($scope.user._id);
		}

		userService.updateFriend(friend)
		.then(function(res){
			$scope.saveUser();
		})
	}

	$scope.approveFriend = function(friend){
		if($scope.user.friends.indexOf(friend._id) === -1){
			$scope.user.friends.push(friend._id);
		}

		if($scope.user.friendRequests.indexOf(friend._id) > -1){
			$scope.user.friendRequests.splice($scope.user.friendRequests.indexOf(friend._id), 1);
		}

		if($scope.user.waitingOnFriend.indexOf(friend._id) > -1){
			$scope.user.waitingOnFriend.splice($scope.user.waitingOnFriend.indexOf(friend._id), 1);
		}
		if(friend.friendRequests.indexOf($scope.user._id) > -1){
			friend.friendRequests.splice(friend.friendRequests.indexOf($scope.user._id), 1);
		}
		if(friend.waitingOnFriend.indexOf($scope.user._id) > -1){
			friend.waitingOnFriend.splice(friend.waitingOnFriend.indexOf($scope.user._id), 1);
		}
		if(friend.friends.indexOf($scope.user._id) === -1){
			friend.friends.push($scope.user._id);
		}
		
		userService.updateFriend(friend)
		.then(function(res){
			$scope.saveUser();
		})
	}

	$scope.reject = function(friend){

		if($scope.user.friendRequests.indexOf(friend._id) > -1){
			$scope.user.friendRequests.splice($scope.user.friendRequests.indexOf(friend._id), 1);
		}

		if($scope.user.waitingOnFriend.indexOf(friend._id) > -1){
			$scope.user.waitingOnFriend.splice($scope.user.waitingOnFriend.indexOf(friend._id), 1);
		}
		if(friend.friendRequests.indexOf($scope.user._id) > -1){
			friend.friendRequests.splice(friend.friendRequests.indexOf($scope.user._id), 1);
		}
		if(friend.waitingOnFriend.indexOf($scope.user._id) > -1){
			friend.waitingOnFriend.splice(friend.waitingOnFriend.indexOf($scope.user._id), 1);
		}

		userService.updateFriend(friend)
		.then(function(res){
			$scope.saveUser();
		})	
	}

	$scope.deleteFriend = function(friend){

	}
});