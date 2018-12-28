var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var AddressSchema = new Schema({
    user_id: Number,
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
});

AddressSchema.plugin(passportLocalMongoose);

// Convert schema to model
module.exports = mongoose.model('Address', AddressSchema);