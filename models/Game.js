const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GameSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    genre: String,
    platform: String,
    release_date: Date,
    progress: String,
    rating: Number,
    review: String,
    comments: String,
    user: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game