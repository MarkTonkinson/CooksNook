var UserService = require('../services/user-service.js')
var User = require('../models/userModel.js');


module.exports.getFriends = function(req, res){
	var userid = req.params.userid;
	
	UserService.findUser(userid)
	.then(function(user){
		var arr = user.friends;
		User.find({
			'_id' : { $in: arr}
		
		}, function(err, users){
			if(err){
				console.log(err)
			} else {
				res.status(200).send(users)
			}
		})
	}).catch(function(err){
		console.log(err)
	})
}


module.exports.getFriendRequests = function(req, res){
	var userid = req.params.userid;
	
	UserService.findUser(userid)
	.then(function(user){
		var arr = user.friendRequests;
		User.find({
			'_id' : { $in: arr}
		
		}, function(err, users){
			if(err){
				console.log(err)
			} else {
				res.status(200).send(users)
			}
		})
	}).catch(function(err){
		console.log(err)
	})
}