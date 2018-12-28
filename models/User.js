var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// Ensure username is in email format
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var UserSchema = new Schema({
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

var AddressSchema = new Schema({
    shipping_address_1: String,
    shipping_address_2: String,
    shipping_postcode: Number,
    shipping_state: String,
    shipping_country: String,
    billing_address_1: String,
    billing_address_2: String,
    billing_postcode: Number,
    billing_state: String,
    billing_country: String,
    user: { type: Schema.Types.ObjectId, ref: 'Person' },
});

UserSchema.plugin(passportLocalMongoose);
// Convert schema to model
const Address = mongoose.model('Address', AddressSchema);
module.exports = mongoose.model('User', UserSchema);
