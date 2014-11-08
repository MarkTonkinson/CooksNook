"use-strict";

var CollectionService = require('../services/collection-service');
var User = require('../models/userModel.js');
var Recipe = require('../models/recipeModel.js');
var Collection = require('../models/collectionModel.js');

module.exports.getCollection = function(req, res){
	CollectionService.getCollection(req.params.collectionid)
	.then(function(collection){
		res.status(200).send(collection);
	}).catch(function(err){
		console.log(err);
	})
}

module.exports.getUserCollections =function(req, res){
	var userid = req.params.userid
	User.findOne({_id : userid} , function(err, user){
		if(err){
			console.log('err1', err);
			res.status(500).send();
		} else {
			var arr = user.collections
			Collection.find({
				'_id' : { $in: arr }
			}, function(err, collections){
				if(err){
					console.log(err);
				} else {
					res.status(200).send(collections)
				}
			}) 
			
		}
		 
	})
}

module.exports.removeUserCollection = function(req, res){
	var collectionid = req.params.collectionid;
	var userid = req.params.userid
	//you are just updating the user rather than deleting
	//the whole collection in case someone else has it- although 
	//I don't know if users will actually share or just look at someone elses collection
	//that would make more sense
	//but other collections you like could just be a collection of links to the collection page . . .
	//but this current method won't allow for sharing of collections . . .because it really removes it
	CollectionService.getCollection(collectionid)
	.then(function(collection){
			console.log(collection)
		if(collection.tag === req.params.userid){
			CollectionService.removePrivateCollection(collectionid).
			then(function(collection2){
				User.findOne({_id : userid}, function(err, user){
					if(err){
						console.log(err);
					} else {
						var a = user.collections.indexOf(collectionid)
						user.collections.splice(a,1);
						res.status(200).send();
					}	
				})
			}).catch(function(err){
				console.log(err);
			})
		} else {
			res.status(404).send("you can't touch this")
		}

	}).catch(function(err){
		console.log(err)
	})
}

module.exports.getRecipesInCollection = function(req, res){
	//var userid = req.params.userid
	var collectionid = req.params.collectionid

	Collection.findOne({_id : collectionid}, function(err, collection){
		if(err){
			console.log(err)
		} else {
			var arr = collection.recipes;
			Recipe.find({
				_id : { $in: arr}
			}, function(err, recipes){

				if(err){
					console.log(err)
				} else {
					res.status(200).send(recipes)
				}
			})
		}
	})
}


//collection must be created first and then go
module.exports.postUserCollection = function(req, res){
	var userid = req.params.userid
	var newcollection = req.body
	CollectionService.savePrivateCollection(newcollection)
	.then(function(collection){
		CollectionService.findUser(userid)
		.then(function(user){
			user.collections.addToSet(collection[0]._id);
			user.save(function(err){
				if(err){
					console.log(err)
				} else {
					return res.status(200).send()
				}
			})
		}).catch(function(err){
			console.log(err)
		})

	}).catch(function(err){
		console.log('error saving info', err)
	})
}

module.exports.editUserCollection = function(req, res){
	var userid = req.params.userid;
	var editid = req.body._id
	var toEditCollection = req.body;
	delete toEditCollection._id;

	CollectionService.findToEdit(editid, toEditCollection)
	.then(function(collection){
		console.log("edited collection ", collection);
		res.status(200).send(collection)
	}).catch(function(err){
		console.log(err);
	})
}

module.exports.getPublicCollections = function(req, res){
	Collection.find({tag : "Public"}, function(err, collections){
		if(err){
			console.log(err);
		} else {
			res.status(200).send(collections);
		}
	})
}

module.exports.postPublicCollections = function(req, res){

}