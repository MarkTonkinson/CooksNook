"use-strict";

var RecipeService = require('../services/recipeService');
var CollectionService = require('../services/collection-service');
var User = require('../models/userModel.js');
var Recipe = require('../models/recipeModel.js')
var Collection = require('../models/collectionModel.js')

module.exports.get = function(req, res){
	RecipeService.getAllRecipes()
	.then(function(recipes){
		res.status(200).json(recipes)
	}).catch(function(err){
		res.status(500).json(err);
	})
}

module.exports.getById = function(req, res){
	//console.log('the id in mongoos', req.params.recipeid)

	RecipeService.getRecipeById(req.params.recipeid)
	.then(function(recipe){
		//console.log('the recipe we are getting', recipe)
		res.status(200).json(recipe);
	}).catch(function(err){
		res.status(404).send();
	})
}

module.exports.editUser = function(req, res){
	userid = req.params.userid;
	updatedUser = req.body;
	RecipeService.changeUser(userid, user)
	.then(function(user){
		res.status(200).send()
	}).catch(function(err){
		console.log('err changing user ', user)
	})
}

module.exports.getByUser = function(req, res){
	var id = req.params.userid;
	console.log("id of user ", id)
	


	User.findOne({facebookId: id} , function(err, user){
		if(err){
			console.log('err1', err);
			res.status(500).send();
		} else {
			var arr = user.recipes
			Recipe.find({
				'_id' : { $in: arr }
			}, function(err, recipes){
				if(err){
					console.log(err);
				} else {
					res.status(200).send(recipes)
				}
			}) 
			
		}
		 
	})

}

// //The way this is set up, users recipes won't be saved to recipe database . . .which is a problem
// module.exports.postInternal = function(req, res){
// 	var uId = req.params.userid;
// 	var newRecipe = req.body
// 	User.findOne({_id : uId} ,function(err, user){
// 			if(err){
// 				console.log(err);
// 			} else{
// 				var names = []
// 				for(var i = 0; i < user.recipes.length; i++){
// 					names.push(user.recipes[i].recipeName);
// 				}
// 				if(names.indexOf(newRecipe.recipeName) === -1){
// 					RecipeService.addRecipe(newRecipe).then(function(recipe){
// 						user.recipes.addToSet(recipe[0]._id);
// 						user.save(function(err){
// 							if(err){
// 								console.log(err)
// 							} else {
// 								res.status(200).send(recipe._id)
// 							}
// 						})
// 					}).catch(function(err){
// 						console.log(err);
// 					})
					
// 				} else {
// 					res.status(200).send("Recipe Here Already")
// 				}
// 			}
// 		})
// }

//everyone is using this app.post- TODO- remove post external
module.exports.postExternal = function(req, res){

	var uId = req.params.userid;
	var flag1 = false;
	var flag2 = false;
	console.log('pause here')
	var newRecipe = req.body;
	if(newRecipe.author.trim() === "THE PIONEER WOMAN"){
		newRecipe.author = "Pioneer Woman";
	}
	

	//call this at proper time- the save recipe time
	var authorCollection = function(recipeid){

		if(newRecipe.permissionsTag === "shared"){
			
			console.log('first step to author, ', newRecipe.author);
			CollectionService.findAuthorCollection(newRecipe.author.trim())
			.then(function(authorCollection){
				console.log('are we really still getting null ', authorCollection)
				if(authorCollection === null){
					var newcollection = {
						collectionName: 'Recipes from ' + newRecipe.author.trim(),
						collectionCreator : newRecipe.author.trim(),
						tag: 'Public',
						recipes: [recipeid]
					}
					CollectionService.savePublicCollection(newcollection)
					.then(function(newcollectionreturned){
						//don't send back collection in future
						console.log(newcollectionreturned);
					}).catch(function(err){
						console.log(err);
					})
				} else {
					//console.log('this is the authorcollection ', authorCollection)
					authorCollection.recipes.addToSet(recipeid);
					authorCollection.save(function(err, collecion){
						if(err){
							console.log(err)
						} else {
							console.log('collecion ', collecion);
						}
					});
					// console.log('is it updated ', authorCollection)
					// CollectionService.findToEdit(authorCollection._id, authorCollection)
					// .then(function(authorCollection2){
					// 	console.log('authorcollection2 confirmation? ', authorcollection2);
					// }).catch(function(err){
					// 	console.log(err);
					// })
				}

			}).catch(function(err){
				console.log(err);
			})
		} 
	}

	var addRecipeToUserOnly = function(recipeid){

		
		RecipeService.saveToUserRecipes(uId).then(function(user){
			var rId = recipeid;
			console.log("four ", rId)
			console.log('user.recipes ', user.recipes)
			if(user.recipes.indexOf(rId) === -1){
				console.log('the index of ', user.recipes.indexOf(rId))
				user.recipes.addToSet(rId);
				user.save(function(err){
					console.log('what is err!! ', err)
					if(err){
						console.log('saving rec to user ', err)
					} else {
						return res.status(200).send(newRecipe.recipeName + ' was successfully added to ' + user.userName + 's recipe book');
					}
				})
			} else if (user.recipes.indexOf(rId) !== -1){
				console.log("made it to else if")
				return res.status(200).send("You already have this recipe. :)")
			}
		}).catch(function(err){
			console.log("this error", err)
			//res.send("Please try again when the page finishes loading.")
		})
	}

	var saveRecipe = function(){
		console.log('came to save')
		RecipeService.addRecipe(newRecipe)
		.then(function(recipe){
			console.log('recipe returned in save recipe', recipe[0])
			authorCollection(recipe[0]._id);
			return addRecipeToUserOnly(recipe[0]._id);
		}).catch(function(err){
			console.log("or this err,", err);
		})
	}


	var checkAuthor = function(){
		console.log('two')
		RecipeService.checkAuthor(newRecipe.author)
		.then(function(author){
			if(!author.length){
				console.log('the author doesnt have any recipes yet')
				saveRecipe();
			} else {
				//if they do have recipes
				for(var i = 0; i < author.length; i++){
					if(author[i].recipeName === newRecipe.recipeName){
						console.log('author i recipe name', author[i].recipeName + ' and ' + newRecipe.recipeName)
						flag2 = true;
						return addRecipeToUserOnly(author[i]._id)
						break;
					} 
					
				}
				//console.log('outside the loop now')
				return saveRecipe();
				//console.log(author)
			}
		}).catch(function(err){
			console.log(err)
		})
	}
	

	
	RecipeService.checkRecipeName(newRecipe.recipeName).then(function(recipenamed){
		console.log('name')
		//console.log('recipenamed = ', recipenamed)
		if(!recipenamed.length){
			console.log('none existed by same name')
			return saveRecipe();
		} else {
			flag1 = true;
			return checkAuthor();
		}
	}).catch(function(err){
		console.log(err)
	})
		
	
}


	


module.exports.updateUser = function(req, res){
	var userid = req.body._id;
	var user = req.body;
	delete user._id;
	console.log("user ", user);
	RecipeService.updateUser(userid, user)
	.then(function(userUpdated){
		console.log("do we get whole user back ", user)
		userUpdated.save()
		res.status(200).send(userUpdated);
	}).catch(function(err){
		console.log(err)
	})
}

module.exports.put = function(req, res){
	var recipeId = req.params.recipeid;
	//console.log("made it to editing landia with ", recipeId + ' and ' + req.body)
	if(!recipeId){
		console.log("error")
		res.status(404).send();
	} else {
		RecipeService.updateRecipe(recipeId, req.body)
		.then(function(recipe){
			res.status(200).send();
		}).catch(function(err){
			res.status(500).send();
			console.log('problem saving recipe: ', err)
		})
	}
}

module.exports.deleteReceta = function(req, res){
	var rId = req.params.recipeid;
	var uId = req.params.userid;
	

	User.findOne({facebookId:uId} ,function(err, user){

		var sendStatus = function(){
			res.status(200).send();
		}

		if(err){
			console.log('error finding user to delet recipe', err);
		} else{

			if (user.recipes.indexOf(rId !== -1)){
				var index = user.recipes.indexOf(rId);
				user.recipes.splice(index, 1);
				user.save();
				console.log("it is done", user.recipes)
			} else {
				console.log('that recipe already gone')
			}

			if(user.admin === true){
				hardDelete();
			} else {
				sendStatus();
			}
		}
	})

	var hardDelete = function(){
		RecipeService.deleteRecipe(rId)
		.then(function(recipe){  //this bit is necessary because otherwise we remove the recipe from the recipes, but not from the individual user
			
			res.status(200).send();
		}).catch(function(err){
			res.status(500).send();
			console.log('err deleting recipe ', err)
		})
	}

}








