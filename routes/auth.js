const express = require('express');
const config = require('../config.json')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const moment = require('moment');
const router = express.Router();
const User = require('../models/User');
const userConcerns = require('../models/concerns/User');
const statusMessages = require('../shared/statusMessages');

// route for register action
router.post("/register", function (req, res) {
    User.register(new User({
        username: req.body.username, // validate email format via fe
        name: req.body.name
    }), req.body.password, function (err, user) {
        if (err) {
            console.log('register error: ', err);
            res.json({ message: statusMessages.invalid_username })
        }

        passport.authenticate('local')(req, res, async function () {
            await user.save();
            await userConcerns.sendVerificationEmail(req.user.username);
            res.json({ message: statusMessages.user_created_pending_verification, user: user })
        });
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.json({
                message: statusMessages.login_failed,
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.json({ message: statusMessages.user_created_pending_verification })
            }
            if (!user.verified) {
                return res.json({ message: statusMessages.user_created_pending_verification })
            }
            const token = 'secret' // this secret should be from config and more complex
            const accesstoken = jwt.sign(user.toJSON(), token, { expiresIn: config.access_token_expire_in }); // for now, if expire, we redirect to login page. todo: use refreshtoken to get new token   
            res.json({ user, accesstoken, message: statusMessages.login_success });
        });
    })(req, res);
})

// route for forgot pw
router.post("/forgot_password", async function (req, res) {
    let doc = await userConcerns.sendTempPassword(req.body.username)
    if (doc != null) {
        res.json({ message: statusMessages.temp_password })
    } else {
        res.json({ message: statusMessages.invalid_email })
    }
});

// route for sending verificaiton email
router.post("/resend_verification_email", async function (req, res) {
    let doc = await userConcerns.sendVerificationEmail(req.body.username)
    if (doc != null) {
        res.json({ message: statusMessages.verification_email_sent })
    } else {
        res.json({ message: statusMessages.invalid_email })
    }
});

// route to verify account
router.get("/verify_account/:token", async function (req, res) {
    try {
        let verification_token = req.params.token
        let user = await userConcerns.verifyUser(verification_token);
        if (user == 'not found' || user == 'expired') {
            res.json({ message: statusMessages.verification_link_expired })
        } else {
            res.json({ message: statusMessages.account_verified, user: user })
        }
    } catch (err) {
        res.json({ message: err.message })
    }    
});

module.exports = router;