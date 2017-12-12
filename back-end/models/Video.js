const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const videoSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Video', videoSchema);

