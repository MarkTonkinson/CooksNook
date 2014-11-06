"use-strict";

var Mongoose = require('mongoose');

var Collection = new Mongoose.Schema({
	collectionName: {type: String},
	collectionCreator: {type: String},
	tag: {type: String}, //private or public
	recipes: [ {type: Mongoose.Schema.Types.ObjectId, ref: 'Recipes'} ],
	//may not need this - if do use this run an if statement when deleting and only delete if no users
	users: [ {type: Mongoose.Schema.Types.ObjectId, ref: 'Users'} ]
})

module.exports = Mongoose.model("Collection", Collection);

//give the collectionCreator the userid of the user so they can have permissions to edit the collection