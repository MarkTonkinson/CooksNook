"use-strict";

var NoteService = require('../services/note-service');
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
	var now = new Date()
	req.body.noteDate = now;
	NoteService.addNote(req.body)
	.then(function(note){
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
