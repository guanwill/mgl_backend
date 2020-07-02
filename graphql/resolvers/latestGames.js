// const getProducts = () => {
//     return Promise.resolve([{
//       title: 'Movie'
//     }]);
//   }  
  
//    const latestGamesRoot = {
//     hello: () => {
//       return "Hello world yaya!";
//     },
//     products: () => {
//       return getProducts();
//     }
// };

// module.exports = latestGamesRoot;

const config = require('../../config')
const axios = require('axios');
const moment = require('moment');

const getLatestGames = async () => {
    const gbApiUrl = `https://www.giantbomb.com/api/games/?api_key=${config.giantbomb_api_key}`
    const paramsUrl = `&&sort=original_release_date:desc&format=json&filter=original_release_date:2016-03-14|${moment(new Date()).format("YYYY/MM/DD")}&limit=10`
    const uri = gbApiUrl + paramsUrl;
    const response = await axios.get(uri);
    return response.data.results;
}  
  
const latestGamesRoot = {
    latestGames: () => {
        return getLatestGames();
    }
};

module.exports = latestGamesRoot;