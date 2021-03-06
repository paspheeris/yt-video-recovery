const fetch = require('node-fetch');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
const { validateAccessToken,
			  parseValidationRes,
			  getPlaylists,
			  parsePlaylistRes,
			  getVideosFromPlaylist,
			  createVideosCount,
			  extractVideosCount,
			  fetchAllVideos,
				extractDeletedVideos,
				vidIsDeleted } = require('../utils/youtube');
const { db,
				saveTest,
			  saveUser,
				savePlaylists,
			  saveVideos,
				getUser,
				saveUpdatedVideos,
				updateUserPls,
				savePlMetadata } = require('../utils/mongodb.js');
const { checkAvailability,
				extractTitle } = require('../utils/internetArchive');
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
	client.on('scrapeDebug', videoId => {
		console.log(videoId);
		checkAvailability(videoId)
			.then(availData => {
				if(availData.available === false) {
					client.emit('pleasePrint',
											`No archive found for ${videoId}; no scrape to debug`);
					return;
				}
				else return fetch(availData.url);
			})
			.then(rawRes => rawRes.text())
			.then(htmlStr => {
				client.emit('pleasePrint', htmlStr);
			})
			.catch(error => console.log(error));
	})
	client.on('waybackTest', videoId => {
		checkAvailability(videoId)
			.then(status => {
				return extractTitle(status.url);
				// client.emit('pleasePrint', status);
			})
			.then(title => {
				client.emit('pleasePrint', title);
			})
			.catch(error => console.log(error));
	});

	client.on('getDbCache', token => {
		validateAccessToken(token).then(validationRes => {
			if(validationRes.error_description === 'Invalid Value') {
				// Incorrect token, break off and send error to frontend
				client.emit('invalidToken', validationRes);
				return Promise.reject(validationRes);
			} else {
				const userObj = parseValidationRes(validationRes);
				return getUser(userObj);
			}
		})
			.then(user => {
				if(!user.playlists || user.playlists.length === 0) {
					// A getDbCache shouldn't normally be dispatched from the front end
					// for a user that doesn't already have videos cached in the DB, but
					// this can happen in the case of someone logging in with a YT 
					// account that doesn't actually have any videos saved, or multiple
					// people using the site from the same computer
					console.log('cache error, doing initial login instead');
					client.emit('cacheError');
					initialLoginHandler(token, client);
				} else client.emit('getDbCache', user);
			})
			.catch(error => console.log(error));
	});
	client.on('initialLogin', token => initialLoginHandler(token, client));
}
function initialLoginHandler(token, client) {
		const allPlaylists = getPlaylists(token);
		allPlaylists.then(plMetadata => {
		});
		const validatedUser = validateAccessToken(token);

		const userInDb = validatedUser.then(validationRes => {
			const userObj = parseValidationRes(validationRes);
			return getUser(userObj);
		})
			.catch(error => console.log(error));

		const playlistsWithAllVids = Promise.all([allPlaylists, validatedUser])
				.then(([playlistRes, user]) => {
				const playlistObjs = parsePlaylistRes(playlistRes);
					if(playlistObjs.length === 0) {
						client.emit('noFoundPlaylists');
						return Promise.reject(new Error('noFoundPlaylists'));
					}
				// Dispatch PL metadata to the front end, for display in Profile
				client.emit('plMetadata', playlistObjs);
					// Then save the metadata in the DB
				savePlMetadata(playlistObjs, user.email);
				// Just look at the CS PL for now
				// const filtered = playlistObjs.filter(pl => pl.id === 'PL48F29CBD223B33BC');
				const filtered = playlistObjs.filter(pl => pl.id !== 'FLnhPe1QlSHSS81GTB-YoZXA');
				// const promiseArr = filtered.map(playlistObj => {
				const promiseArr = playlistObjs.map(playlistObj => {
					return fetchAllVideos(token, playlistObj.id, undefined, []);
				});
				// return Promise.all(promiseArr);
				return promiseArr;
			})
					.catch(error => {
						console.log(error);
						return error;
					});

		const allVidsWithArchiveStatus = Promise.all(
			[playlistsWithAllVids, userInDb])
					.then(( [ plsWithAllVids, userInDb ] ) => {
				if(plsWithAllVids instanceof Error) {
					return Promise.reject(plsWithAllVids);
				}
				return plsWithAllVids.map(plPromise => {
					return plPromise.then(pl => {
						// client.emit('pleasePrint', pl);
						// client.emit('pleasePrint', userInDb);
						// Filter the matching saved PL in the db, for videos that have
						// been deleted and potentially already looked up on the internet
						// archive, so that a second lookup doesnt need to be done
						const plId = pl[0].snippet.playlistId;
						const matchingSavedPl = userInDb.playlists.find(dbPl => {
							return dbPl[0].snippet.playlistId === plId;
						});
						let savedDeletedVids;
						if(matchingSavedPl !== undefined) {
							savedDeletedVids = matchingSavedPl.filter(vid => {
								return vidIsDeleted(vid);
							});
						}
						return pl.map(( vid, i ) => {
							const { videoId } = vid.snippet.resourceId;
							if(vidIsDeleted(vid)) {
								let alreadyFetched;
								if(savedDeletedVids !== undefined) {
									// Search the matching saved PL, and if a matching video
									// with an archive field is found, just return it, as theres
									// no need to hit the interet archive again
									alreadyFetched = savedDeletedVids.find(savedVid => {
										return (savedVid.archive &&
											      savedVid.snippet.resourceId.videoId === videoId);
									});
								}
								if(alreadyFetched !== undefined) return alreadyFetched;
								else {
									const availPromise = checkAvailability(videoId);
									return Object.assign({}, vid,
																			 {archive: availPromise});
								}
							}
							else return vid;
						});
					})
				});
			})
					.catch(error => {
						console.log(error);
						return error;
					});

		const allVidsWithDeletedTitles = allVidsWithArchiveStatus.then(pls => {
			if(pls instanceof Error) {
				return Promise.reject(pls);
			}
			return pls.map(plPromise => {
				return plPromise.then(pl => {
					// client.emit('pleasePrint', pl);
					return pl.map(vid => {
						if (vid.archive === undefined) return vid;
						else if(!vid.archive.then) return vid;
						else {
							return vid.archive.then(status => {
								if(status.available === false
									 || status.url === undefined) {
									return Object.assign({}, vid, { archive: status });
								}
								else {
									const titlePromise = extractTitle(status.url);
									return titlePromise.then(titleStr => {
										const statusWithTitle = Object.assign(
											{}, status, {title: titleStr}
										);
										return Object.assign({}, vid, {archive: statusWithTitle });
									});
								}
							});
						}
					});
				})
			});
		})
					.catch(error => {
						console.log(error);
								 return error;
					});


		// Send data to the front end as it resolves per PL
		Promise.all([allVidsWithDeletedTitles, validatedUser]).then(
			( [ plsPromise, validationRes ] ) => {
				if(plsPromise instanceof Error) {
					return Promise.reject(plsPromise);
				}
				const userObj = parseValidationRes(validationRes);
				client.emit('pleasePrint', userObj);
				plsPromise.forEach(plPromise => {
					plPromise.then(vidsPromises => {
						return Promise.all(vidsPromises);
					})
						.then(vids => {
							// const { playlistId } = vids[0].snippet;
							// saveUpdatedVideos(userObj.email, playlistId, vids);
							client.emit('singlePlaylist', vids);
						})
				})
		})
		.catch(error => {
			console.log(error);
			client.emit(error.name);
		});

		// Wait for all the PLs to resolve before saving in the DB
		Promise.all([allVidsWithDeletedTitles, userInDb]).then(
			([ plsPromise, user ]) => {
				if(plsPromise instanceof Error) {
					return Promise.reject(plsPromise);
				}
				const resolvedPls = Promise.all(plsPromise.map(plPromise => {
					return plPromise.then(vidsPromises => Promise.all(vidsPromises));
				}));
				return Promise.all([resolvedPls, user]);
			}
		)
			.then(( [pls, user] ) => {
				client.emit('pleasePrint', [pls, user]);
				// Just dumps the pls onto user as an array of anonymous object atm,
				// might be more convenient to store them in the DB indexed by
				// PL name or PL ID or something rather than just arr's of objs
				// user.playlists = pls;
				updateUserPls(user.email, pls);
			})
			.catch(error => console.log(error));
}
module.exports = {
	socketHandler
};
