const express = require('express');
const axios = require('axios');
const moment = require('moment');
const router = express.Router();

// route to call giantbomb api to get upcoming games
router.get('/latest_games', 
  async function (req, res, next) {
    try {
      // SET API KEY TO ENV VAR
      const gbApiUrl = 'https://www.giantbomb.com/api/games/?api_key=cf71909f53e1497132eb781d7aab4d0936bfb352'
      const paramsUrl = `&&sort=original_release_date:desc&format=json&filter=original_release_date:2016-03-14|${moment(new Date()).format("YYYY/MM/DD")}&limit=10`
      const uri = gbApiUrl + paramsUrl;

      const response = await axios.get(uri);
      return res.json(response.data)
    } catch (err) {
      res.json({ message: err.message })
    }
  }
);

// route to call giantbomb api to search games
router.post('/search_games/:query',
  async function (req, res, next) {
    try {
      // SET API KEY TO ENV VAR
      const gbApiUrl = 'https://www.giantbomb.com/api/search/?api_key=cf71909f53e1497132eb781d7aab4d0936bfb352'
      const paramsUrl = `&format=json&query=${req.params.query}&resources=game&limit=10`
      const uri = gbApiUrl + paramsUrl;

      const response = await axios.get(uri);
      return res.json(response.data.results)
    } catch (err) {
      res.json({ message: err.message })
    }
  }
);

module.exports = router;