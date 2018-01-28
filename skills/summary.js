const request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {


    controller.hears('-summary', 'direct_message,direct_mention', function (bot, message) {

        var translateCountMapResult = function (map) {
            console.log('translateCountMapResult...');
            console.log("translateCountMapResult: " + JSON.stringify(map));
            var result = "";

            for (var myKey in map) {
                result = result + "- <@personEmail:" + myKey + ">, count: " + map[myKey] + "\n";
            }
            bot.reply(message, result);
        }

        var mostTranslatedMapResult = function (map) {
            console.log('mostTranslatedMapResult...');
            console.log("mostTranslatedMapResult: " + JSON.stringify(map));
            var result = "";

            for (var myKey in map) {
                result = result + "- " + lang_list[myKey] + ", count: " + map[myKey] + "\n";
            }
            bot.reply(message, result);

        }



        bot.reply(message, "Displaying analysis summary for this room...");

        var jsonResponse = {};

        request({
            url: 'https://api.ciscospark.com/v1/memberships',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + process.env.access_token
            },
            qs: {
                'roomId': message.data.roomId
            }
        }, function (error, response, body) {

            if (!error && response.statusCode == 200) {

                jsonResponse = JSON.parse(body);

                console.log("ROOMID: " + message.data.roomId);

                var translationCount = 0;
                var translateCountMap = {};
                var mostTranslatedLangMap = {};

                database.ref('history-translate').child('roomId=' + message.data.roomId).orderByKey()
                    .once('value').then(function (snapshot) {
                        // console.log("VALUE2: " + Object.keys(snapshot.val()).length);
                        console.log("VALUE3: " + snapshot.numChildren());
                        translationCount = snapshot.numChildren();

                        bot.reply(message, 'Translation has been carried out ' + translationCount + ' times!');


                        snapshot.forEach(function (childSnapshot) {
                            console.log('KEY: ' + childSnapshot.key);

                            var childBody = childSnapshot.val();
                            console.log('CHILD: ' + JSON.stringify(childBody));

                            console.log("personEmail: " + childBody.personEmail);

                            console.log("exists : " + translateCountMap[childBody.personEmail]);

                            if (translateCountMap[childBody.personEmail] == undefined) {
                                translateCountMap[childBody.personEmail] = 0;
                            }
                            if (mostTranslatedLangMap[childBody.langTo] == undefined) {
                                mostTranslatedLangMap[childBody.langTo] = 0;
                            }


                            translateCountMap[childBody.personEmail] = translateCountMap[childBody.personEmail] + 1;
                            mostTranslatedLangMap[childBody.langTo] = mostTranslatedLangMap[childBody.langTo] + 1;

                            console.log('TRANSLATE COUNT2: ' + JSON.stringify(translateCountMap));
                            console.log("MOST TRANSLATED LANGMAP: " + JSON.stringify(mostTranslatedLangMap));

                        })

                        translateCountMapResult(translateCountMap);
                        mostTranslatedMapResult(mostTranslatedLangMap);

                    })


            } else {
                console.log(error);
                bot.say('Something went wrong! Talk to the administrator!');
            }

            bot.reply(message, 'There are ' + (jsonResponse.items.length - 1) + ' members in this space!');
            console.log("NUM OF PEOPLE: " + jsonResponse.items.length);

        })

    })


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

}
