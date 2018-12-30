var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');

// restrict index for logged in user only
router.get("/",function(req,res){    
    res.render('index', { user : req.user });
});


// route to register page
router.get("/register",function(req,res){    
    res.render('register');
});

// route for register action
router.post("/register",function(req,res){    
    User.register(new User({ 
        username : req.body.username, 
        name: req.body.name 
    }), req.body.password, function(err, user) {
        if (err) {       
            return res.render('register', {info: "Username already exists or is not an email. Please try again."});
        }
    
        passport.authenticate('local')(req, res, function () {
            res.redirect('/register');
        });
    });    
});

// route to login page
router.get("/login",function(req,res){    
    res.render('login', {error : req.flash('error')});
});

// route for login action
router.post("/login",
    passport.authenticate('local', { 
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
        failureFlash : { type: 'error', message: 'Error logging in' }        
    })
);


// route for logout action
router.get("/logout",function(req,res){    
    req.logout();
    res.redirect('/');
});

// route for update action
router.get('/update',    
    require('connect-ensure-login').ensureLoggedIn('/login'), // Checks if user is logged in, else redirect to login
    function(req, res) {
        res.render('update',  { user : req.user }
    )}
);

module.exports = router;