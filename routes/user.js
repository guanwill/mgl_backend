const express = require('express');
const router = express.Router();
const statusMessages = require('../shared/statusMessages');
const User = require('../models/concerns/User');

// route for update user action
router.post('/:id',
    async function (req, res) {
        try {
            const user_id = req.params.id;
            await User.validateUserActions(user_id, req.user.id);
            await User.updateUser(user_id, req.body.name, req.body.password);
            res.status(200).json({ message: statusMessages.account_updated })
        } catch (err) {
            res.status(400).json({ message: err.message }) 
        }
    }
);

router.get('/:id',
    async function (req, res) {
        try {
            const user_id = req.params.id;
            await User.validateUserActions(user_id, req.user.id);
            const userGames = await User.populateUserGames(user_id);
            res.status(200).json({ message: statusMessages.account_retrieved, data: userGames })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
)

module.exports = router;