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

// route to update page
router.get('/update',    
    require('connect-ensure-login').ensureLoggedIn('/login'), // Checks if user is logged in, else redirect to login
    async function(req, res) {
        let user = await userConcerns.populateUser(req.user._id)
        res.render('update',  { user : user, message: req.flash('message') })
    }
);

// route for update action
router.post('/update',
    require('connect-ensure-login').ensureLoggedIn('/login'),
    async function(req, res) {
        console.log(req.user);
        console.log(req.body);

        // Update address
        await addressConcerns.updateAddress(
            req.body.user_id,
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
        res.redirect('/update')
    }
);

// route to update user page
router.get('/update_user',    
    require('connect-ensure-login').ensureLoggedIn('/login'), // Checks if user is logged in, else redirect to login
    async function(req, res) {
        let user = await userConcerns.populateUser(req.user._id) 
        res.render('personal',  { user : user, message: req.flash('message') })
    }
);

// route for update user action
router.post('/update_user',
    require('connect-ensure-login').ensureLoggedIn('/login'),
    async function(req, res) {
        console.log(req.user);
        console.log(req.body);
        
        // Update user
        await userConcerns.updateUser(req.body.user_id, req.body.name);    
        req.flash('message', 'User updated!')
        res.redirect('/update_user')
    }
);

module.exports = router;