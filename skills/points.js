var request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {

    controller.hears(['-points *'], 'direct_message,direct_mention', function (bot, message) {

        var addOrMinus = message.text.charAt(message.text.length - 1);

        var taggedPeople = message.data.mentionedPeople;

        taggedPeople.forEach(function (personId) {

            database.ref('points').child('personId=' + personId).once('value').then(function (snapshot) {
                var personPoints = 0;
                if (snapshot.val() != null) {
                    personPoints = snapshot.val().points;
                }

                if (personPoints === null) {
                    personPoints = 0;
                }

                if (addOrMinus === "+") {
                    database.ref('points').child('personId=' + personId).set({
                        points: personPoints + 1
                    })
                } else if (addOrMinus === "-") {
                    database.ref('points').child('personId=' + personId).set({
                        points: personPoints - 1
                    })
                }

            })

        });



    })

    controller.hears(['-display'], 'direct_message,direct_mention', function (bot, message) {

        database.ref('points').once('value').then(function (snapshot) {

            var returnString = "";

            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key.substr(9, childSnapshot.key.length - 1);

                request({
                    url: 'https://api.ciscospark.com/v1/people',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': 'Bearer ' + process.env.access_token
                    },
                    qs: {
                        'id': key
                    }
                }, function (error, response, body) {

                    var jsonResponse = JSON.parse(body);
                    console.log("NAME: " + jsonResponse.items[0].displayName);
                    var name = jsonResponse.items[0].displayName;

                    var points = childSnapshot.val().points;

                    if (name != "BamBot") {
                        bot.reply(message, name + " :  " + points);
                    }

                })

            })


        })

    })

}