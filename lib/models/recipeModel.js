"use-strict";
var Mongoose = require('mongoose');


var Recipe = new Mongoose.Schema({
	author: {type: String},
	recipeName: {type: String},
	recipeImage: {type:String},
	location: {type: String, enum: ["Website", "Book", "Personal"]},
	recipeUrl: {type: String},
	recipeImage: {type: String},
	bookTitle: {type: String},
	bookPageNumber: {type: String},
	ingredients: [], //apparently defining this one causes issue, at least the way I did it . . . [{type: Object}], [{type: Array}] , [{type: [type: Object, Array, String]}]
	yield: {type: String},
	permissionsTag: {type:String}, //shared or personal
	instructions: [],
	favorite: {type: Boolean},
	course: [{type: String, enum: ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"]}],
	counter: {type: Number}, //how many times you have made this recipe
	alterations: {type: String}, //changes you would make to the recipe
	notes: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Notes'}]
})



module.exports = Mongoose.model('Recipe', Recipe);