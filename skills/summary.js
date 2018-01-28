const request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {

    controller.hears('-summary', 'direct_message,direct_mention', function (bot, message) {

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
                console.log("bodyJson: " + body);
            } else {
                console.log(error);
                bot.say('Something went wrong! Talk to the administrator!');
            }

            bot.reply(message, 'There are ' + (jsonResponse.items.length - 1) + ' members in this space!');
            console.log("NUM OF PEOPLE: " + jsonResponse.items.length);


            var translationCount = 0;
            database.ref('history-translate').child('roomId=' + message.data.roomId).orderByKey()
                .once('value').then(function (snapshot) {
                    console.log("VALUE2: " + Object.keys(snapshot.val()).length);
                    translationCount = Object.keys(snapshot.val()).length;

                    bot.reply(message, 'Translation has been carried out ' + translationCount + ' times!');
                })


        })



    })

}
