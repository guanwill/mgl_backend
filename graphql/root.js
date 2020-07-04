const config = require('../config')
const axios = require('axios');
const moment = require('moment');

// TODO: Can separate these calls into files if it grows bigger
const getLatestGames = async () => {
    const gbApiUrl = `https://www.giantbomb.com/api/games/?api_key=${config.giantbomb_api_key}`
    const paramsUrl = `&&sort=original_release_date:desc&format=json&filter=original_release_date:2016-03-14|${moment(new Date()).format("YYYY/MM/DD")}&limit=10`
    const uri = gbApiUrl + paramsUrl;
    const response = await axios.get(uri);
    return response.data.results;
}

const getSearchGames = async (args) => {
    const gbApiUrl = `https://www.giantbomb.com/api/search/?api_key=${config.giantbomb_api_key}`
    const paramsUrl = `&format=json&query=${args.query}&resources=game&limit=10`
    const uri = gbApiUrl + paramsUrl;
    const response = await axios.get(uri);
    return response.data.results;
}

// Each of the properties below represent an API endpoint or DB query.
// Each of the below properties below is mapped to the same property name defined in schema, which tells you what can be queried by the client and what the expected fields are in the response.
const root = {
    latestGames: () => {
        return getLatestGames();
    },
    searchGames: (args) => {
        return getSearchGames(args);
    }
};

module.exports = root;