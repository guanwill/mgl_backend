const Game = require('../Game');
const User = require('../User');

async function updateGame(
    game_id,
    title,
    // genre,
    // platform,
    // release_date,
    // progress,
    // rating,
    // review,
    // comments,
) {
    const filter = { _id: game_id };
    let update = {
        title: title
    };
    let options = {
        new: true, // Return the document after updates are applied        
        upsert: false, // Create a document if one isn't found. Required for `setDefaultsOnInsert`
    };
    
    await Game.findOneAndUpdate(filter, update, options)

    const b = await populateUserGames('5d5d4ff7a46f91945fd2211a')
    console.log(b);

    return('adsf');
}

async function addGame(user_id, title) {
    try {
        var query = { title: title, user: user_id },
            update = { title: title },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const game = await Game.findOneAndUpdate(query, update, options);
        return await User.updateOne({ _id: user_id }, { $addToSet: { games: game._id } });
    } catch (err) {
        return err
    }
}

async function populateUserGames(user_id) {
    const user = await User.findOne({ _id: user_id }).populate('games');
    console.log('POPULATE GAMES')
    console.log(user);
    console.log(user.games);
}

module.exports = {
    updateGame,
    addGame
}
