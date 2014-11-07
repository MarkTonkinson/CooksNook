
(function(){
	

	
	if(document.location.href.indexOf('localhost') !== -1){
		return
	}
	// the minimum version of jQuery we want
	var v = "2.1.1";

	// check prior inclusion and version
	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var done = false;
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				initMyBookmarklet();
			}
		};
		//tried changing to body instead of head based on stack overflow recommendation that it would run before the body finished . . 
		document.getElementsByTagName("body")[0].appendChild(script);
	} else {
		initMyBookmarklet();
	}
	
	function initMyBookmarklet() {
		(window.myBookmarklet = function() {
			//recipe constructor for all websites
			var domainName = 'cooknookcollection.com'
			//var domainName='localhost:3000'
			var getLocal = function() {
				
				var uId = localStorage.getItem('local');
				return JSON.parse(uId);
			}
			

			var Recipe = function(author, recipeName, recipeImage, location, recipeUrl, recipeImage, ingredients, yield, permissionsTag, instructions){
				this.author = author,
				this.recipeName = recipeName,
				this.recipeImage = recipeImage,
				this.location = location,
				this.recipeUrl = recipeUrl,
				this.recipeImage = recipeImage,
				this.ingredients = ingredients,
				this.yield = yield,
				this.permissionsTag = permissionsTag
				this.instructions = instructions
			}

			//Constructor for the ingredient - need to create ingredients array with 3 object properties
			var Ingredient = function(qty, meas, ing){
				this.qty = qty,
				this.meas = meas,
				this.ing = ing
			}
			//this always applies to the constructor and is not assigned by the site
			var finalRecipe;
			var location = "Website"
			var permissionsTag = "shared"
			var recipeUrl = document.location.href;
			var host = document.location.host //the host name for allrecipes.com is 'allrecipes.com'
			//always push to this empty array :) from within- DRY
			var ingredients = [];
			var instructions = [];
			instructions.push("<a href='" + recipeUrl + "'> Link to original directions!</a>")

			//console.log('locale, ' + document.location)
			//console.log('title, ' + document.title)
			var postRecipe = function(finalRecipe){
				var user = getLocal();
				console.log(user);
				$.ajax({
					datatype: "json",
					contentType: "application/json; charset=utf-8",	
					type: 'POST',
					url: 'http://' + domainName + '/recipes/' + user,
					data: JSON.stringify(finalRecipe),
					success : function(result){
						alert(result);
					}
				})
			}
			


			//This is all for allrecipes.com - write an if statment to encapsulate it
			var getRecipeFromAllRecipes = function(){
				var recipeImage = document.getElementById('imgPhoto').src;
				console.log(recipeImage)

				var yield = document.getElementById('lblYield').innerHTML;
				//console.log("recipe yield: " + yield);


				var recipeName = document.getElementById('itemTitle').innerHTML;
				//console.log("recipeName is: " + recipeName)
				
				//I can get the individual submitter, but it would mess up the collections
				//var author = document.getElementById('lblSubmitter').innerText;
				//console.log(author)
				var author = "Allrecipes";


				var ings = document.getElementsByClassName("ingredient-name")
				var amounts = document.getElementsByClassName("ingredient-amount")
				for(var i = 0; i < amounts.length; i++){

					//this splits the amounts into two pieces
					var arr = amounts[i].innerText.split(' ');
					//You have to run these tests for weird situations- slow cooker pork had 1 (4 pound)
					var joinRest = function(qtyMeas){
						var qty = [];
						var meas = []
						for (var j=0; j < qtyMeas.length; j++){
								
							
							if(isNaN(parseInt(qtyMeas[j]))){
								meas.push(qtyMeas[j]);
								//console.log("what is a number " + qtyMeas[j])
							} else {
								qty.push(qtyMeas[j])
							}
						}

						arr[0] = qty.join(' ');
						arr[1] = meas.join(' ')//.replace('(', '').replace(')',''); - can do this to remove parens, but I actually think they help
						//arr.slice(1).join(' ');
						//console.log('the arr ' + arr)
					}
					joinRest(arr);
					var ingObj = new Ingredient(arr[0], arr[1], ings[i].innerText);
					ingredients.push(ingObj);
				};

				//console.log("ingredients array ",  ingredients);

				var finalRecipe = new Recipe(author, recipeName, recipeImage, location, recipeUrl, recipeImage, ingredients, yield, permissionsTag, instructions);
				postRecipe(finalRecipe);
			}

			// ************PIONEER WOMAN RECIPE ********************
			var getPioneerWomanRecipe = function(){
				var author = "Pioneer Woman";
				var recipeName = document.getElementsByClassName('post-title')[0].innerText;
				var recipeImage = document.getElementsByClassName('frame-img')[0].currentSrc;
				var arrayYieldText = document.getElementsByClassName('recipe-data')[0].innerText.split(' ');
				var servingsIndex =  arrayYieldText.indexOf('Servings:')
				
				var ingsLiArr = document.getElementsByClassName('recipe-sub-head')[0].nextSibling.nextElementSibling.childNodes;
				
				
				for(var i = 0; i < ingsLiArr.length; i++){
					var wholeIng = ingsLiArr[i].innerText.split(' ');
					qty = wholeIng[0];
					meas = wholeIng[1];
					ing = wholeIng.slice(2).join(' ');
					var ingredient = new Ingredient(qty, meas, ing);
					ingredients.push(ingredient)

				}
				
				var yield = arrayYieldText[servingsIndex] + ' ' + arrayYieldText[servingsIndex+1];
				
				
				
				finalRecipe = new Recipe(author, recipeName, recipeImage, location, recipeUrl, recipeImage, ingredients, yield, permissionsTag, instructions);
				postRecipe(finalRecipe);
			}


			//***************GET SKINNY TASTE RECIPE***********************
			//not using right now because it is broken
			var getSkinnyTasteRecipe = function(){
				var author = 'Skinny Taste';
				var recipeName = document.getElementsByClassName('post-title')[0].innerText;
				var recipeImage = 'none';
				//SkinnyTaste wants people to get permission to user her text and pictures . .. i wonder if that includes recipes . .. 
				var recipeImgArr = document.getElementsByTagName('img');
				//The main images title attribute is same as recipe name- it is usually within the first 20 elements- but I put 50 to be safe - and it still didn't work for other pages
				// for(var i = 0; i < 50; i++){
				// 	if(recipeImgArr[i].title === recipeName){
				// 		recipeImage = recipeImgArr[i].src;
				// 		break;
				// 	}
				// }

				//Skinny Taste only has their ingredients in a list- hopefully it is always the first list . . .
				var ingsList = document.getElementsByClassName('post-body')[0].getElementsByTagName('li');
				console.log(ingsList)
				for(var j = 0; j < ingsList.length; j++){
					var wholeIng = ingsList[j].innerText.split(' ');
					qty = wholeIng[0];
					meas = wholeIng[1];
					ing = wholeIng.slice(2).join(' '); //copy after index two
					var ingredient = new Ingredient(qty, meas, ing);
					ingredients.push(ingredient)

				}
				
				var yield = "See Recipe"

				var finalRecipe = new Recipe(author, recipeName, recipeImage, location, recipeUrl, recipeImage, ingredients, yield, permissionsTag, instructions);
				postRecipe(finalRecipe);
			}

			//***************YUMMLY**************************
			var getYummlyRecipe = function(){

				recipeUrl = document.location.href
				//console.log(recipeUrl[0].split(' '))
				
				// if(recipeUrl[0].split(' ').indexOf('external') === -1){
				// 	alert("Cook's Nook- Please return to Yummly's profile for this recipe to collect the information.")
				// 	//this stops the function from continuing to run.
				// 	return "finished"
				// }

				var n = recipeUrl.indexOf('?');
				recipeUrl = recipeUrl.substring(0, n != -1 ? n : s.length);
				

				var author = document.getElementsByClassName('source-name')[0].innerText.replace('From', '');
				
				var recipeName = document.getElementsByClassName('primary')[1].getElementsByTagName('h1')[0].innerText;
				var recipeImage = document.getElementsByClassName('image')[1].getElementsByTagName('img')[0].currentSrc;
				//console.log(recipeImage)
				//console.log(recipeName)
				var ings = document.getElementsByClassName("ingredient");

				//console.log(ings);

				for(var i = 0; i < ings.length; i++){
					var wholeIng = ings[i].innerText.split(' ');
					qty = wholeIng[0];
					meas = wholeIng[1];
					ing = wholeIng.slice(2).join(' ').replace('? Tasty tip', ''); //copy after index two
					var ingredient = new Ingredient(qty, meas, ing);
					ingredients.push(ingredient)

				}
				//console.log("ingredients array ",  ingredients);
				var yield = document.getElementsByClassName('yield')[0].innerText;

				var finalRecipe = new Recipe(author, recipeName, recipeImage, location, recipeUrl, recipeImage, ingredients, yield, permissionsTag, instructions);
				//console.log(finalRecipe);
				postRecipe(finalRecipe);
			}


			//**********************************DON'T WRITE BELOW HERE!*************************************
			///NEEDS TO BE AT BOTTOM SO THAT THE GET RECIPE FUNCTIONS ARE DEFINED - else it tries to find it and it doesn't exist!
			var checkDomain = function(host){
				if(host === 'allrecipes.com'){
					getRecipeFromAllRecipes();
				} else if(host === 'thepioneerwoman.com'){
					getPioneerWomanRecipe();
				// } else if(host === 'www.skinnytaste.com'){
				// 	getSkinnyTasteRecipe();
				// 	alert("Cook's Nook- make sure you verify that SkinnyTaste recipes come out right.  Email us if there are errors.")
				} else if(host === 'www.yummly.com'){
					getYummlyRecipe();
				} else {
					alert("Cook's Nook: Sorry, we can't get a recipe from this site :(")
				}
			}
			checkDomain(host);
			//TODO: REMOVE HARDCODED USER VALUE
			
			

			//experiment :)
			// var p = document.createElement("p");
			// var text = document.createTextNode("hello there, thanks for using me")
			// p.appendChild(text)
			// document.getElementsByTagName("body")[0].appendChild(p)



		})();
	}

})();



				//this is cool jquery to look into again
				//var str = $( "p:last" ).text();