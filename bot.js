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
console.log("FIREBASE: Initialized!");
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

controller.hears('^-lang-help$', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, lang_help);
});

controller.hears('^-game-help$', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, game_help);
});


controller.hears('-console', 'direct_message,direct_mention', function (bot, message) {
    console.log(message);
    bot.reply(message, "done");
});

controller.on('direct_mention', function (bot, message) {
    bot.reply(message, 'You mentioned me and said, "' + message.text + '"');
});

controller.on('direct_message', function (bot, message) {
    bot.reply(message, '# I did not understand that! I am #Grumpy');
});

controller.on('bot_space_join', function (bot, message) {
    bot.reply(message, 'Hello! I am **BamBot**! To see more info about me, type `help` ');
});

controller.on('user_space_join', function (bot, message) {
    bot.reply(message, 'Welcome <@personEmail:' + message.user + '>! I am **BamBot**! To see more info about me, type `help` ');
});

controller.hears('is (.*) cool?', 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "no");
});

//
// ************************ General Methods end here ************************
//


var intro_msg = 'I am **BamBot**! I am your new and energetic companion that loves to have fun! I speak multiple languages and can do many other things. I can do the following: \n- Greet you back! Try `hello`\n- BAM back! Try `bam`\n- Do translation! Try `-lang-help` to learn more! \n Play a game! Try `-game-help` to learn more!\n\nIn a space, please tag me at the start so that I know you are talking to me! Whee!';

var lang_help = 'I can speak and translate multiple languages! \n-Show languages I know. Try `-show`\n- Set translation languages. Try translating English to French! `-lang en-fr`\n- Translate. Try `-t i love chicken`\n- To see a summary of all the translation I have done. Try `-summary`'

var game_help = '- Display points: `-dp` \n- Add or minus points: -p @Person (-/+) #reason \n- Challenge someone `-challenge @Person`'

var lang_list = {
    "af": "Afrikaans",
    "am": "Amharic",
    "ar": "Arabic",
    "az": "Azerbaijani",
    "ba": "Bashkir",
    "be": "Belarusian",
    "bg": "Bulgarian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "cs": "Czech",
    "cy": "Welsh",
    "da": "Danish",
    "de": "German",
    "el": "Greek",
    "emj": "Emoji",
    "en": "English",
    "eo": "Esperanto",
    "es": "Spanish",
    "et": "Estonian",
    "eu": "Basque",
    "fa": "Persian",
    "fi": "Finnish",
    "fr": "French",
    "ga": "Irish",
    "gd": "Scottish Gaelic",
    "gl": "Galician",
    "gu": "Gujarati",
    "he": "Hebrew",
    "hi": "Hindi",
    "hr": "Croatian",
    "ht": "Haitian",
    "hu": "Hungarian",
    "hy": "Armenian",
    "id": "Indonesian",
    "is": "Icelandic",
    "it": "Italian",
    "ja": "Japanese",
    "jv": "Javanese",
    "ka": "Georgian",
    "kk": "Kazakh",
    "km": "Khmer",
    "kn": "Kannada",
    "ko": "Korean",
    "ky": "Kyrgyz",
    "la": "Latin",
    "lb": "Luxembourgish",
    "lo": "Lao",
    "lt": "Lithuanian",
    "lv": "Latvian",
    "mg": "Malagasy",
    "mhr": "Mari",
    "mi": "Maori",
    "mk": "Macedonian",
    "ml": "Malayalam",
    "mn": "Mongolian",
    "mr": "Marathi",
    "mrj": "Hill Mari",
    "ms": "Malay",
    "mt": "Maltese",
    "my": "Burmese",
    "ne": "Nepali",
    "nl": "Dutch",
    "no": "Norwegian",
    "pa": "Punjabi",
    "pap": "Papiamento",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "si": "Sinhalese",
    "sk": "Slovak",
    "sl": "Slovenian",
    "sq": "Albanian",
    "sr": "Serbian",
    "su": "Sundanese",
    "sv": "Swedish",
    "sw": "Swahili",
    "ta": "Tamil",
    "te": "Telugu",
    "tg": "Tajik",
    "th": "Thai",
    "tl": "Tagalog",
    "tr": "Turkish",
    "tt": "Tatar",
    "udm": "Udmurt",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "zh": "Chinese"
};