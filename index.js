'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const { getContent } = require('./content.js')
const { getUser } = require('./user.js')
const ai = require('./general_ai.js')
const { token } = require('./config.js')

const { db, News } = require('./db.js')
const async = require('asyncawait/async')
const await = require('asyncawait/await')

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('This is where the <INSERT_BOT_NAME> lives.')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'wohoobohoosometoken') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
	console.log('==============================================');
	console.log('   INCOMING ')
	console.log('==============================================');

	console.log(req.body.entry[0]);

	console.log('==============================================');

	console.log(req.body.entry[0].messaging[0])

	console.log('==============================================');

	console.log(req.body.entry[0].messaging[0].sender);

	console.log('==============================================');

	console.log(req.body.entry[0].messaging[0].message);

	console.log('==============================================');
	console.log('   END OF TRANSMITION')
	console.log('==============================================');

	
	let contentPromise = getContent();
	let userPromise = getUser(req.body.entry[0].messaging[0].sender.id);

	Promise.all([contentPromise, userPromise]).then(function([content, user]) {
		let messaging_events = req.body.entry[0].messaging
		console.log("Received messaging events:", req.body.entry[0].messaging);
		for (let i = 0; i < messaging_events.length; i++) {
			let event = req.body.entry[0].messaging[i]
			let sender = event.sender.id
			console.log("Message: ", req.body.entry[0].messaging[i]);
			if (event.message && event.message.text) {
				let text = event.message.text
				if (text.match(ai.headlineRegex)) {
					sendTextMessage(sender, "The headline for "+content.date+" is: "+content.headline);
					continue;
				}
				else if (text.match(ai.quoteRegex)) {
					sendTextMessage(sender, "Quote of the day is: \n\n"+content.quote+" \n  -- "+content.quoteAuthor);
					continue;
				}
				else if (text.match(ai.helpRegex)) {
					sendTextMessage(sender, ai.help);
					continue;
				}
				else if (text.match(ai.newsRegex)) {
					sendArticleListMessage(sender, content.articles, content._dbid);
					continue;
				}
				else if (text.match(ai.subscribeRegex)) {
					sendButtonsMessage(sender, 'foo');
					continue;
				}
				else if (text.match(ai.thanksRegex)) {
					sendTextMessage(sender, ai.getMessage('thanks', user))
					continue
				}
				else if (text.match(ai.hahaRegex)) {
					sendTextMessage(sender, ai.getMessage('haha', user))
					continue
				}
				else if (text.match(ai.swearRegex)) {
					sendTextMessage(sender, ai.getMessage('swear', user));
					continue
				}
				else if (text.match(ai.greatRegex)) {
					sendTextMessage(sender, ai.getMessage('great', user));
					continue
				}
				else if (text.match(ai.havariuRegex)) {
					sendTextMessage(sender, ai.getMessage('havariu', user));
					continue
				}
				else if (text.match(ai.greetingRegex)) {
					sendTextMessage(sender, ai.getMessage('greeting', user));
					// TODO if first time show help?
				}
				else if (text.match(ai.byeRegex)) {
					sendTextMessage(sender, ai.getMessage('bye', user));
					continue
				}
				else if (text.match(ai.yesRegex)) {
					sendTextMessage(sender, ai.getMessage('yes', user));
					continue
				}
				else if (text.match(ai.noRegex)) {
					sendTextMessage(sender, ai.getMessage('no', user));
					continue
				}
				else if (text.match(ai.sorryRegex)) {
					sendTextMessage(sender, ai.getMessage('sorry', user));
					continue
				}
				else if (text.match(ai.jokeRegex)) {
					sendTextMessage(sender, ai.getMessage('joke', user));
					continue
				}
				else {
					sendTextMessage(sender, ai.getMessage('else', user));
					continue
				}

			}
			if (event.postback) {
				let text = JSON.stringify(event.postback)
				if(event.postback.payload == 'SUBSCRIPTION_YES') {
					sendButtonsMessage(sender, 'time');
					continue;
				} else if(event.postback.payload == 'SUBSCRIPTION_NO') {
					sendTextMessage(sender, ai.getMessage('no', user));
					continue;
				} else if(event.postback.payload == 'SUBSCRIPTION_7' || event.postback.payload == 'SUBSCRIPTION_8' || event.postback.payload == 'SUBSCRIPTION_9') {
					sendTextMessage(sender, "Great! We will record your preference and keep you updated when it's convenient to you.");
					continue;	
				}
				sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
				continue
			}
		}
	}).catch(function(err) {
		console.log('My dear promises failed: ', err);
		console.log('Something has gone mighty terribly wrong.');
	}).then(function() {
		// (async (function() {
		// 	await (db.disconnect());
		// }))();
		console.log('Bot out.')
		res.sendStatus(200)
	});
})

app.get('/image/', function (req, res) {
	let id = req.query['id'];
	let nid = req.query['nid'];

	if(id == undefined || nid == undefined) {
		res.send('Error, missing details.');
	}

	let image;

	let findPromise = News.where('_id', id).find();
	res.writeHead(200, {'Content-Type': 'image/jpeg'});

	findPromise.then(function(results) {
		// console.log(results[0].attributes[5].leaderImage);
		let image;
		Object.keys(results[0].attributes).forEach(function(a) {
			// console.log(results[0].attributes[a]);
			if(results[0].attributes[a].nid == nid) {
				image = results[0].attributes[a].leaderImage;
				console.log('Found image.');
			}
		})
		res.end(image, 'base64');
	});
})


function sendTextMessage(sender, text) {
	if(text.length > 640) {
		console.log("I have to truncate the original "+text.length+" to fit into 640 chars.");
		text = text.substr(0, 635)+"...";
	}
	let messageData = { text: text }

	console.log("Sending text message: ", text);
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token: token},
		method: 'POST',
		json: {
			recipient: {id: sender},
			message: messageData.length > 640 ? messageData.substr(0, 635)+"..." : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendArticleListMessage(sender, articles, id) {
	console.log("Sending article list message.");
	if(articles.length == 0) {
		console.log('No articles.');
		return;
	}

	let elements = [];
	const imageUrl = "https://yourdomainhere.com/bot/image?";
	let template = {
    	"title": "Title",
        "image_url": "https://yourdomainhere.com/bot/image?",
        "subtitle": "Subtitle",
        "default_action": {
            "type": "web_url",
            "url": "https://yourdomainhere.com/",
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": "https://yourdomainhere.com/"
        },
        "buttons": [
            {
                "title": "View",
                "type": "web_url",
                "url": "https://yourdomainhere.com/more",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": "https://yourdomainhere.com/"
            }
        ]
    };
	articles.slice(0, 4).map(function(art) {
		console.log('Article: '+art.headline);
		console.log('Article image URL: '+imageUrl+"id="+id+"&nid="+art.nid);
		elements.push({
	    	"title": art.headline,
	        "image_url": imageUrl+"id="+id+"&nid="+art.nid,
	        "subtitle": art.body.substr(0, 50)+'...',
	        "default_action": {
	            "type": "web_url",
	            "url": art.shareLink,
	            "messenger_extensions": true,
	            "webview_height_ratio": "tall",
	            "fallback_url": art.shareLink
	        },
	        "buttons": [
	            {
	                "title": "Read now",
	                "type": "web_url",
	                "url": art.shareLink,
	                "messenger_extensions": true,
	                "webview_height_ratio": "tall",
	                "fallback_url": art.shareLink
	            }
	        ]
	    });
	});
	console.log('Sending '+elements.length+' articles.');

	let messageData = {
		"attachment": {
        	"type": "template",
        	"payload": {
            	"template_type": "list",
            	"elements": elements
	        }
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id: sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}


function sendButtonsMessage(sender, type) {
	console.log('Showing buttons type: '+type);
	/*
	subscribeYesOrNo
	*/
	let messageData = {
 		"attachment": {
      		"type":"template",
      		"payload":{
        		"template_type":"button",
        		"text":"Would you like to subscribe for a morning briefing?",
        		"buttons":[
					{
						"type":"postback",
						"title":"Yes, sure.",
						"payload":"SUBSCRIPTION_YES"
					},
					{
						"type":"postback",
						"title":"No, sorry.",
						"payload":"SUBSCRIPTION_NO"
					}
       		 	]	
     		}
		}
	}
	/*
	subscribeTime
	*/
	if(type === 'time') {
		messageData = {
	 		"attachment": {
	      		"type":"template",
	      		"payload":{
	        		"template_type":"button",
	        		"text":"Great to hear that! When would you like to receive the news?",
	        		"buttons":[
						{
							"type":"postback",
							"title":"7 AM",
							"payload":"SUBSCRIPTION_7"
						},
						{
							"type":"postback",
							"title":"8 AM",
							"payload":"SUBSCRIPTION_8"
						},
						{
							"type":"postback",
							"title":"9 AM",
							"payload":"SUBSCRIPTION_9"
						}
	       		 	]	
	     		}
			}
		}		
	}

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id: sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})		
}


// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})