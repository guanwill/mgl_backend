const express = require('express');
const router = express.Router();
const User = require('../models/concerns/User');
const statusMessages = require('../shared/statusMessages');

/* GET user games. */
router.get('/games/user/:id',
    async function (req, res) {
        try {
            const user_id = req.params.id;
            const userGames = await User.populateUserGames(user_id);
            res.json({ message: statusMessages.account_retrieved, data: userGames })
        } catch (err) {
            res.json({ message: err.message })
        }
    }
)

module.exports = router;