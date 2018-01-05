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
function getUser(userObj) {
	// Get's a user's data from the data, or if no user is found with a matching,
	// email, a new user is created and returned
  return db("ytusers").findOne(
		{ email: userObj.email }
	)
		.then(userData => {
			console.log('userData: ', userData);
			if (userData === null) {
				const newUser = Object.assign({}, userObj, {playlists: []});
				db('ytusers').insert(newUser).catch(e => console.log(e));
				return newUser;
			} else return userData;
		})
		.catch(error => console.log(error));
}
function saveUser(userObj) {
	return User.findOne({ email: userObj.email })
		.then(data => {
			if (data === null) {
				// User isn't saved in the DB yet, save them
				console.log('Saving a new user in saveUser function');
				const newUser = new User(userObj);
				newUser.save();
				// return newUser.save().then(savedUser => savedUser);
			} else {
				// User was found in the DB, return their data
				return data;
			}
		})
		.catch(error => console.log(error));
}
function savePlaylists(userEmail, playlistObjs) {
	// Add any new playlists to the playlists array for the user
	// Might want to use mapReduce to do this?
	playlistObjs.forEach(obj => {
		if(obj.videos === undefined) {
			obj.videos = [];
		}
	});
	return db('ytusers').findOne(
		{ email: userEmail }
	).then(storedUser => {
		const storedPlIds = storedUser.playlists.map(pl => pl.id);
		const newPlaylists = playlistObjs.filter(plObj => {
			return !storedPlIds.includes(plObj.id);
		});
		return db("ytusers").findAndModify(
			{ email: userEmail },
			{},
			{ $push: {playlists: { $each: newPlaylists}}}
		)
	})
}
function saveVideos(userEmail, plId, videoObjs) {
  return db("ytusers").update(
		{ email: userEmail,
		  // playlists: { $elemMatch: { id: plId }}},
		  "playlists.id": plId },
		// { $addToSet: { "playlists.$.videos": { $each: videoObjs.items }}},
		// { "playlists.$.videos": {$addToSet:  {$each: videoObjs.items}}}
		{ $addToSet: {"playlists.$.videos": {$each: videoObjs.items}}}
	)
		.catch(error => console.log(error));
}

function saveUpdatedVideos(userEmail, plId, videos) {
  return db("ytusers").update(
		{ email: userEmail,
		  "playlists.id": plId },
		{ $set: {"playlists.$.videos":  videos}}
	)
		.catch(error => console.log(error));
}
function updateUser(userEmail, newUserObj) {
	return db('ytusers').update(
		{ email: userEmail},
		newUserObj
	)
		.catch(error => console.log(error));
}
module.exports = {
	saveTest,
	saveUser,
	savePlaylists,
	db,
	saveVideos,
	getUser,
	saveUpdatedVideos,
	updateUser
};

