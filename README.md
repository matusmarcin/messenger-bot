# A Messenger Chatbot 🤖

This is a skeleton of a chatbot. (Haha. Pun intended.)

I have once set out to build a Messenger (yes, the Facebook one) chatbot and I have, dare I say, succeeded. The bot takes articles from a news source, presents them to you and jokes a bit too. 

I was fun but it took me about 20 hours so I thought it would be nice to share what I've learned.

It works with a database (MongoDB) to store the articles and to store the user information. Users could then choose whether they want to receive a daily message (much like a push notification but inside the Messenger) and this would be stored in the database.

*Note:* I did build that bot but I cannot exactly just publish it as open source. Hence this generic version of what I've created with the same fun levels.

### Credits

I believe I was inspired by this nice tutorial which helps (and provides code for) the basic communication Facebook expects. So thanks [@jw84](https://github.com/jw84/) Jerry Wang and your [Messenger bot tutorial](https://github.com/jw84/messenger-bot-tutorial)!

Go there for the basics. Come back here once that is not enough. 

[Daniel Kuchta](https://github.com/gama843) helped creating the bot this projects is based on. He added jokes, witty responses and so on. You know, the important stuff.

### TODO

[x] Update the README
[x] Include information on the server-side setup and hosting
[ ] Add screenshots
[ ] Make it works with a free news source and publish it so that people actually believe me

## 🛠 Instructions

`npm install`

### You need MongoDB running

`mongod` should be enough. 

If you don't have it, install like so:

`brew install mongodb`

### Running the script

`node index`

Or any other file:

`node test`

_I use this test file to manually test parts of the bot since deploying it and testing it on a server -is a pain- takes too long and is not a good practice._

### Hosting it

I have [DigitalOcean](https://m.do.co/c/cb8d36856617) with Ubuntu and Apache running. I run the Node server and use proxy setting in vhost file to make it appear under HTTPS domain like Facebook wants it. Here's the vhost file:

```
<IfModule mod_ssl.c>
<VirtualHost *:443>
	ServerName <<yourdomainhere.com>>
	DocumentRoot /var/www/chatbot
	
    <Location /chatbot>
            ProxyPass http://localhost:5000
            ProxyPassReverse http://<yourdomainhere.com>:5000
    </Location>

	# Don't worry about these - Let's Encrypt generates them. Just a reminder you need HTTPS.
	SSLCertificateFile /etc/letsencrypt/live/.../cert.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/.../privkey.pem
	Include /etc/letsencrypt/options-ssl-apache.conf
	SSLCertificateChainFile /etc/letsencrypt/live/.../chain.pem
</VirtualHost>
</IfModule>
```

I use [`pm2`](http://pm2.keymetrics.io) to run it on the server. Nice little tool.

### Continuous delivery

I use [Codeship](https://codeship.com). There are no tests to run so that's easy. Here's the custom script I use to actually move the files to the server and restart the app.

```
rsync -avz -e "ssh" ~/clone/ root@44.55.66.77:/var/www/chatbot/
ssh root@44.55.66.77 'pm2 restart /var/www/chatbot/index.js'
```

Codeship, of course, picks up the changes from master branch of GitHub repo. Or whatever you configure it to.

## Work In Progress

This is very much work in progress. You need to add your own config, tokens, and even the news source. Adjust and update all needed places in code and then you can have a working bot. It is just supposed to be saving you time. However, I'll try to bring this to as close as possible to a functional bot.

Feel free to create issues, pull requests or just tweet at me [@faster](https://www.twitter.com/faster).

Have fun! 🕺

