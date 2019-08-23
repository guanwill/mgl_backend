const express = require('express');
const router = express.Router();
const statusMessages = require('../shared/statusMessages');
const user = require('../models/concerns/User');

// route for update user action
router.post('/:id',
    async function (req, res) {
        try {
            await user.updateUser(req.params.id, req.body.name, req.body.password);
            res.status(200).json({ message: statusMessages.account_updated })
        } catch (e) {
            res.status(400).json({ message: e }) 
        }
    }
);

router.get('/:id',
    async function (req, res) {
        try {
            const user_id = req.params.id;
            const userGames = await user.populateUserGames(user_id);
            res.status(200).json({ message: statusMessages.account_retrieved, data: userGames })
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }
)

module.exports = router;