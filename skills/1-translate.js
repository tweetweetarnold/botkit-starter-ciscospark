const https = require('https');

module.exports = function (controller) {

    var room_lang = {};

    controller.hears('-show', 'direct_message,direct_mention', function (bot, message) {
        bot.reply(message, lang_list2);
    });

    controller.hears('-lang *', 'direct_message,direct_mention', function (bot, message) {
        var langCode_toChange = message.text.substr(message.text.indexOf(" ") + 1);
        var this_roomId = message.data.roomId;
    
        if (lang_list[langCode_toChange] === undefined) {
            bot.reply(message, 'This is not a valid language! Try `-show` to see the list of supported languages!');
        } else {
            // var langCode_toTranslate = langCode_toChange; // update translate 
            room_lang[this_roomId] = langCode_toChange;
    
            // console.log("this_roomId: " + this_roomId);
            // console.log("roomlang: " + JSON.stringify(room_lang));
    
            bot.reply(message, 'Language is changed to **' + lang_list[langCode_toChange] + '**');
        }
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
        var this_roomId = message.data.roomId;
        var query = message.text.substr(message.text.indexOf(" ") + 1);
        var lang = room_lang[this_roomId];

        if (lang === undefined) {
            bot.reply(message, "Language not set! See the list of supported languages using `-show`");
            return;
        }

        // console.log("roomlang: " + JSON.stringify(room_lang));
        // console.log("roomID: " + message.data.roomId);
        // console.log("lang: " + lang);

        var req = baseUrl + "key=" + key + "&lang=" + lang + "&text=" + query;

        bot.reply(message, "translating " + query + "...");

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
                        bot.reply(message, toJson.text[0]);
                    } else {
                        bot.reply(message, 'Something went wrong! **Bambot** is unhappy! Code: ' + toJson.code + ". Message: " + toJson.message);
                    }
                } catch (err) {
                    console.log("Error: " + err.message);

                    var message_options = [
                        'What nonsense was that? That\'s just rude! ',
                        'Don\'t get me to do impossible things! Mutual respect goes both ways! ',
                        'What is that seriously..? ',
                        'That translation is way above my pay grade. ',
                        'That\'s too hard! '
                    ]
                    var random_index = Math.floor(Math.random() * message_options.length)
                    var chosen_message = message_options[random_index]

                    bot.reply(message, chosen_message + 'Change your text and try again!');
                }

            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });

    });


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


var lang_list2 = '-   af   =   Afrikaans  \n-   sq   =   Albanian  \n-   am   =   Amharic  \n-   ar   =   Arabic  \n-   hy   =   Armenian  \n-   az   =   Azerbaijan  \n-   ba   =   Bashkir  \n-   eu   =   Basque  \n-   be   =   Belarusian  \n-   bn   =   Bengali  \n-   bs   =   Bosnian  \n-   bg   =   Bulgarian  \n-   my   =   Burmese  \n-   ca   =   Catalan  \n-   ceb   =   Cebuano  \n-   zh   =   Chinese  \n-   hr   =   oatian  \n-   cs   =   Czech  \n-   da   =   Danish  \n-   nl   =   Dutch  \n-   en   =   English  \n-   eo   =   Esperanto  \n-   et   =   Estonian  \n-   fi   =   Finnish  \n-   fr   =   French  \n-   gl   =   Galician  \n-   ka   =   Georgian  \n-   de   =   German  \n-   el   =   Greek  \n-   gu   =   Gujarati  \n-   ht   =   Haitian (eole)  \n-   he   =   Hebrew  \n-   mrj   =   Hill Mari  \n-   hi   =   Hindi  \n-   hu   =   Hungarian  \n-   is   =   Icelandic  \n-   id   =   Indonesian  \n-   ga   =   Irish  \n-   it   =   Italian  \n-   ja   =   Japanese  \n-   jv   =   Javanese  \n-   kn   =   Kannada  \n-   kk   =   Kazakh  \n-   km   =   Khmer  \n-   ko   =   Korean  \n-   ky   =   Kyrgyz  \n-   lo   =   Laotian  \n-   la   =   Latin  \n-   lv   =   Latvian  \n-   lt   =   Lithuanian  \n-   lb   =   Luxembourgish  \n-   mk   =   Macedonian  \n-   mg   =   Malagasy  \n-   ms   =   Malay  \n-   ml   =   Malayalam  \n-   mt   =   Maltese  \n-   mi   =   Maori  \n-   mr   =   Marathi  \n-   mhr   =   Mari  \n-   mn   =   Mongolian  \n-   ne   =   Nepali  \n-   no   =   Norwegian  \n-   pap   =   Papiamento  \n-   fa   =   Persian  \n-   pl   =   Polish  \n-   pt   =   Portuguese  \n-   pa   =   Punjabi  \n-   ro   =   Romanian  \n-   ru   =   Russian  \n-   gd   =   Scottish  \n-   sr   =   Serbian  \n-   si   =   Sinhala  \n-   sk   =   Slovakian  \n-   sl   =   Slovenian  \n-   es   =   Spanish  \n-   su   =   Sundanese  \n-   sw   =   Swahili  \n-   sv   =   Swedish  \n-   tl   =   Tagalog  \n-   tg   =   Tajik  \n-   ta   =   Tamil  \n-   tt   =   Tatar  \n-   te   =   Telugu  \n-   th   =   Thai  \n-   tr   =   Turkish  \n-   udm   =   Udmurt  \n-   uk   =   Ukrainian  \n-   ur   =   Urdu  \n-   uz   =   Uzbek  \n-   vi   =   Vietnamese  \n-   cy   =   Welsh  \n-   xh   =   Xhosa  \n-   yi   =   Yiddish  \n';



}