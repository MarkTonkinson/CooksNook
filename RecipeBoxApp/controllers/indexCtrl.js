var app = angular.module('RecipeBoxApp');

app.controller('indexCtrl', function($scope, $cookieStore, userService, $location){
	

	$scope.getUsername = function(){
		$scope.username = $cookieStore.get('user');
	}

	$scope.loginSpinner = false;

	$scope.showLoginSpinner = function(){
		//console.log('did we make it?')
		$scope.loginSpinner = true;
	}
	//TODO: why is this running several times?
	//the scope must be getting recreated several times
	$scope.showLogin = function(){
		if($scope.username){
			return false
		} else if ($location.$$path === '/'){
			//console.log('what is the path', $location.$$path)
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


	var btab = 'b'
	var selectedTab = 'b selected-tab'
	
	$scope.homeTab = btab
	$scope.searchTab = btab
	$scope.favTab = btab
	$scope.addRecTab = btab
	$scope.privColTab = btab
	$scope.pubColTab = btab
	$scope.userProfileTab = btab

	$scope.tabChange = function(tab){
		
		switch(tab) {
			case 'other':
				$scope.homeTab = btab
				$scope.searchTab = btab
				$scope.favTab = btab
				$scope.addRecTab = btab
				$scope.privColTab = btab
				$scope.pubColTab = btab
				$scope.userProfileTab = btab
				break;

			case 'home':
				$scope.homeTab = selectedTab
				$scope.searchTab = btab
				$scope.favTab = btab
				$scope.addRecTab = btab
				$scope.privColTab = btab
				$scope.pubColTab = btab
				$scope.userProfileTab = btab
				break;
			case 'search':
				$scope.homeTab = btab
				$scope.searchTab = selectedTab
				$scope.favTab = btab
				$scope.addRecTab = btab
				$scope.privColTab = btab
				$scope.pubColTab = btab
				$scope.userProfileTab = btab
				break;
			case 'fav':
				$scope.homeTab = btab
				$scope.searchTab = btab
				$scope.favTab = selectedTab
				$scope.addRecTab = btab
				$scope.privColTab = btab
				$scope.pubColTab = btab
				$scope.userProfileTab = btab
				break;
			case 'addRecipe':
				$scope.homeTab = btab
				$scope.searchTab = btab
				$scope.favTab = btab
				$scope.addRecTab = selectedTab
				$scope.privColTab = btab
				$scope.pubColTab = btab
				$scope.userProfileTab = btab
				break;
			case 'privateCollections':
				$scope.homeTab = btab
				$scope.searchTab = btab
				$scope.favTab = btab
				$scope.addRecTab = btab
				$scope.privColTab = selectedTab
				$scope.pubColTab = btab
				$scope.userProfileTab = btab
				break;
			case 'publicCollections':
				$scope.homeTab = btab
				$scope.searchTab = btab
				$scope.favTab = btab
				$scope.addRecTab = btab
				$scope.privColTab = btab
				$scope.pubColTab = selectedTab
				$scope.userProfileTab = btab
				break;
			case 'userProfile':
				$scope.homeTab = btab
				$scope.searchTab = btab
				$scope.favTab = btab
				$scope.addRecTab = btab
				$scope.privColTab = btab
				$scope.pubColTab = btab
				$scope.userProfileTab = selectedTab
				break;
		}	
		



	}

	

})