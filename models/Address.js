const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AddressSchema = new Schema({
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
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address