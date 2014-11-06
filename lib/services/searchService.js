var Promise = require('bluebird');
var Recipe = require('../models/recipeModel');
var User = require('../models/userModel.js');

Promise.promisifyAll(Recipe);
Promise.promisifyAll(Recipe.prototype);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);


module.exports.search = function(searchText, userid){
	return User.findOneAsync({facebookId: userid});
}