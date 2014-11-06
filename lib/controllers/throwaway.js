
//Recipe COntrol

module.exports.post = function(req, res){


	var uId = req.params.userid;
	console.log('user id ',uId)
	var newRecipe = req.body;

	
	RecipeService.addRecipe(newRecipe function(err, recipe){
		 console.log('control1')
		if(err){
			 console.log('control2')
			console.log('err1 ', err)
		} else if (recipe === false){
			 console.log('control3')
			console.log('should send a message here')
			res.send("This recipe has already been added.")
		} else {
			User.findById(uId, function(err, user){
				 console.log('control4')
				if(err){
					 console.log('control5')
					console.log('err2 ', err)
					//res.status(200).send"This recipe has already been added");
				} else {
					 console.log('control5')
					console.log('the user ', user)
		
					user.recipes.addToSet(recipe);
					user.save(function(err){
						 console.log('control6')
						if(err){
							 console.log('control7')
							console.log('err3 ', err)
						} else {
							 console.log('control8')
							console.log(user);
							res.status(200).send(recipe.recipeName + ' was successfully added to ' + user.userName + 's recipe book');
						}
					});	
				}
			})
		}
	});
}





/////RECIPE SERVICE**************************
module.exports.addRecipe = function(recipe, cb){
	var recipe = recipe;
	//the checks are for making sure the recipe doesn't already exist
	var checkflag1 = false;
	var checkflag2 = false;
	//but what if a user doesn't have it yet?
	var theRecipeId;

	var checkAuthor = function(recipe){
		console.log('first recipe, ', recipe.author)
		Recipe.find({author : recipe.author} , function(err, recipeauthored){
			console.log('service 5')
		//	console.log('the recipes author, ', recipeauthored) //when it isn't several recipes it only has one . . .
		
			if(err){
				console.log('service 6')
				console.log(err)
			} else if(recipeauthored === null){
				console.log('service 7')
				createNew(recipe);
			} else {
				console.log('service 7.2')
				console.log(recipeauthored)
				if(Array.isArray(recipeauthored)){
					for(var j = 0; j < recipeauthored.length; j++){
						console.log(7.3);
						if(recipeauthored[j]._id === theRecipeId){
							console.log('service 8');
							checkflag2 = true;
							createNew(recipe);
							
							
						} else {
							console.log('service 9')
							checkflag2 = false;
							createNew(recipe);
						}
					}
				} else {
					console.log('weird place 1', recipeauthored._id)
					console.log(theRecipeId)
					if(recipeauthored._id === theRecipeId){
						console.log('wierd place 2');
						checkflag2 = true;
						createNew(recipe);
					}
				}
				
			}
		})
	}

	var createNew = function(recipe){
		console.log('service 9.2')
		//console.log('thirdly, are we still passing in? ', recipe)
		if(checkflag1 === true && checkflag2 === true){
			//console.log('Recipe id, ', theRecipeId) //it's finding my first sweet potato fries
			console.log('service 10')
			User.findOne({recipes: theRecipeId}, function(err, recipe){
				//console.log("did we find it ", recipe)
				if(err){
					console.log(err)
					console.log('service 11')

				} else if(recipe === null){
					console.log('service 12')
					return cb(null, recipe)
				} else {
					//This flag is to send back in place of the recipe, so it doesn't get added again.
					console.log('service 13');
					var a = false
					return cb(null, a)
				}
			})

		} else {
			newRecipe = new Recipe(recipe);
			newRecipe.save(function(err){
				if(err){
					console.log('service 14')
					return cb(err, null);
				} else {
					console.log('service 15')
					return cb(null, newRecipe);
				}
			})
		}
	}
	Recipe.findOne({recipeName : recipe.recipeName}, function(err, recipenamed){
		console.log('service 1')
		if(err){
			console.log('service 2')
			console.log(err)
			createNew(recipe);
		} else if(recipenamed === null){
			console.log('service 3')
			createNew(recipe);
		} else {
			console.log('service 4')
			checkflag1 = true
			theRecipeId = recipenamed._id;
			checkAuthor(recipe);
		}
	})

}
