"use strict";

var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//passport oauth functions
var GOOGLE_CLIENT_ID      = "135624701974-0mrqtjudtqtdnkonjvlsf78gdl3mlfh0.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET  = "ZpjZ1OnWEb55SPaaKUilQGI0";
passport.serializeUser(function(user, done) {  
    done(null, user);
});

passport.deserializeUser(function(id, done) {  
	done(null, obj);
});


passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://yourdormain:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    });
  }
));



app.get('/auth/google', passport.authenticate('google',  
    { scope: ['https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'] }),
    function(req, res){} // this never gets called
);

app.get('/oauth2callback', passport.authenticate('google',  
    { successRedirect: '/', failureRedirect: '/login' }
));

function ensureAuthenticated(req, res, next) {  
    if (req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
}

app.get('/createWorkout',  
    ensureAuthenticated,
    function(req, res) {
        res.json({ message: 'Hooray! welcome to our api!' });
    }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});

// error handler
app.use(function(err, req, res, next) {
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});