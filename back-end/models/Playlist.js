const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PlaylistSchema = new mongoose.Schema({
	title: String,
	id: String,
	thumbnail: {
		url: String,
		width: Number,
		height: Number
	},
	created: String,
	videos: [
		{type: mongoose.Schema.Types.ObjectId, ref: 'Video'}
	]
});
module.exports = mongoose.model('Playlist', PlaylistSchema);
