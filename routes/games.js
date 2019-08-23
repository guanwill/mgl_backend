const express = require('express');
const router = express.Router();
const game = require('../models/concerns/Game')
const User = require('../models/concerns/User');

/* GET games listing. */
router.get('/', function (req, res, next) {
  res.json('cool')
});

// route for update game
router.post('/:game_id',
  async function (req, res) {
    console.log('UPDATE GAME TITLE')
    console.log(req.body);

    // let user_id = req.params.id;
    let game_id = req.params.game_id;
    let title = req.body.title;

    // Update game
    const a = await game.updateGame(
      // user_id,
      game_id,
      title,
      // genre,
      // platform,
      // release_date,
      // progress,
      // rating,
      // review,
      // comments,
    );
    console.log('aaaaaa');
    console.log(a);
    res.send(a);
  }
)

// route for add game
router.post('/user/:id',
  async function (req, res) {
    console.log('USER ID AND GAME TITLE')
    console.log(req.body);

    let user_id = req.params.id;
    let title = req.body.title;

    // Update game
    const a = await game.addGame(
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
    console.log('aaaaaa');
    console.log(a);
    res.send(a);
  }
);

module.exports = router;