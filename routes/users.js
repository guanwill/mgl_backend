const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const userConcerns = require('../models/concerns/User');
const Address = require('../models/address');
const addressConcerns = require('../models/concerns/Address');

// restrict index for logged in user only
router.get("/", async function(req,res){
    let user;
    if (req.user) {
        user = await userConcerns.populateUser(req.user._id)
    }    
    res.render('index', { user : user });
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
    
        // passport.authenticate is authenticating a request when a user 1st submits a login form,but for subsequent routes this shouldn't need to be the case
        passport.authenticate('local')(req, res, function () {
            console.log(req.user)

            // After creating user, create its associated address doc
            let userAddress = new Address({user: req.user._id});            
            userAddress.save(function (err) {if (err) return handleError(err);});
            user.address.push(userAddress); // Push this address doc into that user for relational purposes
            user.save();

            res.redirect('/');
        });
    });    
});

// route to login page
router.get("/login",function(req,res){    
    res.render('login', {error : req.flash('error'), message: req.flash('message')});
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

// route to update page
router.get('/update/:id',    
    require('connect-ensure-login').ensureLoggedIn('/login'), // Checks if user is logged in, else redirect to login
    async function(req, res) {
        let user = await userConcerns.populateUser(req.params.id)
        res.render('update',  { user : user, message: req.flash('message') })
    }
);

// route for update action
router.post('/update/:id',
    require('connect-ensure-login').ensureLoggedIn('/login'),
    async function(req, res) {
        console.log(req.body);

        // Update address
        await addressConcerns.updateAddress(
            req.params.id,
            req.body.billing_address_1,
            req.body.billing_address_2,      
            req.body.billing_state,
            parseInt(req.body.billing_postcode),
            req.body.billing_country,                        
            req.body.shipping_address_1,
            req.body.shipping_address_2,
            req.body.shipping_state,
            parseInt(req.body.shipping_postcode),
            req.body.shipping_country
        );
        req.flash('message', 'Address updated!')
        res.redirect('/update/' + req.params.id)
    }
);

// route to update user page
router.get('/update_user/:id',    
    require('connect-ensure-login').ensureLoggedIn('/login'), // Checks if user is logged in, else redirect to login
    async function(req, res) {
        let user = await userConcerns.populateUser(req.params.id) 
        res.render('personal',  { user : user, message: req.flash('message') })
    }
);

// route for update user action
router.post('/update_user/:id',
    require('connect-ensure-login').ensureLoggedIn('/login'),
    async function(req, res) {
        console.log(req.body);
        
        // Update user
        await userConcerns.updateUser(req.params.id, req.body.name);    
        req.flash('message', 'User updated!')
        res.redirect('/update_user/' + req.params.id)
    }
);

// route for forgot pw page
router.get("/forgot_password", async function(req,res){
    res.render('forgot_password', {error: req.flash('error'), message: req.flash('message')});
});

// route for forgot pw action
router.post("/forgot_password", async function(req,res){
    let doc = await userConcerns.sendResetPasswordEmail(req.body.username)
    if (doc != null) {
        req.flash('message', 'Email sent!')
    } else {
        req.flash('error', 'Email does not exist in our system!')
    }
    
    res.redirect('/forgot_password')
});

// // route for reset pw page
router.get("/reset_password/:token", async function(req,res){
    let token = req.params.token
    let user = await userConcerns.findUserByToken(token);
    if (new Date().setHours(0, 0, 0, 0) - user[0].token_created_at.setHours(0, 0, 0, 0) > 2) { // Compare dates without worrying about time elements
        req.flash('message', 'Link expired! Send new link to email')
        res.redirect('/forgot_password')
    } else {
        res.render('reset_password', {token: token});
    }
});

// // route for reset pw action
router.post("/reset_password/:token", async function(req,res){  
    let token = req.params.token
    let newPassword = req.body.password;
    let user = await userConcerns.setNewPassword(token, newPassword);
    req.flash('message', 'Password updated!')
    res.redirect('/login')
});

module.exports = router;