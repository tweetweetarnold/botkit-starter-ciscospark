const request = require('request');

module.exports = function (controller, writeIntoFirebase) {

    controller.hears('-summary', 'direct_message,direct_mention', function (bot, message) {

        // bot.startConversation(message, function (err, convo) {

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

            bot.reply(message, 'There are ' + (jsonResponse.items.length - 1) + ' members in this space! \n\n' +
                'Top 3 \"noisest\" people are: \n' +
                '1. Thomson (500 messages)\n' +
                '2. Arnold (300 messages)\n' +
                '3. Sing Yuen (100 messages)');
            console.log("NUM OF PEOPLE: " + jsonResponse.items.length);


            




        })

        // convo.say('Done!');


    })

    // });

}
