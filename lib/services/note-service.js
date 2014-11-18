"use strict"

var Promise = require('bluebird');
var Recipe = require('../models/recipeModel');
var User = require('../models/userModel.js');
var Note = require('../models/noteModel.js');

Promise.promisifyAll(Recipe);
Promise.promisifyAll(Recipe.prototype);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
Promise.promisifyAll(Note);
Promise.promisifyAll(Note.prototype);

module.exports.addNote = function(note){
	return new Note(note).saveAsync();
}

module.exports.editNote = function(noteid, note){
	return Note.findByIdAndUpdateAsync(noteid, note);
}

