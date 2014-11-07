var app = angular.module('RecipeBoxApp');

app.service('searchService', function($http, $q){
	var domainName = 'cooknookcollection.com';
	this.search = function(searchText, userid){
		console.log('service has search text ', searchText)
		console.log('userid ', userid)
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://' + domainName +'/api/' + userid + '/search/' + searchText
		}).then(function(recipes){

			deferred.resolve(recipes);
		})
		return deferred.promise
	}

	this.searchLocation = function(searchText, userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://' + domainName +'/api/' + userid + '/searchLocation/' + searchText
		}).then(function(recipes){
			deferred.resolve(recipes);
		})
		return deferred.promise;
	}

	this.searchAuthor = function(searchText, userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://' + domainName + '/api/' + userid + '/searchAuthor/' + searchText
		}).then(function(recipes){
			deferred.resolve(recipes);
		})
		return deferred.promise;
	}

	this.searchRecipeName = function(searchText, userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'http://' + domainName + '/api/' + userid + '/searchRecipeName/' + searchText
		}).then(function(recipes){
			deferred.resolve(recipes);
		})
		return deferred.promise;
	}
})