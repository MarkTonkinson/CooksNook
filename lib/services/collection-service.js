"use-strict"

var Promise = require('bluebird');
var Recipe = require('../models/recipeModel');
var User = require('../models/userModel.js');
var Collection = require('../models/collectionModel.js');

Promise.promisifyAll(Recipe);
Promise.promisifyAll(Recipe.prototype);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
Promise.promisifyAll(Collection);
Promise.promisifyAll(Collection.prototype);



module.exports.getCollection = function(collectionid){
	return Collection.findByIdAsync(collectionid);
}

//may not be able to do findone- may have to find by id and remove
module.exports.removePrivateCollection = function(collectionid){
	return Collection.findByIdAndRemoveAsync(collectionid);
}

//ToDo- make these save private and public the same
module.exports.savePrivateCollection = function(newcollection){
	return new Collection(newcollection).saveAsync();
}

module.exports.savePublicCollection = function(newcollection){
	return new Collection(newcollection).saveAsync();
}

module.exports.findUser = function(userid){
	return User.findByIdAsync(userid);
}

//can use for public and private
module.exports.findToEdit = function(collectionid, collection){
	console.log('in service ', collectionid , collection )
	return Collection.findByIdAndUpdateAsync(collectionid, collection)
}

module.exports.findAuthorCollection = function(authorname){
	return Collection.findOneAsync({collectionCreator : authorname});
}

// module.exports.savePublicCollection = function(){

// }