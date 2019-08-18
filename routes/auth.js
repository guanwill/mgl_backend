const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const userConcerns = require('../models/concerns/User');
const statusMessages = require('../shared/statusMessages');

// route for register action
router.post("/register", function (req, res) {
    User.register(new User({
        username: req.body.username, // validate email format via fe
        name: req.body.name
    }), req.body.password, function (err, user) {
        if (err) {
            res.status(400).json({ message: statusMessages.invalid_username })
        }

        passport.authenticate('local')(req, res, async function () {
            await user.save();
            await userConcerns.sendVerificationEmail(req.user.username);
            res.status(200).json({ message: statusMessages.user_created_pending_verification })
        });
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: statusMessages.login_failed,
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.json(err);
            }
            if (!user.verified) {
                res.status(200).json({ message: statusMessages.user_created_pending_verification })
            }
            const token = 'secret' // this secret should be from config and more complex
            const accesstoken = jwt.sign(user.toJSON(), token, { expiresIn: '5m' }); // for now, if expire, we redirect to login page. todo: use refreshtoken to get new token   
            res.json({ user, accesstoken });
            res.cookie('token', accesstoken, { httpOnly: true }).sendStatus(200); // saves to browser cookies for frontend to use. FE can redirect after checking status is 200
        });
    })(req, res);
})

// route for forgot pw
router.post("/forgot_password", async function (req, res) {
    let doc = await userConcerns.sendTempPassword(req.body.username)
    if (doc != null) {
        res.status(200).json({ message: statusMessages.temp_password })
    } else {
        res.status(400).json({ message: statusMessages.invalid_email })
    }
});

// route for sending verificaiton email
router.post("/resend_verification_email", async function (req, res) {
    let doc = await userConcerns.sendVerificationEmail(req.body.username)
    if (doc != null) {
        res.status(200).json({ message: statusMessages.verification_email_sent })
    } else {
        res.status(400).json({ message: statusMessages.invalid_email })
    }
});

// route to verify account
router.get("/verify_account/:token", async function (req, res) {
    let verification_token = req.params.token
    let user = await userConcerns.verifyUser(verification_token);
    if (user == 'expired') {
        res.status(200).json({ message: statusMessages.verification_link_expired })
    } else {
        res.status(200).json({ message: statusMessages.account_verified })
    }
});

module.exports = router;