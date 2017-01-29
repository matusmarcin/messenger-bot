'use strict'

const greetingRegex = new RegExp("hi|hello|ciao", "gi");
const headlineRegex = new RegExp("headline", "gi");
const helpRegex = new RegExp("help|tutorial|instructions|how do i", "gi");
const quoteRegex = new RegExp("quote|wisdom", "gi");
const newsRegex = new RegExp("news", "gi");
const creatorsRegex = new RegExp("creat", "g");
const thanksRegex = new RegExp("thank", "gi");
const hahaRegex = new RegExp("haha|huh|heh", "gi");
const swearRegex = new RegExp("trump|donald", "gi");
const greatRegex = new RegExp("you are great|you are cool|this is cool|this is great", "gi");
const havariuRegex = new RegExp("how are you|how are u|how are u", "gi");
const byeRegex = new RegExp("bye|have a nice day|see you soon|i will get back to you|see you later", "gi");
const morningRegex = new RegExp("morning", "gi");
const yesRegex = new RegExp("yes", "gi");
const stillHereRegex = new RegExp("are you still here|are you u still here", "gi");
const noRegex = new RegExp("^no$", "gi");
const subscribeRegex = new RegExp("subscri", "gi");
const sorryRegex = new RegExp("sorry", "gi");
const jokeRegex = new RegExp("joke", "gi");

const thanksReply = ["It's my pleasure to serve you FIRST_NAME.","You are welcome.","It's my pleasure to help.","Anytime. That's what I'm here for.","All right. What's up next on our agenda?","For sure.","Glad to hear it!","No problem. I'm here for you if something else is needed.","I want to be the best assistant possible. If you can think of ways for me to improve, I'd love to hear your feedback.","Of course! Let me know what I should do next."];
const hahaReply = ["Not many assistants have my sense of humor. I hope you appreciate that FIRST_NAME.","Jokes included free of charge.","You have a great laugh FIRST_NAME.","Thought you'd like that.","See? Now we're having fun.","Computers are getting smarter all the time. Just look at me."];
const havariuReply = ["Couldn't be better.","I'm fine, thanks.","A bit tired, it's been a busy day.","Actually, I broke up with Siri yesterday. It was my fault. I'm feeling awful.","Wonderful as always. Thanks for asking."];
const greetingReply = ["Hi, how can I help?","Hi FIRST_NAME","Hello FIRST_NAME"];
const greatReply = ["I like you too FIRST_NAME. You're one of my favorite people to chat with.","I like you too FIRST_NAME. You're a lot of fun to talk to.","I sure am. I'm always available to assist you in any way I can."];
const creatorsReply = ["Someone smart enough to create a top notch bot like me. Namely, Matus Marcin and Daniel Kuchta. Awesome guys. You should vote for them in the poll."];
const elseReply = ["Uh. I am a just chat bot. Sure, I am the great <INSERT_BOT_NAME>, I know a lot about economics, world politics, business, finance and science, but I am afraid I don't really get what you are trying to tell me.","I think this is beyond my current capabilities, but I am learning fast.","I'm not certain about that.","I might need some time to figure that out.","That's a subject that's a little outside my range of knowledge."];
const byeReply = ["Take care!","Till next time!","Talk to you soon!","See you soon!","Take care!","I think this is the first time we've had a chance to really talk."];
const morningReply = ["Good morning to you as well!","Gladly. What's on your mind?"];
const swearReply = ["That's not very cool. I thought you were friendlier than that.","Hey FIRST_NAME! No need to be so rude. That's not very nice. Don't you want to talk to me anymore?"];
const yesReply = ["I knew we'd agree on that FIRST_NAME.","Glad to hear it!","All right FIRST_NAME. What's up next on our agenda FIRST_NAME?","Got it.","Wonderful!","Awesome FIRST_NAME!"];
const noReply = ["Was that not what you wanted ? I'm sorry if I misunderstood.","How about a pillow fight?! It looks fun.","I'm trying my best FIRST_NAME!","No big deal. I won't hold a grudge.","Hmm, I thought you'd like that, actually.","Okay then.","All right. Waiting for your next question!"];
const sorryReply = ["There is nothing to be sorry about FIRST_NAME."];
const jokeReply = ["Apparently, I snore so loudly it scares everyone in the car I'm driving.","My girlfriend and I often laugh about how competitive we are. But I laugh more.","If you are feeling cold, you should sit in the corner, its 90 degrees.","My dog used to chase people on a bike a lot. It got so bad, finally I had to take his bike away.","A German walks into a bar and asks for a martini. The bartender asks, “Dry?” The German replies, “Nein, just one.”"]

const help = "I am <INSERT_BOT_NAME>. I can give you the latest news and keep you updated. You can ask for 'news', 'subscribe', quote' or just today's 'headline'. You can also just have a chat with me and test me out.";

function insertName(msg, name) {
	if(name == undefined) {
		name = '';
	}
	return msg.replace(' FIRST_NAME', ' '+name);
}

const aiMessages = {
	thanksReply: thanksReply,
	hahaReply: hahaReply,
	havariuReply: havariuReply,
	greetingReply: greetingReply,
	greatReply: greatReply,
	creatorsReply: creatorsReply,
	elseReply: elseReply,
	byeReply: byeReply,
	morningReply: morningReply,
	swearReply: swearReply,
	yesReply: yesReply,
	noReply: noReply,
	sorryReply: sorryReply,
	jokeReply: jokeReply
}

function getMessage(type, user) {
	let msgs = aiMessages[type+'Reply'];
	if(msgs == undefined) {
		msgs = ['Hi there'];
	}
	return insertName(getRandMessage(msgs), user.first_name);
}

function getRandMessage(arr) {
	let key = Math.floor(Math.random(0)*arr.length);
	return arr[key];
}

const ai = {
	greetingRegex: greetingRegex,
	newsRegex: newsRegex,
	headlineRegex: headlineRegex,
	helpRegex: helpRegex,
	quoteRegex: quoteRegex,
	creatorsRegex: creatorsRegex,
	thanksRegex: thanksRegex,
	hahaRegex: hahaRegex,
	swearRegex: swearRegex,
	greatRegex: greatRegex,
	havariuRegex: havariuRegex,
	byeRegex: byeRegex,
	morningRegex: morningRegex,
	yesRegex: yesRegex,
	stillHereRegex: stillHereRegex,
	noRegex: noRegex,
	sorryRegex: sorryRegex,
	subscribeRegex: subscribeRegex,	
	jokeRegex: jokeRegex,
	help: help,
	getMessage: getMessage
}

module.exports = ai;