const config = require("../config");
const axios = require("axios");
const moment = require("moment");

// TODO: Can separate these calls into files if it grows bigger
const getLatestGames = async () => {
  const gbApiUrl = `https://www.giantbomb.com/api/games/?api_key=${config.giantbomb_api_key}`;
  const paramsUrl = `&&sort=original_release_date:desc&format=json&filter=original_release_date:2016-03-14|${moment(
    new Date()
  ).format("YYYY/MM/DD")}&limit=10`;
  const uri = gbApiUrl + paramsUrl;
  const response = await axios.get(uri);
  return response.data.results;
};

const getSearchGames = async (args) => {
  const gbApiUrl = `https://www.giantbomb.com/api/search/?api_key=${config.giantbomb_api_key}`;
  const paramsUrl = `&format=json&query=${args.query}&resources=game&limit=10`;
  const uri = gbApiUrl + paramsUrl;
  const response = await axios.get(uri);
  return response.data.results;
};

const getPics = async (guid) => {
  // actually getGameDetails below already provides all images for a game
  const gbApiUrl = `https://www.giantbomb.com/api/images/${guid}/?api_key=${config.giantbomb_api_key}`;
  const paramsUrl = `&format=json&limit=3`;
  const uri = gbApiUrl + paramsUrl;
  const response = await axios.get(uri);
  return response.data.results;
};

const getGameDetails = async (guid) => {
  const gbApiUrl = `https://www.giantbomb.com/api/game/${guid}/?api_key=${config.giantbomb_api_key}`;
  const paramsUrl = `&format=json`;
  const uri = gbApiUrl + paramsUrl;
  const response = await axios.get(uri);
  return response.data.results;
};

// resolver
const resolvers = {
  
  // these are parent queries
  Query: {
    latestGames: () => {
      return getLatestGames();
    },
    searchGames: (parent, args, ctx, info) => {
      return getSearchGames(args);
    },
  },
  
  // these are nested queries on a field level; for custom fields
  GamesResponse: {
    // use guid received from parent to make a subsequent call to /api/images
    pictures: (game) => getPics(game.guid),
    // use guid received from parent to make a subsequent call to /api/game to get more details
    moreInfo: async (game) => {
      const gameDetails = await getGameDetails(game.guid);
      return {
        genres: gameDetails.genres,
        developers: gameDetails.developers
      }
    }
  },
};

module.exports = resolvers;
