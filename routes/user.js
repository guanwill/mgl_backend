const express = require('express');
const router = express.Router();
const userConcerns = require('../models/concerns/User');

// route for update action
// router.post('/update/:id',
//     // require('connect-ensure-login').ensureLoggedIn('/login'),
//     async function (req, res) {
//         console.log(req.body);

//         // Update address
//         await addressConcerns.updateAddress(
//             req.params.id,
//             req.body.billing_address_1,
//             req.body.billing_address_2,
//             req.body.billing_state,
//             parseInt(req.body.billing_postcode),
//             req.body.billing_country,
//             req.body.shipping_address_1,
//             req.body.shipping_address_2,
//             req.body.shipping_state,
//             parseInt(req.body.shipping_postcode),
//             req.body.shipping_country
//         );
//         ('message', 'Address updated!')
//         res.redirect('/update/' + req.params.id)
//     }
// );

// route for update user action
router.post('/:id',
    async function (req, res) {
        console.log(req.body);
        await userConcerns.updateUser(req.params.id, req.body.name, req.body.password);
        res.json({'message': 'User updated!'});
    }
);

module.exports = router;