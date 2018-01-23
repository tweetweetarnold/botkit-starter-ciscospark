const https = require('https');

module.exports = function (controller) {

    var room_lang = {};
    const baseUrl = 'https://translate.yandex.net/api/v1.5/tr.json/';
    const key = 'trnsl.1.1.20180117T004805Z.b129a8b3ea79d22f.b7a43b194303543b45ded23a0b6890c124dc205e';


    // show list of translation languages supported
    controller.hears('-show', 'direct_message,direct_mention', function (bot, message) {
        bot.reply(message, lang_list2);
    });

    // detect language
    controller.hears('-dt *', 'direct_message,direct_mention', function (bot, message) {

        const postData = querystring.stringify({
            'msg': 'Hello World!'
        });

        const options = {
            hostname: 'translate.yandex.net',
            port: 80,
            path: '//api/v1.5/tr.json/detect?hint=en,de&key=' + key,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        console.log('wow');

        https.request(options, (res) => {
            console.log("its here");
            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });

            res.on('end', () => {
                console.log('No more data in response.');
            });
        }).on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            console.log(e);
        }).end();

        // write data to request body
        // req.write(postData);
        // req.end();

    });


    // set language to translate to. eg. translate to mandarin
    controller.hears('-lang *', 'direct_message,direct_mention', function (bot, message) {

        var personEmail = message.data.personEmail;
        var this_roomId = message.data.roomId;
        var langCode_str = message.text.substr(message.text.indexOf(" ") + 1);

        if (langCode_str.length != 5) {
            bot.reply(message, 'That is not a valid translation! Please enter in this format `-lang en-fr`. Enter `-show` to see the list of supported languages!');
            return;
        }

        var langCode_toChange = langCode_str.substr(langCode_str.indexOf("-") + 1);;
        var langCode_from = langCode_str.substr(0, 2);

        console.log("from: " + langCode_from);
        console.log("to : " + langCode_toChange);

        if (lang_list[langCode_toChange] === undefined || lang_list[langCode_from] === undefined) {
            bot.reply(message, 'That is not a valid translation! Please enter in this format `-lang en-fr`. Enter `-show` to see the list of supported languages!');
        } else {
            // var langCode_toTranslate = langCode_toChange; // update translate 

            // room_lang[this_roomId] = langCode_str;
            // room_lang[this_roomId] = { personEmail : langCode_str };
            console.log(personEmail);
            console.log(langCode_str);

            if (room_lang[this_roomId] === undefined) {
                var b = {};
                b[personEmail] = langCode_str;
                console.log("this is b");
                console.log(b);

                room_lang[this_roomId] = b;
            } else {
                var b = room_lang[this_roomId];
                b[personEmail] = langCode_str;
            }


            console.log(room_lang);




            bot.reply(message, 'Ok! **' + lang_list[langCode_from] + '** will be translated to **' + lang_list[langCode_toChange] + '** for <@personEmail:' + personEmail + '>!');
        }
    });


    // to translate text 
    controller.hears('-t *', 'direct_message,direct_mention', function (bot, message) {

        console.log("translating: " + message.text);
        // console.log("query: " + message.text.substr(10));
        // console.log(JSON.stringify(message));


        var personEmail = message.data.personEmail;
        const feature = 'translate';
        var this_roomId = message.data.roomId;
        var query = message.text.substr(message.text.indexOf(" ") + 1);

        var lang = room_lang[this_roomId][personEmail];
        console.log("this is lang");
        console.log(lang);

        if (lang === undefined) {
            bot.reply(message, "Language not set! See the list of supported languages using `-show`");
            return;
        }

        console.log("query : " + query);

        var req = baseUrl + feature + "?key=" + key + "&lang=" + lang + "&text=" + query;

        bot.reply(message, "translating " + query + "...");
        console.log(req);

        https.get(req, (resp) => {
            let data = '';
            resp.setEncoding('utf8');

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log("headers: " + JSON.stringify(resp.headers));
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