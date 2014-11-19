"use-strict";

var NoteService = require('../services/note-service');
var UserService = require('../services/user-service');
var RecipeService = require('../services/recipeService');
var User = require('../models/userModel.js');
var Recipe = require('../models/recipeModel.js');
var Note = require('../models/noteModel.js');

module.exports.getNotes = function(req, res){
	Note.find(function(err, notes){
		if(err){
			console.log(err);
		} else {
			console.log('notes', notes)
			res.status(200).send(notes);
		}
	})
}

module.exports.addNote = function(req, res){
	console.log('req.body ', req.body)
	var userid = req.params.userid;
	var user;
	var now = new Date()
	req.body.noteDate = now;
	NoteService.addNote(req.body)
	.then(function(note){
		UserService.findUser(userid)
		.then(function(user){
			user.notes.push(note[0]._id);
			user.save(function(err, usersaved){
				if(err){
					console.log(err)
				} else {
					console.log('user saved ,', usersaved)	
				}
			});
			
			RecipeService.getRecipeById(note[0].recipeid)
			.then(function(recipe){
				recipe.notes.push(note[0]._id);
				recipe.save(function(err, recipesaved){
					if(err){
						console.log(err)
					} else {
						console.log('recipe saved, ', recipesaved)
					}
				});
			}).catch(function(err){
				console.log(err)
			})
		}).catch(function(err){
			console.log(err);
		})




		res.status(200).send(note[0])
	}).catch(function(err){
		console.log(err);
	})
}

module.exports.editNote = function(req, res){
	var now = new Date();
	req.body.noteDate = now;
	noteid = req.body._id;
	delete req.body._id;
	NoteService.editNote(noteid, req.body)
	.then(function(note){
		res.status(200).send(note)
	}).catch(function(err){
		console.log(err)
	})
}
