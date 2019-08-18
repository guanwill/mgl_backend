const express = require('express');
const router = express.Router();
const statusMessages = require('../shared/statusMessages');
const userConcerns = require('../models/concerns/User');

// route for update user action
router.post('/:id',
    async function (req, res) {
        console.log(req.body);
        await userConcerns.updateUser(req.params.id, req.body.name, req.body.password);
        res.status(200).json({ message: statusMessages.account_updated })
    }
);

module.exports = router;