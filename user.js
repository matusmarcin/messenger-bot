const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const { db, User } = require('./db.js')
const { token } = require('./config.js')
const async = require('asyncawait/async')
const await = require('asyncawait/await')


function getUserData(id) {
	return new Promise(function(resolve, reject) {

		if(id == 111112222233333) { // self
			reject('This is you! [111112222233333]');
		}

		let userFromDBPromise = new Promise(function(resolve, reject) {
			let userQueryPromise = User.where('id', id).find();

			userQueryPromise.then(function(results) {
				if(results.length) {
					console.log('Found something: ', results);
					resolve(results[0]);
				} else {
					console.log('Did not find user '+id+' in DB.');
					reject('Did not find.')
				}
			}).catch(() => reject('DB problem.'));
		});

		userFromDBPromise.then(function(result) {
			resolve(result.attributes);
		}).catch(function() {
			let userFromGraphPromise = new Promise(function(resolve, reject) {
				// Do the usual XHR stuff
				let req = new XMLHttpRequest();
				let url = "https://graph.facebook.com/v2.6/"+id+"?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token="+token;
				console.log('Looking up data from: ', url);
				req.open('get', url);

				req.onload = function() {
					// 'load' triggers for 404s etc
					// so check the status
					if (req.status == 200) {
						// Resolve the promise with the response text
						resolve(JSON.parse(req.responseText));
					}
					else {
						// Otherwise reject with the status text
						reject(Error(req.statusText));
					}
				};

				// Handle network errors
				req.onerror = function(err) {
					console.log('Network Error: ', err);
					reject(Error("Network Error"));
				};

				// Make the request
				req.send();
			});

			userFromGraphPromise.then(function(results) {
				console.log('Got user details for '+results.first_name+' '+results.last_name);
				let user = new User({
				    id: id,
				    first_name: results.first_name,
				    last_name: results.last_name,
				    timezone: results.timezone
				});

				(async (function() {
					console.log('Saving user data into DB.');

					await (user.save());
				}))();

				resolve(user.attributes);
			}).catch(function(err) {
				console.log(err);
				reject('Could not get user data.');
			});
		});
	});
}

module.exports = { getUser: getUserData }