const express = require('express');
const router = express.Router();
const game = require('../models/concerns/Game')
const User = require('../models/concerns/User');

/* GET games listing. */
router.get('/', function (req, res, next) {
  res.json('cool')
});

// route for update game
router.post('/:game_id/user/:id',
  async function (req, res) {
    console.log(req.body);

    // Update game
    await addressConcerns.updateAddress(
      req.params.id,
      req.body.billing_address_1,
      req.body.billing_address_2,
      req.body.billing_state,
      parseInt(req.body.billing_postcode),
      req.body.billing_country,
      req.body.shipping_address_1,
      req.body.shipping_address_2,
      req.body.shipping_state,
      parseInt(req.body.shipping_postcode),
      req.body.shipping_country
    );
    ('message', 'Address updated!')
    res.redirect('/update/' + req.params.id)
  }
);

// route for add game
router.post('/user/:id',
  async function (req, res) {
    console.log('USER ID AND GAME TITLE')
    console.log(req.body);

    let user_id = req.params.id;
    let title = req.body.title;

    // Update game
    await game.addGame(
      user_id,
      title,
      // genre,
      // platform,
      // release_date,
      // progress,
      // rating,
      // review,
      // comments,
    );
    res.send('success');
  }
);

module.exports = router;