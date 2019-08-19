const Game = require('../Game');
const User = require('../User');

async function updateGame(
    user_id,
    title,
    genre,
    platform,
    release_date,
    progress,
    rating,
    review,
    comments,
) {
    return new Promise(async function (resolve, reject) {

        const filter = { user: user_id };
        let update = {
            shipping_address_1: `${shipping_address_1}`,
            shipping_address_2: `${shipping_address_2}`,
            shipping_postcode: `${shipping_postcode}`,
            shipping_state: `${shipping_state}`,
            shipping_country: `${shipping_country}`,
            billing_address_1: `${billing_address_1}`,
            billing_address_2: `${billing_address_2}`,
            billing_postcode: `${billing_postcode}`,
            billing_state: `${billing_state}`,
            billing_country: `${billing_country}`,
        };
        let options = {
            new: true, // Return the document after updates are applied        
            upsert: true, // Create a document if one isn't found. Required for `setDefaultsOnInsert`
        };

        await Address.findOneAndUpdate(filter, update, options, function (error, doc) {
            if (error) {
                console.log(error)
                reject(new Error('Unable to add/edit address'))
            }
            resolve(doc);
        });
    })
}

async function addGame(user_id, title) {
    await User.findOne({ _id: user_id }, async function (err, user) {
        if (err) { return err }
        else {
            console.log('USERRRRRR');
            console.log(user);
            let newGame = await new Game({title: title})
            await newGame.save(function (err) { if (err) return handleError(err); });
            await user.games.push(newGame);
            await user.save();      
            
            populateUserGames(user_id);
            return
        }
    });
}

async function populateUserGames(user_id) {
    const user = await User.findOne({ _id: user_id }).populate('games');
    console.log('I AM USER')
    console.log(user);
    console.log('I AM USERS GAMES')
    console.log(user.games);
}

module.exports = {
    updateGame,
    addGame
}
