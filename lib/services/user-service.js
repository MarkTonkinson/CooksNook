"use-strict"

var Promise = require('bluebird');
var User = require('../models/userModel.js');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports.findUser = function(userid){
	return User.findByIdAsync(userid);
}

module.exports.changeUser = function(userid, user){
	return User.findByIdAndUpdateAsync(userid, user)
}