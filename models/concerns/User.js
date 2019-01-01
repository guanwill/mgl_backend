const User = require('../user');

async function updateUser(user_id, name) {
    return new Promise(async function (resolve,reject) {
        var query = {_id: user_id};
        var update = {name: `${name}`};
        var options = {        
            new: true, // Return the document after updates are applied        
            upsert: true, // Create a document if one isn't found. Required for `setDefaultsOnInsert`
            // setDefaultsOnInsert: true
        };

        User.findOneAndUpdate(query, update, options, function (error, doc) {
            if (error) {
                console.log(error)
                reject(new Error('Unable to add/edit user'))
            }
            console.log(doc)
            resolve(doc)
        });
    })    
}

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

module.exports = {
    updateUser,
    populateUser
}

