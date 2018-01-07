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
			const userObj = parseValidationRes(validationRes);
			// console.log(userObj);
			return getUser(userObj);
		})
			.then(user => client.emit('getDbCache', user))
			.catch(error => console.log(error));
	});

	client.on('initialLogin', token => {
		const allPlaylists = getPlaylists(token);
		const validatedUser = validateAccessToken(token);

		const userInDb = validatedUser.then(validationRes => {
			const userObj = parseValidationRes(validationRes);
			return getUser(userObj);
		})
			.catch(error => console.log(error));

		const playlistsWithAllVids = Promise.all([allPlaylists, validatedUser])
				.then(([playlistRes, user]) => {
				const playlistObjs = parsePlaylistRes(playlistRes);
				savePlMetadata(playlistObjs, user.email);
				// client.emit('pleasePrint', playlistObjs);
				// Just look at the CS PL for now
				// const filtered = playlistObjs.filter(pl => pl.id === 'PL48F29CBD223B33BC');
				const filtered = playlistObjs.filter(pl => pl.id !== 'FLnhPe1QlSHSS81GTB-YoZXA');
				const promiseArr = filtered.map(playlistObj => {
				// const promiseArr = playlistObjs.map(playlistObj => {
					return fetchAllVideos(token, playlistObj.id, undefined, []);
				});
				// return Promise.all(promiseArr);
				return promiseArr;
			})
			.catch(error => console.log(error));

		const allVidsWithArchiveStatus = playlistsWithAllVids
			.then(plsWithAllVids => {
				return plsWithAllVids.map(plPromise => {
					return plPromise.then(pl => {
						// client.emit('pleasePrint', pl);
						return pl.map(( vid, i ) => {
							const { videoId } = vid.snippet.resourceId;
							if(vidIsDeleted(vid)) {
								const availPromise = checkAvailability(videoId);
								return Object.assign({}, vid,
																		 {archive: availPromise});
							}
							else return vid;
						});
					})
				});
			})
			.catch(error => console.log(error));

		const allVidsWithDeletedTitles = allVidsWithArchiveStatus.then(pls => {
			return pls.map(plPromise => {
				return plPromise.then(pl => {
					// client.emit('pleasePrint', pl);
					return pl.map(vid => {
						if (vid.archive === undefined) return vid;
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
					.catch(error => console.log(error));


		// Send data to the front end as it resolves per PL
		Promise.all([allVidsWithDeletedTitles, validatedUser]).then(
			( [ plsPromise, validationRes ] ) => {
				const userObj = parseValidationRes(validationRes);
				client.emit('pleasePrint', userObj);
				plsPromise.forEach(plPromise => {
					plPromise.then(vidsPromises => {
						return Promise.all(vidsPromises);
					})
						.then(vids => {
							const { playlistId } = vids[0].snippet;
							saveUpdatedVideos(userObj.email, playlistId, vids);
							// client.emit('pleasePrint', vids);
						})
				})
		})
			.catch(error => console.log(error));

		// Wait for all the PLs to resolve before saving in the DB
		Promise.all([allVidsWithDeletedTitles, userInDb]).then(
			([ plsPromise, user ]) => {
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

	});
}
module.exports = {
	socketHandler
};
