const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PlaylistSchema = new mongoose.Schema({
    name: String,
    videos: [
        {type: mongoose.Schema.Types.ObjectIs, ref: 'Video'}
    ]
});
module.exports = mongoose.model('Playlist', PlaylistSchema);
