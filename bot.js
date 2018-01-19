// import { error } from 'util';

// var Botkit = require('./lib/Botkit.js');
var Botkit = require('botkit');

const https = require('https');
var env = require('node-env-file');
env(__dirname + '/.env');

var controller = Botkit.sparkbot({
    debug: true,
    log: true,
    public_address: process.env.public_address,
    ciscospark_access_token: process.env.access_token,
    secret: process.env.secret
});

var lang_to_translate = "id";

var bot = controller.spawn({
});


controller.setupWebserver(process.env.PORT || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("SPARK: Webhooks set up!");
    });
});


controller.hears('help', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, 'Hello, I am Bambot! I do things like BAM!\n\nCurrently there are a few things I can do:\n- Hello\n- Bam\n- Help\n- To change translation language “-lang zh”\n- To translate “-t ducks"');
});

controller.on('direct_mention', function (bot, message) {
    bot.reply(message, 'You mentioned me and said, "' + message.text + '"');
});

controller.on('direct_message', function (bot, message) {
    bot.reply(message, 'I got your private message. You said, "' + message.text + '"');
});

controller.on('user_space_join', function (bot, message) {
    bot.reply(message, 'Welcome <@personEmail:' + message.user + '>!');
});

controller.hears('is (.*) cool?', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "no");
});

controller.hears('-lang *', 'direct_message,direct_mention', function (bot, message) {
    lang_to_translate = message.text.substr(message.text.indexOf(" ") + 1)
    bot.reply(message, 'Language is changed!');
});

controller.hears('-t *', 'direct_message,direct_mention', function (bot, message) {

    // console.log(message.data.personEmail);
    if (message.data.personEmail == 'thomngo@cisco.com') {
        bot.reply(message, '<@personEmail:thomngo@cisco.com>! Please dont abuse me ok! I am fragile.');
        // return;
    }

    console.log("translating.......................");
    console.log("message: " + message.text);
    // console.log("query: " + message.text.substr(10));

    const baseUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';
    const key = 'trnsl.1.1.20180117T004805Z.b129a8b3ea79d22f.b7a43b194303543b45ded23a0b6890c124dc205e';
    var lang = lang_to_translate;
    var query = message.text.substr(message.text.indexOf(" ") + 1);

    var req = baseUrl + "key=" + key + "&lang=" + lang + "&text=" + query;

    bot.reply(message, "translating \"" + query + "\"...");

    https.get(req, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try {
                var toJson = JSON.parse(data);

                if (toJson.code == 200) {
                    console.log("data: " + toJson.text);
                    // console.log(JSON.parse(data).explanation);
                    bot.reply(message, JSON.stringify(toJson.text[0]));
                } else {
                    bot.reply(message, 'Something went wrong! Bambot is unhappy! Code: ' + toJson.code + ". Message: " + toJson.message);
                }
            } catch (err) {
                console.log("Error: " + err.message);
                bot.reply(message, 'You must have tried some weird text. I cannot help you! Bambot is unhappy!');
            }

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

});


controller.hears(['hello', 'hey', 'hi', 'aloha'], 'direct_message,direct_mention', function (bot, message) {
    var message_options = [
        "Hello!",
        "Hello <@personEmail:" + message.user + ">!",
        "Yes, I'm listening...",
        "Hi! How can I help?",
        "Hey, what's up!",
        "Yes, tell me! What are you looking for?",
        "What's up?",
        "Yuhoo!",
        "你好！"
    ]
    var random_index = Math.floor(Math.random() * message_options.length)
    var chosen_message = message_options[random_index]

    bot.reply(message, chosen_message)
});

controller.hears('bam', 'direct_message,direct_mention', function (bot, message) {
    var message_options = [
        "Did I just hear a bam? BAM!!!!",
        "Woah! You like bam? Me too!",
        "You BAM! I BAM! WE BAM!",
        'BAAAAAAAAAAAAAAAMMMMMMMMMMMMMMMMMMM!',
        'BAM BAM BAM',
        'Boom'
    ]
    var random_index = Math.floor(Math.random() * message_options.length)
    var chosen_message = message_options[random_index]

    bot.reply(message, chosen_message)
});

