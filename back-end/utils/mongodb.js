var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const User  = require('.././models/User');
const Playlist = require('.././models/Playlist');

const establishDbConnection = _ =>{
	let connection;
	MongoClient.connect(process.env.DATABASE, function(err, db) {
		if(err) console.log(err);
		if(!err) {
			connection = db;
			console.log("We are connected");
		}
	});
	return collectionName => connection.collection(collectionName);
};
const db = establishDbConnection();


// YtUser.save
function saveTest() {
	const testUser = new User({email: 'hurr', expiresAt: 123});
	testUser.save()
		.then(saved => {
			console.log('successfully saved:', saved);
		})
		.catch(error => {
			console.log(error);
		});
}
function saveUser(userObj) {
	return User.findOne({ email: userObj.email })
		.then(data => {
			if (data === null) {
				// User isn't saved in the DB yet, save them
				console.log('Saving a new user in saveUser function');
				userObj.videos = [];
				const newUser = new User(userObj);
				newUser.save();
				return null;
			} else {
				// User was found in the DB, return their data
				// console.log('User found in saveUser function:', data);
				return data;
			}
		})
		.catch(error => console.log(error));
}
function savePlaylists(userEmail, playlistObjs) {
	// Add any new playlists to the playlists array for the user
	// Might want to use mapReduce to do this?


	// console.log('playlistObjs in savePlaylists:', playlistObjs);
	// Simpler to set videos to an empty array here rather than messing
	// around with upsert'ing later with mongo?
	playlistObjs.forEach(obj => obj.videos = []);
	return db("ytusers").findAndModify(
		{ email: userEmail},
		{},
		{ $addToSet: { playlists: { $each: playlistObjs}}},
		{ new: true }
	);
}
function saveVideos(userEmail, plId, videoObjs) {
	console.log('videoObjs in saveVideos:', videoObjs);
  return db("ytusers").update(
		{ email: userEmail,
		  playlists: { $elemMatch: { id: plId }}},
		{ $addToSet: { "playlists.$.videos": { $each: videoObjs.items }}},
		// { "playlists.$.videos": {$addToSet: { $each: videoObjs.items }}},
	)
		.catch(error => console.log(error));
}
module.exports = {
	saveTest,
	saveUser,
	savePlaylists,
	db,
	saveVideos
};

