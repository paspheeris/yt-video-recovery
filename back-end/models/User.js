const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const YtUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: 'Must have a playlist!'
    },
    playlists: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'}
    ],
    expiresAt: {
        type: Number,
        required: 'Must have a token expiration timestamp!'
    }
});
module.exports = mongoose.model('YtUser', YtUserSchema);
// module.exports = {
//     ytUserSchmea: mongoose.model('ytUser', ytUserSchema),
//     playListSchmea: mongoose.model('playList', playListSchema),
//     videoSchema:  mongoose.model('video', videoSchema)
// };
