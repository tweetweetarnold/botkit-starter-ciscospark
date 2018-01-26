var Botkit = require('botkit');
var env = require('node-env-file');
env(__dirname + '/.env');

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

var controller = Botkit.sparkbot({
    debug: true,
    log: true,
    public_address: process.env.public_address,
    ciscospark_access_token: process.env.access_token,
    secret: process.env.secret,
});

var firebaseConfig = {
    // apiKey: "apiKey",
    // authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://bambot-36f9f.firebaseio.com/",
    // storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();


var writeIntoFirebase = function (message) {
    database.ref('/history-chat').child('roomId=' + message.data.roomId).push().set({
        messageId: message.data.id,
        created: message.data.created,
        text: message.text,
        personEmail: message.data.personEmail,
    });
};

var bot = controller.spawn({
});


// Setting up web server
controller.setupWebserver(process.env.PORT || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("SPARK: Webhooks set up!");
    });
});


// retrieving skills
var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    require("./skills/" + file)(controller, writeIntoFirebase, database);
});

//
// ************************ Setup config ends here ************************
//



//
// ************************ General Methods begin here ************************
//
controller.hears('help', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, 'Hi, ' + intro_msg);
});


controller.hears('-console', 'direct_message,direct_mention', function (bot, message) {
    console.log(message);
    bot.reply(message, "done");
});

controller.on('direct_mention', function (bot, message) {
    console.log(JSON.stringify(message));
    bot.reply(message, 'You mentioned me and said, "' + message.text + '"');
});

controller.on('direct_message', function (bot, message) {
    bot.reply(message, 'I got your private message. You said, "' + message.text + '"');
});

controller.on('bot_space_join', function (bot, message) {
    bot.reply(message, 'Hi, ' + intro_msg);
});

controller.on('user_space_join', function (bot, message) {
    bot.reply(message, 'Welcome <@personEmail:' + message.user + '>! ' + intro_msg);
});

controller.hears('is (.*) cool?', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "no");
});

//
// ************************ General Methods end here ************************
//


var intro_msg = 'I am **Bambot**! I will be your assistant to translate foreign languages quickly like BAM! I know a few languages and will do my best to help you! I am still learning new features to serve you better, but at the moment, these are the few things I can do! \n- Greet you back! Try `hello`\n- BAM back! Try `bam`\n- Show languages I know. Try `-show`\n- Set translation languages. Try translating English to French! `-lang en-fr`\n- Translate. Try `-t i love chicken`\n\nIn a space, please tag me at the start so that I know you are talking to me!\nI have also recently been awarded the ThomsonNgo Seal of Approval! Whee!';

