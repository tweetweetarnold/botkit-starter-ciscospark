var Botkit = require('botkit');

var env = require('node-env-file');
env(__dirname + '/.env');

var controller = Botkit.sparkbot({
    debug: true,
    log: true,
    public_address: process.env.public_address,
    ciscospark_access_token: process.env.access_token,
    secret: process.env.secret
});

// var langCode_toTranslate = "en";

var bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("SPARK: Webhooks set up!");
    });
});

// var room_lang = {};

// try to get skills
console.log("getting skills...");
var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    require("./skills/" + file)(controller);
});
console.log("i have skills!");


//
// ******** Methods begin here ********
//

controller.hears('help', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, 'Hi, ' + intro_msg);
});

controller.on('direct_mention', function (bot, message) {
    bot.reply(message, 'You mentioned me and said, "' + message.text + '"');
});

controller.on('direct_message', function (bot, message) {
    bot.reply(message, 'I got your private message. You said, "' + message.text + '"');
});

controller.on('user_space_join', function (bot, message) {
    bot.reply(message, 'Welcome <@personEmail:' + message.user + '>! ' + intro_msg);
});

controller.hears('is (.*) cool?', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "no");
});


var intro_msg = 'I am **Bambot**! I will be your assistant to translate foreign languages quickly like BAM! I know a few languages and will do my best to help you! I am still learning new features to serve you better, but at the moment, these are the few things I can do! \n- Greet you back! Try `hello`\n- BAM back! Try `bam`\n- Show languages I know. Try `-show`\n- Set translation language. Try `-lang zh`\n- Translate. Try `-t i love chicken`\n\nIn a space, please tag me at the start so that I know you are talking to me!\nI have also recently been awarded the ThomsonNgo Seal of Approval! Whee!';

