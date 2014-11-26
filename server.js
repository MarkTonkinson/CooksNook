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

var port = 3000;
var domainName = 'localhost:3000'

// var port = 80;
// var domainName = 'cooknookcollection.com'


////Models

var User = require('./lib/models/userModel.js');
var Recipe = require('./lib/models/recipeModel.js');

var RecipeController = require('./lib/controllers/recipe-control');
var SearchController = require('./lib/controllers/search-control');
var CollectionController = require('./lib/controllers/collection-control');
var NotesController = require('./lib/controllers/note-control');
var app = Express();

app.use(Cors());
app.use(Express.static(__dirname + '/RecipeBoxApp'));
app.use(Session ({secret: "@ll l0s secr3t0s"}));
app.use(BodyParser.json());
app.use(Passport.initialize());
app.use(Passport.session());

app.set('port', process.env.EXPRESS_PORT || 3000)


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

var requireAuth = function(req, res, next){
  if(!req.isAuthenticated()){
    res.status(401).send("You do not have permission to be here.")
  } else {
    
    next();
  }
  
}



// *****************Facebook Authorization **************************

Passport.serializeUser(function(user, done) {
  //console.log('serializing')
  done(null, user);
});

Passport.deserializeUser(function(user, done) {
  //console.log('deserializing ')
  done(null, user);
});


var user = {};
Passport.use(new FacebookStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: 'http://' + domainName + '/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  console.log('PROFILE', profile)
  user = profile;
  return done(null, profile);
}));


app.get('/auth/facebook', Passport.authenticate('facebook'));


app.get('/auth/facebook/callback', Passport.authenticate('facebook', {
  //successRedirect: '/me',
  failureRedirect: '/auth/facebook'
}), function(req, res){
  
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
app.get('/api/user/:userid', function(req, res){
  var uId = req.params.userid;
  User.findById(uId, function(err, user){
    if(err){
      console.log(err)
    } else {
      res.status(200).send(user);
    }
  })
})

app.get('/recipes', requireAuth, RecipeController.get);
app.get('/api/get/recipe/:recipeid', RecipeController.getById);
app.get('/api/user/recipes/:userid', requireAuth, RecipeController.getByUser);
//can use this over and over again . . .hopefully I didn't break it all  . . 
app.put('/api/user/update/:userid', requireAuth, RecipeController.updateUser);


app.put('/api/update/recipes/:recipeid', requireAuth, RecipeController.put);
app.post('/recipes/:userid', RecipeController.postExternal);
//app.post('/recipes/internal/:userid', RecipeController.postInternal);
app.delete('/api/:userid/recipe/:recipeid', requireAuth, RecipeController.deleteReceta); //can't use word delet(key word)
app.put('/api/update/user/:userid', requireAuth, RecipeController.editUser)

// ****************** Note Routes ************************
app.get('/api/usernotes/:userid', NotesController.getUserNotes);
app.get('/api/recipenotes/:recipeid', NotesController.getRecipeNotes)
app.post('/api/notes/:userid', requireAuth, NotesController.addNote);
app.put('/api/notes/:userid', requireAuth, NotesController.editNote);


//**********************COLLECTION ROUTES*****************************
//these are better written routes
//the singular connection makes all the difference
app.get('/api/collection/:collectionid', requireAuth, CollectionController.getCollection);
app.delete('/api/collections/:collectionid/:userid', requireAuth, CollectionController.removeUserCollection);
app.get('/api/collections/:userid',  CollectionController.getUserCollections);
app.post('/api/collections/:userid', requireAuth, CollectionController.postUserCollection);
app.put('/api/collections/:userid', requireAuth, CollectionController.editUserCollection)
app.get('/api/publicCollections', requireAuth, CollectionController.getPublicCollections);
app.get('/api/recipesInCollection/:collectionid', requireAuth, CollectionController.getRecipesInCollection);
  //may not need this route
app.post('/api/publicCollections', requireAuth, CollectionController.postPublicCollections);



//**********************SEARCH ROUTES*****************************

app.get('/api/:user/search/:searchText', requireAuth, SearchController.getByIngredient);
app.get('/api/:user/searchLocation/:searchText', requireAuth, SearchController.getByLocation);
app.get('/api/:user/searchAuthor/:searchText', requireAuth, SearchController.getByAuthor)
app.get('/api/:user/searchRecipeName/:searchText', requireAuth, SearchController.getByRecipeName)




app.listen(port, function(){
	console.log("listening on " + port)
})




