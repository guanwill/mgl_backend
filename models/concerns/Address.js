const Address = require('../address');
const User = require('../user');

async function updateAddress(
    user_id,
    billing_address_1,
    billing_address_2,      
    billing_state,
    billing_postcode,
    billing_country,                        
    shipping_address_1,
    shipping_address_2,
    shipping_state,
    shipping_postcode,
    shipping_country
) {
    return new Promise(async function (resolve,reject) {

        const query = {user: user_id};
        let update = {
            shipping_address_1: `${shipping_address_1}`,
            shipping_address_2: `${shipping_address_2}`,
            shipping_postcode: `${shipping_postcode}`,
            shipping_state: `${shipping_state}`,
            shipping_country: `${shipping_country}`,
            billing_address_1: `${billing_address_1}`,
            billing_address_2: `${billing_address_2}`,
            billing_postcode: `${billing_postcode}`,
            billing_state: `${billing_state}`,
            billing_country: `${billing_country}`,
        };
        let options = {        
            new: true, // Return the document after updates are applied        
            upsert: true, // Create a document if one isn't found. Required for `setDefaultsOnInsert`
        };

        await Address.findOneAndUpdate(query, update, options, function (error, doc) {
            if (error) {
                console.log(error)
                reject(new Error('Unable to add/edit address'))
            }            
            resolve(doc);
        });
    })    
}

module.exports = {
    updateAddress
}
