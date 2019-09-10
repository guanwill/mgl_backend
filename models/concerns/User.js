const User = require('../User');
const nodemailer = require('nodemailer');

// get user details
async function findUser(user_id) {
    const user = await User.findOne({ _id: user_id })
    if (user) return user;
    throw new Error('User not found');
}

// check user. current user cannot perform actions on/for another user
async function validateUserActions(target_user_id, current_user_id) {
    if (target_user_id !== current_user_id) {
        throw new Error('You do not have permission to perform this action');
    }
}

// get user and user's games
async function populateUserGames(user_id) {
    const user = await User.findOne({ _id: user_id }).populate('games');
    if (user) return user;
    throw new Error('User not found');
}

// update name, username and new password if available
async function updateUser(user_id, name, password) {
    let query = { _id: user_id };
    let update = { name: `${name}` };
    let options = {
        new: true, // Return the document after updates are applied        
        upsert: true, // Create a document if one isn't found. Required for `setDefaultsOnInsert`
        // setDefaultsOnInsert: true
    };

    User.findOneAndUpdate(query, update, options, async function (error, doc) {
        if (error) {
            console.log(error)
            return new Error('Unable to add/edit user')
        }
        console.log(doc)
        if (password != "") {
            await updatePassword(user_id, password);
        }
        return doc
    });
}

async function sendTempPassword(username) {
    let tempPassword = require('crypto').randomBytes(64).toString('hex').substring(0, 10);

    await User.findOne({ username: username }, async function (err, user) {
        if (err) {
            return err
        }
        else {
            await user.setPassword(tempPassword);
            await user.save();

            let subject = `MGL - Temp Password`;
            let message = `Your temp password is: ${tempPassword}`;
            return await sendEmail(username, subject, message)
        }
    });
}

async function sendEmail(username, subject, message) {
    let transporter = nodemailer.createTransport({
        // settings for fakesmtp for dev testing
        host: '127.0.0.1',
        port: 10000,
        secure: false // true for 465, false for other ports
    });

    let mailOptions = {
        replyTo: `no-reply@mgl.com.au`,
        from: `no-reply@mgl.com.au`, // sender address
        to: `${username}`, // list of receivers
        subject: `${subject}`, // Subject line
        text: `${message}`, // plain text body
        html: `${message}`, // html body        
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error: " + error);
        } else {
            console.log('Message sent: %s', info.messageId);
        }
    });
}

// to update pw from acc settings
async function updatePassword(user_id, password) {
    await User.findOne({ _id: user_id }, async function (err, user) {
        if (err) { return err }
        else {
            await user[0].setPassword(password);
            await user[0].save();
            return
        }
    });
}

// send registration email verification
async function sendVerificationEmail(username) {
    let verification_token = require('crypto').randomBytes(64).toString('hex');
    let verification_token_created_at = new Date();

    let query = { username: username };
    let update = {
        verification_token: verification_token,
        verification_token_created_at: verification_token_created_at
    };
    let options = {
        new: true, // Return the document after updates are applied        
        upsert: false, // Create a document if one isn't found. Required for `setDefaultsOnInsert`            
    };

    User.findOneAndUpdate(query, update, options, function (error, doc) {
        if (error) {
            console.log(error)
            return new Error('Unable to add/edit verification token')
        }
        console.log(doc)

        if (doc != null) {
            let subject = `MGL - Verify Account`
            // todo: the following link needs to be updated to react page which should hit the verify account endpoint
            let message = `Visit this link to verify account: http://localhost:3000/verify/${verification_token}`
            sendEmail(username, subject, message)
        }
        return doc
    });
}

// find user using verification token
async function findUserByVerificationToken(verification_token) {
    await User.findOne({ verification_token: verification_token }, function (err, doc) {
        if (err) { return err }
        else { return doc }
    });
}

async function verifyUser(verification_token) {
    // find user and check if verification token is expired
    let user = await findUserByVerificationToken(verification_token);
    if (new Date().setHours(0, 0, 0, 0) - user[0].verification_token_created_at.setHours(0, 0, 0, 0) > 2) {
        return 'expired'
    }

    // else verify user
    let query = { verification_token: verification_token };
    let update = {
        verified: true
    };
    let options = {
        new: true, // Return the document after updates are applied        
        upsert: false, // Create a document if one isn't found. Required for `setDefaultsOnInsert`            
    };

    User.findOneAndUpdate(query, update, options, function (error, doc) {
        if (error) {
            console.log(error)
            return new Error('Unable to add/edit verification token')
        }
        console.log(doc)
        return doc
    });
}


module.exports = {
    updateUser,
    sendTempPassword,
    sendVerificationEmail,
    findUserByVerificationToken,
    verifyUser,
    populateUserGames,
    findUser,
    validateUserActions
}

