const fetch = require('node-fetch');
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
				// return playlistObjs.map(playlistObj => {
					return fetchAllVideos(token, playlistObj.id, undefined, []);
				});
				return Promise.all(promiseArr);
			})
			.catch(error => console.log(error));

		const allVidsWithArchiveStatus = playlistsWithAllVids
			.then(plsWithAllVids => {
				// console.log(something);
				// client.emit('pleasePrint', something);
				return plsWithAllVids.map(pl => {
					return pl.map(vid => {
						const { videoId } = vid.snippet.resourceId;
						if(vidIsDeleted(vid)) {
							const availPromise = checkAvailability(videoId);
							return Object.assign({}, vid,
																	 {archive: availPromise});
						}
						else return vid;
					});
				});
			})
			.catch(error => console.log(error));

		const allVidsWithDeletedTitles = allVidsWithArchiveStatus.then(pls => {
			return pls.map(pl => {
				return pl.map(vid => {
					// console.log(vid.archive);
					if (vid.archive === undefined) return vid;
					else {
						return vid.archive.then(status => {
							// console.log('STATUS: ', status);
							client.emit('pleasePrint', status);
							if(status.available === false) {
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
			});
		});

		allVidsWithDeletedTitles.then(pls => {
			pls.forEach(pl => {
				// console.log(pl);
				pl.forEach(vid => {
					// having promises nested on a huge data ray as atributes of objs...
					if(vid.archive !== undefined) {
						vid.archive.then(something => {
							client.emit('pleasePrint', something);
						})
					}
				})
			})
		});
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
