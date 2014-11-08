var Express = require('express');
var BodyParser = require('body-parser');
var Session = require('express-session');
var Passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var mongoUri = 'mongodb://localhost:27017/RecipeBox'
var Cors = require('cors');

Mongoose.connect(mongoUri);
var connection = Mongoose.connection;
connection.once('open', function(){
	console.log('mongo listening on ' + mongoUri);
})
global.mongooseConnection = connection;
// var port = 3000;
// var domainName = 'localhost:3000'

var port = 80;
var domainName = 'cooknookcollection.com'


////Models

var User = require('./lib/models/userModel.js');
var Recipe = require('./lib/models/recipeModel.js');

var RecipeController = require('./lib/controllers/recipe-control');
var SearchController = require('./lib/controllers/search-control');
var CollectionController = require('./lib/controllers/collection-control')
var app = Express();

app.use(Cors());
app.use(Express.static(__dirname + '/RecipeBoxApp'));
app.use(Session ({secret: "@ll l0s secr3t0s"}));
app.use(BodyParser.json());
app.use(Passport.initialize());
app.use(Passport.session());


//will this solve CORS issue?  possibly, i seem to remember talking about this




//middleware

// var authenticateUser = function(req, res, next){
//   Passport.authenticate('FacebookStrategy', function(err, user, info){
    
//     if(!user){
//       return res.status(401).end(); //401 authentication failed
//     } else {
//       return res.status(200).end();
//     }

//   })
//   next();
// }

// var requireAuth = function(req, res, next){
//   if(!req.isAuthenticated()){
//     res.status(401).json({success: false});
//   } else {
//     next();
//   }
  
// }



// *****************Facebook Authorization **************************

Passport.serializeUser(function(user, done) {
  //console.log('serializing', user)
  done(null, user);
});

Passport.deserializeUser(function(user, done) {
  //console.log('deserializing ', user)
  done(null, user);
});


var user = {};
Passport.use(new FacebookStrategy({
  clientID: '969410863074076',
  clientSecret: '61ed2b60d034d46303d14a65fad562f9',
  callbackURL: 'http://' + domainName + '/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  //console.log('PROFILE', profile)
  user = profile;
  return done(null, profile);
}));


app.get('/auth/facebook', Passport.authenticate('facebook'));


app.get('/auth/facebook/callback', Passport.authenticate('facebook', {
  //successRedirect: '/me',
  failureRedirect: '/auth/facebook'
}), function(req, res){
  //console.log(user);
  res.redirect('/#/home/' + user.displayName)
});

app.get('/me', function(req, res){
    //console.log('REQ.USER ', req.user)
    User.find({'facebookId': req.user.id}).exec(function(err, users){
        //console.log(users, err)
        if(users.length > 0){
          res.status(200).send(users[0]);
          
        } else {
      new User({
        userName: req.user._json.name,
        facebookId: req.user.id,
        accountCreated: req.user._json.updated_time
      }).save(function(err, user){
        console.log('user 2', user)
        if(err){
          console.log("couldn't save newFB user", err);
        } else {
          res.status(200).send(user); //this should be sending back the data after it is saved- test later
         
        }  
      })
    }
  });
})

app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
});


// ****************** Recipe Routes ************************

app.get('/recipes', RecipeController.get);
app.get('/api/get/recipe/:recipeid', RecipeController.getById);
app.get('/api/user/recipes/:userid', RecipeController.getByUser);
//can use this over and over again . . .hopefully I didn't break it all  . . 
app.put('/api/user/update/:userid', RecipeController.updateUser);


app.put('/api/update/recipes/:recipeid', RecipeController.put);
app.post('/recipes/:userid', RecipeController.postExternal);
//app.post('/recipes/internal/:userid', RecipeController.postInternal);
app.delete('/api/:userid/recipe/:recipeid', RecipeController.deleteReceta); //can't use word delet(key word)
app.put('/api/update/user/:userid', RecipeController.editUser)

//**********************COLLECTION ROUTES*****************************
//these are better written routes
//the singular connection makes all the difference
app.get('/api/collection/:collectionid', CollectionController.getCollection);
app.delete('/api/collections/:collectionid/:userid', CollectionController.removeUserCollection);
app.get('/api/collections/:userid', CollectionController.getUserCollections);
app.post('/api/collections/:userid', CollectionController.postUserCollection);
app.put('/api/collections/:userid', CollectionController.editUserCollection)
app.get('/api/publicCollections', CollectionController.getPublicCollections);
app.get('/api/recipesInCollection/:collectionid', CollectionController.getRecipesInCollection);
  //may not need this route
app.post('/api/publicCollections', CollectionController.postPublicCollections);



//**********************SEARCH ROUTES*****************************

app.get('/api/:user/search/:searchText', SearchController.getByIngredient);
app.get('/api/:user/searchLocation/:searchText', SearchController.getByLocation);
app.get('/api/:user/searchAuthor/:searchText', SearchController.getByAuthor)
app.get('/api/:user/searchRecipeName/:searchText', SearchController.getByRecipeName)

// app.listen(process.env.myport || 3000)


// .bash_profile
// editing text files on command line can be tricky

// sudo nano 
// ~/.bash_profile

// export is kind of like saying var
// export Express_Port = 80
// press ctrl x to save and then it will ask if you want to save


app.listen(port, function(){
	console.log("listening on " + port)
})




