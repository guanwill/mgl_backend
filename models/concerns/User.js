const User = require('../user');
const nodemailer = require('nodemailer');

// update username and new password if available
async function updateUser(user_id, name, password) {
    return new Promise(async function (resolve,reject) {
        var query = {_id: user_id};
        var update = {name: `${name}`};
        var options = {        
            new: true, // Return the document after updates are applied        
            upsert: true, // Create a document if one isn't found. Required for `setDefaultsOnInsert`
            // setDefaultsOnInsert: true
        };

        User.findOneAndUpdate(query, update, options, async function (error, doc) {
            if (error) {
                console.log(error)
                reject(new Error('Unable to add/edit user'))
            }
            console.log(doc)
            if (password != "") {
                await updatePassword(user_id, password);                
            }
            resolve(doc)
        });
    })    
}

// get user with address details
async function populateUser(user_id) {
    return new Promise(async function (resolve,reject) {
        User.findOne({_id: user_id })
        .populate('address') // only works if we pushed refs to children
        .exec(function (err, user) {
            if (err) return handleError(err);
            console.log(user);
            resolve(user)
        });
    })
}

// send user reset pw link
async function sendResetPasswordEmail(username) {
    return new Promise(async function (resolve,reject) {
        let token = require('crypto').randomBytes(64).toString('hex');
        let token_created_at = new Date();
        console.log(token);

        var query = {username: username};
        var update = {
            token: token,
            token_created_at: token_created_at
        };
        var options = {        
            new: true, // Return the document after updates are applied        
            upsert: false, // Create a document if one isn't found. Required for `setDefaultsOnInsert`            
        };

        User.findOneAndUpdate(query, update, options, function (error, doc) {
            if (error) {
                console.log(error)
                reject(new Error('Unable to add/edit token'))
            }
            console.log(doc)

            if (doc != null) {
                sendEmail(username, token)
            }
            resolve(doc)
        });
    })    
}

async function sendEmail(username, token) {
    let transporter = nodemailer.createTransport({
        // settings for fakesmtp for dev testing
        host: '127.0.0.1',
        port: 10000,
        secure: false // true for 465, false for other ports
    });

    let mailOptions = {
        replyTo: `no-reply@addi.com.au`,
        from: `no-reply@addi.com.au`, // sender address
        to: `${username}`, // list of receivers
        subject: `ADDi - Reset Password`, // Subject line
        text: `Visit this link to reset password: http://localhost:3000/reset_password/${token}`, // plain text body
        html: `Visit this link to reset password: http://localhost:3000/reset_password/${token}`, // html body        
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error: "+error);
        } else {
            console.log('Message sent: %s', info.messageId);
        }            
    });
}

// find user using reset pw token to reset pw
async function findUserByToken(token) {
    return new Promise(async function (resolve,reject) {
        await User.find({token: token}, function (err, doc) {
            if (err) { return err } 
            else { resolve(doc) }
        });        
    })
}

// to reset pw from forgotten pw
async function setNewPassword(token, newPassword) {
    return new Promise(async function (resolve,reject) {
        await User.find({token: token}, async function (err, user) {
            if (err) { return err } 
            else { 
                await user[0].setPassword(newPassword);
                await user[0].save();
                resolve();
            }
        });        
    })
}

// to update pw from acc settings
async function updatePassword(user_id, password) {
    return new Promise(async function (resolve,reject) {
        await User.find({_id: user_id}, async function (err, user) {
            if (err) { return err } 
            else { 
                await user[0].setPassword(password);
                await user[0].save();
                resolve();
            }
        });        
    })
}


module.exports = {
    updateUser,
    populateUser,
    sendResetPasswordEmail,
    findUserByToken,
    setNewPassword
}

