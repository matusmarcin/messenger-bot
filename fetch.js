'use strict';

const async = require('asyncawait/async')
const await = require('asyncawait/await')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const { News, db } = require('./db.js')

let dateObject = new Date();

if(dateObject.getDay() == 0) {
  dateObject = new Date(date.getTime()-1000*60*60*24);
}

let month = dateObject.getMonth()+1;
let day = dateObject.getDate();

let date = dateObject.getFullYear()+'-'+(month < 10 ? '0'+month : month)+'-'+(day < 10 ? '0'+day : day);

console.log('Fetching from '+date);

const articlesUrl = 'https://add-something-here.com/endpoint/'+date+'.json';

function getData(url) {
  // Return a new promise.
  let requestPromise = new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    let req = new XMLHttpRequest();
    req.open('get', url);

    req.onload = function() {
      // 'load' triggers for 404s etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.responseText);
      }
      else {
        // Otherwise reject with the status text
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });

  return requestPromise.then(function(results) {
    return saveArticles(results);
  }).catch(function(err) {
  	console.log(err);
  	return false;
  });
}

function saveArticles(data) {
	let content = JSON.parse(data);
	if(content == undefined || content != undefined && !content.length) {
		console.log('Content empty:', content);
		return false;
	}

	console.log('Going to save articles now.');
  (async (function() {
      let News = new News(content);

      await (News.save());

      await (db.disconnect());
  }))();
}

getData(articlesUrl);