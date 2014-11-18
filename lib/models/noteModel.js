"use-strict";
var Mongoose = require('mongoose');


var Note = new Mongoose.Schema({
	userid: {type: String},
	recipeid: {type: String},
	noteDate: {type: Date},
	share: {type: String, default: 'private'},
	note: {type: String}

})

module.exports = Mongoose.model("Note", Note);