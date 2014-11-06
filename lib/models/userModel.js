"use-strict";
var Mongoose = require('mongoose');


var User = new Mongoose.Schema({
	userName: {type: String},
	facebookId: {type: String},
	accountCreated: {type: Date},
	email: {type: String},
	admin: {type: Boolean, default:false},
	recipes: [ {type: Mongoose.Schema.Types.ObjectId, ref: 'Recipes'} ],
	favorites: [ {type: Mongoose.Schema.Types.ObjectId, ref: 'Recipes'}],
	collections: [ {type: Mongoose.Schema.Types.ObjectId, ref: 'Collections'} ]

})

module.exports = Mongoose.model("User", User);