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
router.post('/:game_id/user/:user_id',
  async function (req, res) {

    const user_id = req.params.user_id;

    try {
      await User.validateUserActions(user_id, req.user.id);
 
      const game_id = req.params.game_id;
      const title = req.body.title;
      const genre = req.body.genre;
      const platform = req.body.platform;
      const release_date = req.body.release_date;
      const status = req.body.status;
      const rating = req.body.rating;
      const review = req.body.review;
      const comments = req.body.comments; 

      const updateGame = await game.updateGame(
        // user_id,
        game_id,
        title,
        genre,
        platform,
        release_date,
        status,
        rating,
        review,
        comments,
      );
  
      if (updateGame) {
        return res.json({ message: statusMessages.game_updated, game: updateGame })
      } else {
        return res.json({ message: statusMessages.update_game_failed })
      }
    } catch (err) {
      res.json({ message: err.message })
    }
  }
)

// route for add game
router.post('/user/:id',
  async function (req, res) {

    let user_id = req.params.id;

    try {
      await User.validateUserActions(user_id, req.user.id);
      
      let title = req.body.title;
      let genre = req.body.genre;
      let platform = req.body.platform;
      let release_date = req.body.release_date;
      let status = req.body.status;
      let rating = req.body.rating;
      let review = req.body.review;
      let comments = req.body.comments;  

      // add game
      const addGame = await game.addGame(
        user_id,
        title,
        genre,
        platform,
        release_date,
        status,
        rating,
        review,
        comments,
      );

      if (addGame.nModified > 0) {
        return res.json({ message: statusMessages.game_added })
      } else if (addGame.nModified === 0) {
        return res.json({ message: statusMessages.add_game_failed })
      }
    } catch (err) {
      return res.json({ message: err.message })
    }
  }
);

// route to delete game
router.delete('/:game_id/user/:user_id', 
  async function (req, res, next) {
    const game_id = req.params.game_id;
    const user_id = req.params.user_id;

    try {
      await User.validateUserActions(user_id, req.user.id);

      const deleteGame = await game.deleteGame(game_id, user_id);

      if (deleteGame.nModified > 0) {
        const message = `Game ${game_id} deleted for user ${user_id}`;
        res.json({ message: message, game: game_id })
      } else if (deleteGame.nModified === 0) {
        res.json({ message: statusMessages.delete_game_failed })
      }
    } catch (err) {
      res.json({ message: err.message })
    }
  }
);

module.exports = router;