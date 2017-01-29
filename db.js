'use strict'

const db = require('mongorito')
const async = require('asyncawait/async')
const await = require('asyncawait/await')

const Model = db.Model;

class News extends Model {

}

class User extends Model {

}

(async (function() {
	await (db.connect('localhost/chatbot'));
 }))();

module.exports = {
	News: News,
	User: User,
	db: db
};



// mongorito.disconnect();