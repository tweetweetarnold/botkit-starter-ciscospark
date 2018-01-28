const request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {



    controller.hears('-summary', 'direct_message,direct_mention', function (bot, message) {

        var translateCountMapResult = function (map) {
            console.log('translateCountMapResult...');
            var returnString = "";
            for (var myKey in map) {
                returnString = returnString + "- <@personEmail:" + myKey + ">, count:" + map[myKey] + "\n";
            }
            bot.reply(message, returnString);
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
                // console.log("bodyJson: " + body);
            } else {
                console.log(error);
                bot.say('Something went wrong! Talk to the administrator!');
            }

            bot.reply(message, 'There are ' + (jsonResponse.items.length - 1) + ' members in this space!');
            console.log("NUM OF PEOPLE: " + jsonResponse.items.length);


            var translationCount = 0;
            var translateCountMap = {};
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
                            translateCountMap[childBody.personEmail] = 1;
                        } else {
                            translateCountMap[childBody.personEmail] = translateCountMap[childBody.personEmail] + 1;
                        }

                        // translateCountMap[childBody.personEmail]++;
                        // console.log('TRANSLATE COUNT: ' + translateCountMap);
                        console.log('TRANSLATE COUNT2: ' + JSON.stringify(translateCountMap));
                        // bot.reply(message, JSON.stringify(translateCountMap));


                    })

                    translateCountMapResult(translateCountMap);
                    // bot.reply(message, translateCountMap);
                    // bot.reply(message, 'done');

                })




        })



    })

}
