const request = require('request');

module.exports = function (controller, writeIntoFirebase) {

    controller.hears('-summary', 'direct_message,direct_mention', function (bot, message) {

        // bot.startConversation(message, function (err, convo) {

        bot.reply(message, "Displaying analysis summary for this room...");

        var options = {
            url: 'https://api.ciscospark.com/v1/memberships',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer Y2ZkMDA3ZmItMzBlZi00MWQwLWJlZDktZjkwNzQ3NGQwODJjMjgyNTNlMzItZmU5'
            },
            qs: {
                'roomId': 'Y2lzY29zcGFyazovL3VzL1JPT00vY2NjN2IxYzctZThmNS0zZjc4LWFiYmItZDI0NTEwN2E5NzU2'
            }
        };


        request(options, function (error, response, body) {

            if (!error && response.statusCode == 200) {

                var bodyJson = JSON.parse(body);

                console.log("ROOMID: " + message.data.roomId);
                console.log("bodyJson: " + body);


                bot.reply(message, 'There are ' + (bodyJson.items.length - 1) + ' members in this space! \n\n' +
                    'Top 3 \"noisest\" people are: \n' +
                    '1. Thomson (500 messages)\n' +
                    '2. Arnold (300 messages)\n' +
                    '3. Sing Yuen (100 messages)');


                console.log("JSONCOUNT: " + bodyJson.items.length);



            } else {
                console.log(error);

                bot.say('Something went wrong! Talk to the administrator!');

            }
        })

        // convo.say('Done!');


    })

    // });

}
