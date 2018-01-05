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
				getUser } = require('../utils/mongodb.js');
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

	client.on('initialLogin', token => {
		const allPlaylists = getPlaylists(token);
		const validatedUser = validateAccessToken(token);

		const userInDb = validatedUser.then(validationRes => {
			userObj = parseValidationRes(validationRes);
			return getUser(userObj.email);
		}).catch(error => console.log(error));
		const playlistsWithAllVids = allPlaylists
			.then(playlistRes => {
				const playlistObjs = parsePlaylistRes(playlistRes);
				// Just look at the CS PL for now
				const filtered = playlistObjs.filter(pl => pl.id === 'PL48F29CBD223B33BC');
				// const filtered = playlistObjs.filter(pl => pl.id === 'FLnhPe1QlSHSS81GTB-YoZXA');
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
						client.emit('pleasePrint', pl);
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
			return Promise.all(pls.map(pl => {
				return Promise.all(pl.map(vid => {
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
				}));
			}));
		})
					.then(error => console.log(error));


		allVidsWithDeletedTitles.then(something => {
			// client.emit('pleasePrint', something);
			something.forEach(pl => {
				const filtered = pl.filter(vid => vid.archive && vid.archive.available);
				// const actuallyHaveTitles = pl.filter(vid => vid.archive && vid.archive.title);
				client.emit('pleasePrint', `pl length: ${pl.length}`);
				client.emit('pleasePrint', `deleted: ${pl.filter(vid => vid.archive).length}`);
				client.emit('pleasePrint', filtered);
				// client.emit('pleasePrint', actuallyHaveTitles);
			});
		});

		// allVidsWithDeletedTitles.then(pls => {
		// 	pls.forEach(pl => {
		// 		// console.log(pl);
		// 		pl.forEach(vid => {
		// 			// having promises nested on a huge data ray as atributes of objs...
		// 			if(vid.archive !== undefined) {
		// 				vid.archive.then(something => {
		// 					client.emit('pleasePrint', something);
		// 				})
		// 			}
		// 		})
		// 	})
		// });

		// const deletedVidsWithStatus = Promise.all([userInDb, playlistsWithAllVids])
		// 	.then(( [userInDb, playlistsWithAllVids] ) => {
		// 		// client.emit('pleasePrint', userInDb);
		// 		const availStatus = playlistsWithAllVids.map(plPromise => {

		// 			return plPromise.then(pl => {
		// 				const deletedVids = extractDeletedVideos(pl);

		// 				return deletedVids.map(vid => {
		// 					return checkAvailability(vid.snippet.resourceId.videoId);
		// 				});
		// 			});
		// 		});
		// 		return availStatus;
		// 	})
		// 	.catch(error => console.log(error));

		// console.log(deletedVidsWithStatus);
		// deletedVidsWithStatus.then(vids => {
		// 	client.emit('pleasePrint', vids);
		// });

	// 		.then(deletedVidsByPl => {
	// 			// client.emit('pleasePrint', promises);
	// 			const scraped = deletedVidsByPl.map(pl => {
	// 				return pl.map(deletedVid => {
	// 					if(deletedVid.available === false) return deletedVid;
	// 					else {
	// 						// console.log('deltedVid.url: ', deletedVid.url);
	// 						// client.emit('pleasePrint', deletedVid);
	// 						return extractTitle(deletedVid.url).then(title => {
	// 							if (title === 'staleSnapshot') return {
	// 								'available': false,
	// 								'videoId': deletedVid.videoId
	// 							};
	// 							else return Object.assign({}, deletedVid, {title});
	// 						});
	// 					}
	// 				});
	// 			});
	// 			return scraped;
	// 		})
	// 	.catch(error => console.log(error));

	// console.log('deletedVidsWithTitles', deletedVidsWithTitles);
	// Promise.all(deletedVidsWithTitles).then(deletedVids => {
	// 	// console.log("DELTEDVID: ", deletedVid);
	// 	client.emit('pleasePrint', deletedVids);
	// })

	});
}
module.exports = {
	socketHandler
};
