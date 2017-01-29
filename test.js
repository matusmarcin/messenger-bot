'use strict';

const { getContent } = require('./content.js')
const { getUser } = require('./user.js')
const ai = require('./general_ai.js')
const { token } = require('./config.js')

const { db } = require('./db.js')
const async = require('asyncawait/async')
const await = require('asyncawait/await')

let contentPromise = getContent();
let userPromise = getUser(111112222233333);

Promise.all([contentPromise, userPromise]).then(function([content, user]) {
	console.log(content);
	console.log(user);
	
	console.log(content._dbid);

	console.log(ai.getMessage('hi', user));
}).catch(function(err) {
	console.log('My dear promises failed: ', err);
	console.log('Something has gone mighty terribly wrong.');
}).then(function() {
	// (async (function() {
	// 	await (db.disconnect());
	// }))();
});	
