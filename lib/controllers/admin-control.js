var User = require('../models/userModel.js');
var Recipe = require('../models/recipeModel.js');
var Collection = require('../models/collectionModel.js');

module.exports.getUsers = function(req, res){
	User.find(function(err, users){
		res.status(200).send(users)
	})
}