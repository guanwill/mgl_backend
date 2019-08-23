const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const gameSchema = require('./Game');

// Ensure username is in email format
const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

let UserSchema = new Schema({
    username: {    
        type: String,
        trim: true,
        unique: true,
        required: 'Email address is required',
        dropDups: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    name: String,
    password: String,    
    phone: Number,
    address: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    // games: [{ type: Schema.Types.ObjectId, ref: 'Game' }], // user can have an array of games
    games: [{ type: Schema.ObjectId, ref: 'Game', index: true, unique: true, dropDups: true, index: {unique: true, dropDups: true} }],
    verified: {type: Boolean, default: false},
    verification_token: String,
    verification_token_created_at: Date
});

// db.UserSchema.index({ _id: 1, games._id: 1 }, { unique:true, sparse:true })
UserSchema.index({games: 1}, {unique: true, dropDups: true});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);

module.exports = User
    
