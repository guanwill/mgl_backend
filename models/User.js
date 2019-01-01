const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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
    address: [{ type: Schema.Types.ObjectId, ref: 'Address' }]
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);

module.exports = User
    
