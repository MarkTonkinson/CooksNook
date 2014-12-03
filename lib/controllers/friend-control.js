var UserService = require('../services/user-service.js')
var User = require('../models/userModel.js');

module.exports.getFriendProfile = function(req, res){
	var id = req.params.facebookid;
	User.findOne({facebookId: id}, function(err, user){
		if(err){
			console.log(err)
		} else {
			res.status(200).send(user)
		}
	})
}

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


module.exports.updateFriend = function(req, res){
	console.log('params ', req.params)
	console.log('req.body ,', req.body)
	var friendid = req.params.friendid;
	delete req.body._id

	var friend = {
		friends: req.body.friends,
		friendRequests: req.body.friendRequests,
		waitingOnFriend: req.body.waitingOnFriend
	}
	console.log('friend ', friend)
	UserService.changeUser(friendid, friend)
	.then(function(user){
		res.status(200).send('ok')
	}).catch(function(err){
		console.log(err)
	})
}