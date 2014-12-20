var User = require('../models/userModel.js');
var Recipe = require('../models/recipeModel.js');
var Collection = require('../models/collectionModel.js');
var UserService = require('../services/user-service.js')

module.exports.getUsers = function(req, res){
	User.find(function(err, users){
		res.status(200).send(users)
	})
}

module.exports.getUser = function(req, res){
	userid = req.params.userid;
	
	UserService.findUser(userid)
	.then(function(user){
		res.status(200).send(user)
	})
}

module.exports.updateUser = function(req, res){
	userid = req.params.userid;
	delete req.body._id
	var user = req.body
	console.log('user to update, ', user)
	UserService.changeUser(userid, user).
	then(function(user){
		res.status(200).send(user)
	})
}