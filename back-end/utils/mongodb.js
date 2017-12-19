const User  = require('.././models/User');
const Playlist = require('.././models/Playlist');

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
	// console.log('playlistObjs in savePlaylists:', playlistObjs);
	return User.findOne({ email: userEmail })
		.then(foundUser => {
			// Filter out playlists that are already saved first

			// Save new playlists
			playlistObjs.forEach(obj => {
				// console.log("obj:", obj);
				const newPlaylist = new Playlist(obj);
				newPlaylist.save();
				foundUser.playlists.push(newPlaylist);

				// foundUser.playlists.push(new Playlist(obj));
			});
			return foundUser.save();
		})
		.catch(error => console.log(error));
    // .then(something => {
    //   something.votesByChoice.push({ choiceName: req.body.choice, count: 1 });
    //   something.allChoices.push(req.body.choice);
    //   return something.save()
    // })

	
	// const poll = Poll.findOneAndUpdate(
  //   { _id: req.params._id, 'votesByChoice.choiceName': req.body.choice },
  //   { $inc: { 'votesByChoice.$.count': 1 } }, {
  //     new: true, //return the new Poll instead of the old one
  //     runValidators: true
  //   }).exec()
	// 			.then(something => {
}
module.exports = {
	saveTest,
	saveUser,
	savePlaylists
};

