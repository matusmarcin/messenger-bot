'use strict';

const async = require('asyncawait/async')
const await = require('asyncawait/await')
const { News, db } = require('./db.js')

let content;

function getContent() {
	return new Promise(function(resolve, reject) { 
	 	let findPromise = News.sort('_id', -1).limit(1).find();

	 	return findPromise.then(function(results) {
			let res = results[0];

			let articles = [];
			let article;
			Object.keys(res.attributes).reduce(function(foo, key) {
				if(res.attributes[key].type == "article") {
					article = res.attributes[key];
					article.body = stripFormatting(article.body);
					return articles.push(article);
				}
			});

			let ret = { 
				date: res.attributes[0].issueDate, 
				headline: res.attributes[0].headlineSummary,
				quote: stripFormatting(res.attributes[0].zinger),
				quoteAuthor: res.attributes[0].zingerAuthor,
				articles: articles,
				_dbid: res.attributes._id
			};

			console.log("Getting content from MongoDB.");
			console.log("issueDate: ", ret.date);
			console.log("headlineSummary: ", ret.headline);
			console.log("quote: ", ret.quote + '   -- '+ret.quoteAuthor);
			console.log("articles: (count) ", articles.length);
			console.log("_dbid: ", ret._dbid)

			resolve(ret);
		}).catch(function(err) {
			console.log('Error: ', err);

			reject(err);
		}).then(function() {
			// (async (function() {
			// 	await (db.disconnect());
			// }))();
		});
	 });
}

function stripFormatting(string) {
    return string.replace(/\u2019/g, "'").replace("\n", " ").replace(/(<\/?(strong|em)>)/g, '').replace(/—/g, "-").replace(/“|”/g, '').replace(/<\/?(p)>/g, '');
}

module.exports = { getContent: getContent };