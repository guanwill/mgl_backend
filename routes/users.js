var express = require('express');
var passport = require("passport");
var router = express.Router();
var auth = require("../controllers/AuthController.js");

// restrict index for logged in user only
// router.get('/', auth.home);
router.get("/",function(req,res){    
    res.render('index', { user : req.user });
});


// route to register page
// router.get('/register', auth.register);
router.get("/register",function(req,res){    
    res.render('index', { user : req.user });
});

// route for register action
// router.post('/register', auth.doRegister);
router.post("/register",function(req,res){    
    User.register(new User({ 
        username : req.body.username, 
        name: req.body.name 
    }), req.body.password, function(err, user) {
        if (err) {       
            return res.render('register', {info: "Username already exists or is not an email. Please try again."});
        }
    
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });    
});

// route to login page
// router.get('/login', auth.login);
router.get("/login",function(req,res){    
    res.render('login', {error : req.flash('error')});
});

// route for login action
// router.post('/login', auth.doLogin);
router.post('/login',
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : { type: 'error', message: 'Error logging in' }        
    })
);


// route for logout action
// router.get('/logout', auth.logout);
router.get("/logout",function(req,res){    
    req.logout();
    res.redirect('/');
});

// route for update action
// router.get('/update', auth.update);
router.get("/update",function(req,res){    
    res.render('update',  { user : req.user })    
});

module.exports = router;