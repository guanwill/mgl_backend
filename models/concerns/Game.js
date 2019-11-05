const Game = require('../Game');
const User = require('../User');

async function updateGame(
    game_id,
    title,
    genre,
    platform,
    release_date,
    status,
    rating,
    review,
    comments,
) {
    const filter = { _id: game_id };
    let update = {
        title,
        genre,
        platform,
        release_date,
        status,
        rating,
        review,
        comments,
    };
    let options = {
        new: true, // Return the document after updates are applied        
        upsert: false, // Create a document if one isn't found. Required for `setDefaultsOnInsert`
    };
    
    const updatedGame = await Game.findOneAndUpdate(filter, update, options)

    return(updatedGame);
}

async function addGame(
    user_id,
    title,
    genre,
    platform,
    release_date,
    status,
    rating,
    review,
    comments,    
) { 
    try {
        let query = { title: title, user: user_id },
            update = { 
                title,
                genre,
                platform,
                release_date,
                status,
                rating,
                review,
                comments, 
            },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const game = await Game.findOneAndUpdate(query, update, options);
        return await User.updateOne({ _id: user_id }, { $addToSet: { games: game._id } });
    } catch (err) {
        return err
    }
}

async function deleteGame(game_id, user_id) {
    try {
        await Game.remove({ _id: game_id })
        const deleteGame = await User.update({ _id: user_id }, { $pull: { games: game_id } });
        return deleteGame;
    } catch (err) {
        return err
    }
}

module.exports = {
    updateGame,
    addGame,
    deleteGame
}
