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


module.exports.getAllRecipes = function(){
	return Recipe.findAsync();
}

module.exports.getRecipeById = function(recipeid){
	
	return Recipe.findByIdAsync(recipeid);
}

module.exports.updateUser = function(userid, user){
	console.log('user in updateUser service ', user);

	return User.findByIdAndUpdateAsync(userid, user);
}


module.exports.saveToUserRecipes = function(userid){
	return User.findByIdAsync(userid)
}

module.exports.updateRecipe = function(id, inboundRecipe){
	//console.log("recipe id in service ", id, inboundRecipe)
	if(id){
		return Recipe.findByIdAndUpdateAsync(id, inboundRecipe);
	}
	// } else {
	// 	return new Recipe(inboundRecipe).saveAsync();
	// }
}

module.exports.addRecipe = function(recipe){
	console.log("recipe in service ", recipe)
	return new Recipe(recipe).saveAsync()
}

module.exports.deleteRecipe = function(id){
	return Recipe.findByIdAndRemoveAsync(id);
}

module.exports.changeUser = function(userid, user){
	return User.findByIdAndUpdateAsync(userid, user)
}

module.exports.checkAuthor = function(recipeAuthor){
	return Recipe.findAsync({author: recipeAuthor})
}

module.exports.checkRecipeName = function(nameRecipe){
	return Recipe.findAsync({recipeName: nameRecipe})
}