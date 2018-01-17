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


var bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("SPARK: Webhooks set up!");
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
        "You BAM! I BAM! WE BAM!"
    ]
    var random_index = Math.floor(Math.random() * message_options.length)
    var chosen_message = message_options[random_index]

    bot.reply(message, chosen_message)
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

controller.hears('is Sing cool?', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "no");
});

controller.hears('translate', 'direct_message,direct_mention', function (bot, message) {

    console.log("running.......................");
    https.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20180117T004805Z.b129a8b3ea79d22f.b7a43b194303543b45ded23a0b6890c124dc205e&text=hello my friend&lang=zh', (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var toJson = JSON.parse(data);
            console.log("data: " + toJson.text);
            // console.log(JSON.parse(data).explanation);
            bot.reply(message, JSON.stringify(toJson.text[0]));
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

});


controller.hears('baba', 'direct_message,direct_mention', function (bot, message) {

    console.log("running2.......................");

    const options = {
        hostname: 'https://translate.yandex.net',
        path: '/api/v1.5/tr.json/translate?key=trnsl.1.1.20180117T004805Z.b129a8b3ea79d22f.b7a43b194303543b45ded23a0b6890c124dc205e&text=hello&lang=zh',
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var toJson = JSON.parse(data);
            console.log("data: " + toJson.text);
            // console.log(JSON.parse(data).explanation);
            bot.reply(message, JSON.stringify(toJson.text[0]));
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });
    req.end();



});