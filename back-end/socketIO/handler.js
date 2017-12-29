const fetch = require('node-fetch');
const { validateAccessToken,
			  parseValidationRes,
			  getPlaylists,
			  parsePlaylistRes,
			  getVideosFromPlaylist,
			  createVideosCount,
			  extractVideosCount,
			  fetchAllVideos,
				extractDeletedVideos } = require('../utils/youtube');
const { db,
				saveTest,
			  saveUser,
				savePlaylists,
			  saveVideos,
				getUser } = require('../utils/mongodb.js');
const { checkAvailability } = require('../utils/internetArchive');
function socketHandler(client) {
	console.log('connect in the wwww');
	client.on('test', (d) => {
		console.log(d);
		// db("ytusers").insertOne({
		// 	name: "brandon",
		// 	age: 25,
		// 	status: "confirme"
		// });
		client.emit('testDataReceived', d);
	});

	client.on('waybackTest', videoId => {
		checkAvailability(videoId)
			.then(status => {
				client.emit('pleasePrint', status);
			})
			.catch(error => console.log(error));
	});

	client.on('initialLogin', token => {
		const allPlaylists = getPlaylists(token);
		const validatedUser = validateAccessToken(token);

		const userInDb = validatedUser.then(validationRes => {
			userObj = parseValidationRes(validationRes);
			return getUser(userObj.email);
		}).catch(error => console.log(error));
		const allVideos = allPlaylists
			.then(playlistRes => {
				const playlistObjs = parsePlaylistRes(playlistRes);
				// Just look at the CS PL for now
				const filtered = playlistObjs.filter(pl => pl.id === 'PL48F29CBD223B33BC');
				return filtered.map(playlistObj => {
				// return playlistObjs.map(playlistObj => {
					return fetchAllVideos(token, playlistObj.id, undefined, []);
				});
			})
			.catch(error => console.log(error));

		Promise.all([userInDb, allVideos])
			.then(( [userInDb, allVideos] ) => {
				client.emit('pleasePrint', userInDb);
				// allVideos.then(plPromises => {
					allVideos.forEach(plPromise => {
						plPromise.then(pl => {
							const deletedVids = extractDeletedVideos(pl);
							client.emit('pleasePrint', deletedVids);
						});
					// });
				});
			})
			.catch(error => console.log(error));
		// allVideos is a Promise of an array of Promises that resolve to a pl
		// of all of the videos from the PL, as returned by the YT API
		// const userInDb = validateAccessToken(token) 
		// 		.then(validationRes => {
		// 			userObj = parseValidationRes(validationRes);
		// 			// return Promise.all([getPlaylists(token), getUser(userObj.email)]);
		// 			return getPlaylists(token);
		// 		})
		// 		.then(something => {
		// 			console.log(something);
		// 		})
		// 			.catch(error => console.log(error));
		
		// const allVideos = validateAccessToken(token)
		// 	.then(validationRes => {
		// 		// console.log('token:', token);
		// 		userObj = parseValidationRes(validationRes);
		// 		return getPlaylists(token);
		// 	})
		// 	.then(playlistRes => {
		// 		const playlistObjs = parsePlaylistRes(playlistRes);
		// 		// if(plId !== ) return;
		// 		// Just look at the CS PL for now
		// 		const filtered = playlistObjs.filter(pl => pl.id === 'PLrkcX2uLOH-gXi0fpN5eQRdVatlqozQ0N');
		// 		return filtered.map(playlistObj => {
		// 		// return playlistObjs.map(playlistObj => {
		// 			return fetchAllVideos(token, playlistObj.id, undefined, []);
		// 		});
		// 	})
		// 	.catch(error => console.log(error));

		// console.log('allVideos', allVideos);
		// allVideos.then(plPromises => {
		// 	plPromises.forEach(plPromise => {
		// 		plPromise.then(pl => {
		// 			client.emit('pleasePrint', pl);
		// 		});
		// 	});
		// })
		// 	.catch(error => console.log(error));
	});
	client.on('accessToken', token => {
		let userEmail;
		// Validate token, then...
		validateAccessToken(token)
		// ...parse res into a form to use
			.then(validationRes => parseValidationRes(validationRes))
		// ...save the user in DB if they're not already there
			.then(userObj => {
				// Save userEmail in the local scope so that it can be used through
				// the rest of the promise chain
				userEmail = userObj.email;
				return saveUser(userObj);
			})
			.then(userData => {
				// Send saved user data to the frontend, if found
				// ie. send playlist titles and playlists that are already saved
				if(userData !== null) {
					// console.log('userData in promise chain:', userData);
				}
			})
		// ...get playlist data for the user
			.then(_ => getPlaylists(token))
			.then(playlistRes => parsePlaylistRes(playlistRes))
			.then(playlistObjs => {
				// Save any new playlists in the DB under the user
				return savePlaylists(userEmail, playlistObjs);
			})
			.then(updatedUser => {
				// Get the first 50 vids in each playlist? See if we need more?

								// console.log('updatedUser:', updatedUser.value);
				return Promise.all(
					updatedUser.value.playlists.map(playlist => {
						return getVideosFromPlaylist(token, playlist.id);
					})
				)
				// Nesting this then with the Promise.all results, because we still
				// need the updatedUser object in scope 
					.then(videos => {
						console.log('emiting first50');
						client.emit('first50', videos);

						const dbVideosCount =
									createVideosCount(updatedUser.value.playlists);
						// console.log('dbVideosCount:', dbVideosCount);

						const apiVideosCount = extractVideosCount(videos);
						// console.log('apiVideosCount:', apiVideosCount);
						// Here we have three peices of information:
						// 1. All videos in the DB, and thus the length of each PL
						// 2. The length of each PL from the API Res
						// 3. The first 50 videos of each PL from the Api Res

						// Need to branch the logic here based on that information, ie:
						// A: If the length of the PL in the DB and in the API res is the
						//    same, then we're done with that playlist for the rest of the
						//    process, because nothng has changed, so we can just send the
						//    info that we have for it. *Actually, if a video was deleted
						//    since last time, then theres more work to be done*.
						// B: If the difference in length between the PL in the DB and in
						//    the Api Res is <= 50, then we've already fetched all the new
						//    videos that we need (this should cover the majority of
					  //    cases, except for someone's first visit). Here we need to
						//    save any new videos to the DB, do all the work searching for
						//    deleted videos, and send all that info to the front end.
						// C: If the difference in length between the PL in the DB and in
						//    the API Res is > 50, then we need to make more fetches for
						//    the other new videos, save those (and what we already
					  //    fetched) and do all the work searching for deleted videos,
						//    and send all that info to the frontend.

						// Actually, don't we need to fetch the entirety of each playlist
						// each time, because a video could have been deleted since the
						// last visit, and comparing lengths of PL in the DB vs PL in the
						// API res won't tell us anything about that...

						Object.keys(apiVideosCount).forEach(plId => {
							if(plId !== 'PLrkcX2uLOH-gXi0fpN5eQRdVatlqozQ0N') return;
							// cs pl id: PLrkcX2uLOH-gXi0fpN5eQRdVatlqozQ0N
							const difference = apiVideosCount[plId] - dbVideosCount[plId];
							// Have to find the PL that where dealing with from the apiRes,
							// might be better to do this some way else
							const first50 = videos.find(playlistObj => {
								return playlistObj.items[0].snippet.playlistId === plId;
							});
							const nextPageToken = first50.nextPageToken;
							// console.log(apiVideosCount[plId], nextPageToken);

							// if (difference === 0) {

							// } else if (difference <= 50) {
							// 	saveVideos(userEmail, plId, first50);

							// } else if (difference > 50) {
							console.log('nextPageToken socketHandler chain', nextPageToken);
								const allNewVideos = fetchAllVideos(
									token, plId, nextPageToken, first50.items
								);
							allNewVideos.then(vids => client.emit('allNewVideos', vids));
							// }
						});

					});
				// return getVideosFromPlaylist(token, updatedUser.value.playlists[0].id);
			})
			.then(first50 => {
				// first50.forEach(data => data.then(something => console.log(something)));
								// console.log(first50);
			})
			.catch(error => console.log(error));
	});
}



module.exports = {
	socketHandler
};
