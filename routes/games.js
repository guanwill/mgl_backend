const express = require('express');
const router = express.Router();
const game = require('../models/concerns/Game')
const User = require('../models/concerns/User');
const statusMessages = require('../shared/statusMessages');

/* GET games listing. */
router.get('/', function (req, res, next) {
  res.send('games');
});

// route for update game
router.post('/:game_id',
  async function (req, res) {
    let game_id = req.params.game_id;
    let title = req.body.title;

    const updateGame = await game.updateGame(
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

    if (updateGame) {
      res.status(200).json({ message: statusMessages.game_added, data: updateGame })
    } else {
      res.status(200).json({ message: statusMessages.update_game_failed })
    }
  }
)

// route for add game
router.post('/user/:id',
  async function (req, res) {
    console.log('USER ID AND GAME TITLE')
    console.log(req.body);

    let user_id = req.params.id;
    let title = req.body.title;

    // add game
    const addGame = await game.addGame(
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

    if (addGame.nModified > 0) {
      res.status(200).json({ message: statusMessages.game_added })
    } else if (addGame.nModified === 0) {
      res.status(200).json({ message: statusMessages.add_game_failed })
    }
  }
);

// route to delete game
router.delete('/:game_id/user/:user_id', 
  async function (req, res, next) {
    const game_id = req.params.game_id;
    const user_id = req.params.user_id;
    const deleteGame = await game.deleteGame(game_id, user_id);

    if (deleteGame.nModified > 0) {
      const message = `Game ${game_id} deleted for user ${user_id}`;
      res.status(200).json({ message: message })
    } else if (deleteGame.nModified === 0) {
      res.status(200).json({ message: statusMessages.delete_game_failed })
    }
  }
);

module.exports = router;