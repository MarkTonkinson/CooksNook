var app = angular.module('RecipeBoxApp');

app.service('userService', function($http, $q, $cookieStore){
	this.getFacebookUser = function(){
		if($cookieStore.get('user')){
			//console.log('we already did this');  //if they are already here, we don't need to do this resolve over again- it will get undefined
		} else {
			var deferred = $q.defer();
			$http ({
				method: 'GET',
				url: 'http://localhost:3000/me'
			}).then(function(res){
				var fbUser = res.data;
				$cookieStore.put('user', fbUser);
				console.log(res.data)
				return deferred.resolve(fbUser);
			})
			return deferred.promise;
		}
	}
	// this.softRemove = function(userid, user){

	// 	var deferred = $q.defer();
	// 		$http ({
	// 			method: 'GET',
	// 			url: 'http://localhost:3000/me'
	// 		}).then(function(res){
	// 			var fbUser = res.data;
	// 			$cookieStore.put('user', fbUser);
	// 			deferred.resolve(fbUser);
	// 		})
	// 		return deferred.promise;
	// }

})