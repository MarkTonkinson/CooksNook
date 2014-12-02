var SearchService = require('../services/searchService');
var Recipe = require('../models/recipeModel');
var User = require('../models/userModel.js');
//issue pushing an array is that searching it at the same time is difficult when it looks at each of the keys . . 
//tried it with else if statements, and && and || statements, in all cases I started getting nothing and repeats . . 





//query for all ings and push them to array and loop through array and pick out recipes






// module.exports.getByIngredient = function(req, res){
// 	var searchTerms = req.params.searchText 
// 	var userid = req.params.user
// 	console.log("searchTerm in ctrl ", searchTerms)
// 	console.log("user in ctrl ", userid)

// 	User.findOne({facebookId: userid}, function(err, user){
// 		if(err){
// 			console.log('err in getting user for search recipes', err);
// 		} else {
// 			var arr = user.recipes
// 			Recipe.find({
// 				_id : {$in : arr} 
// 			}, function(err, recipes){
// 				if(err){
// 					console.log("couldn't find ing ", err)
// 				} else {
// 					var search = searchTerms.toLowerCase().split(' ');
// 					var toSend = []
// 					var measarr= []
// 					var qtyarr = []
// 					var ingarr = []
// 					for(var i = 0; i < recipes.length; i++){
// 						var arr = recipes[i].ingredients
					
// 							var flag = true;
// 					}
// 					for(var i =0; i < objArr.length; i++){
// 				   		for(var key in objArr[i]){
// 				      		if(key === "meas"){
// 				      			measarr.push(objArr[i][key])
// 				      		} else if (key === "ing"){
// 				      			var newA = objArr[i][key].split(' ');
// 				      			for(var j = 0; j < newA.length; j++){
// 				      				ingarr.push(newA[i]);
// 				      			}
				      			
// 				      		} else if (key === "qty"){
// 				      			qtyarr.push(objArr[i][key])
// 				      		}
// 				   		}
// 					}
// 	console.log(qtyarr);
// 	console.log(measarr);
// 	console.log(ingarr);
					
					
				
// 				res.status(200).send(toSend);
// 			}
// 		})	
// 	}
// })
// }




module.exports.getByIngredient = function(req, res){
	var searchTerms = req.params.searchText 
	var userid = req.params.user
	console.log("searchTerm in ctrl ", searchTerms)
	console.log("user in ctrl ", userid)

	User.findOne({facebookId: userid}, function(err, user){
		if(err){
			console.log('err in getting user for search recipes', err);
		} else {
			var arr = user.recipes
			Recipe.find({
				_id : {$in : arr} 
			}, function(err, recipes){
				if(err){
					console.log("couldn't find ing ", err)
				} else {
					var search = searchTerms.toLowerCase().split(' ');
					var toSend = []
					for(var i = 0; i < recipes.length; i++){
						var arr = recipes[i].ingredients
							var flag = true;
						for(var j=0; j < arr.length; j++){
							
							
							for(var key in arr[j]){
								var cleanKey = arr[j][key].replace(',','').replace('(','').replace(')','').toLowerCase().split(' ')
								
								if(cleanKey.indexOf(search[0]) > -1){
									toSend.push(recipes[i]);
									flag = false; //the flag stops it from running through the same recipe again if it has a match


								}
							
							}
							if(flag === false){
								break;	

						}
					}
					
					
				}
				res.status(200).send(toSend);
			}
		})	
	}
})
}


module.exports.getByLocation = function(req, res){
	var a = req.params.searchText;//working on getting this to lowercase
	var searchTerm = a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(); //You can change it here, or on the search terms, I just changed it above
	var userid = req.params.user

	User.findOne({facebookId: userid}, function(err, user){
		if(err){
			console.log(err);
		} else {
			var arr = user.recipes;
			Recipe.find({
				_id : {$in : arr} 
			}, function(err, recipes){
				if(err){
					console.log(err);
				} else {
					var toSend = []
					for(var i = 0; i < recipes.length; i++){
						if(recipes[i].location === searchTerm){
							toSend.push(recipes[i]);
						}
					}
					res.status(200).send(toSend)
					
					//start searching recipes with location search term
					//what is the easiest way to do this= can we do it without making it crazy?
				}
			})
		}
	})
}


module.exports.getByAuthor = function(req, res){
	var searchTerm = req.params.searchText;
	var userid = req.params.user

	User.findOne({facebookId: userid}, function(err, user){
		if(err){
			console.log(err);
		} else{
			var arr = user.recipes;
			Recipe.find({
				_id : {$in : arr}
			}, function(err, recipes){
				if(err){
					console.log(err);
				} else {
					var toSend = []
					console.log('ready to find author')
					for(var i = 0; i < recipes.length; i++){
						console.log(recipes[i].author)
						//if null breaks it- need to require author
						if(recipes[i].author.trim().toLowerCase() === searchTerm.trim().toLowerCase()){
							//console.log(recipes[i].author)
							toSend.push(recipes[i]);
						}
					}
					res.status(200).send(toSend);
				}
			})
		}
	})
}

module.exports.getByRecipeName = function(req, res){
	var searchTerm = req.params.searchText;
	var userid = req.params.user;

	User.findOne({facebookId: userid}, function(err, user){
		if(err){
			console.log(user);
		} else {
			var arr = user.recipes;
			Recipe.find({
				_id : {$in : arr}
			}, function(err, recipes){
				if(err){
					console.log(err)
				} else {
					var toSend = []
					for(var i = 0; i < recipes.length; i++){
						if(recipes[i].recipeName.toLowerCase() === searchTerm.toLowerCase()){
							toSend.push(recipes[i]);
						}
					}
					res.status(200).send(toSend)
				}
			})
		}
	})
}


module.exports.getUsers = function(req, res){
	var searchTerm = req.params.searchText;
	var s = searchTerm.split(' ');
	var s1 = new RegExp(s[0], 'i');
	if(s.length > 1){
		var s2 = new RegExp(s[1], 'i')
	}
	
	console.log('s1 ', s1)
	User.find({userName: s1 } , function(err, users1){
		if(err){
			console.log(err)
		} else {
			console.log('users1 ,', users1)
			if(users1.length < 1){
				User.find({userName: s2}), function(err, users2){
					if(err){
						console.log(err)
					} else {
						res.status(200).send(users2);
					} 
				}			
			} else {
				res.status(200).send(users1)
			}
		}
	})
}



