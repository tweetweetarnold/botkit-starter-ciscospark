var request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {

    controller.hears(['-points *'], 'direct_message,direct_mention', function (bot, message) {

        var addOrMinus = message.text.charAt(message.text.length - 1);

        console.log("addorminus: " + addOrMinus);
        console.log("DATA: " + JSON.stringify(message.data));

        var taggedPeople = message.data.mentionedPeople;
        console.log("TAGGEDPEOPLE: " + taggedPeople)

        taggedPeople.forEach(function (personId) {

            database.ref('points').child('personId=' + personId).once('value').then(function (snapshot) {
                console.log("bammm2")
                // var personPoints = snapshot.val().points;
                console.log("HERE:" + snapshot.val());
                console.log("bammm")
                var personPoints = 0;
                if (snapshot.val() != null) {
                    personPoints = snapshot.val().points;
                }

                console.log("points1: " + personPoints);
                if (personPoints === null) {
                    personPoints = 0;
                }
                console.log("points2: " + personPoints);


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
            console.log("ALLPOINTS:" + JSON.stringify(snapshot.val()));

            var returnString = "";

            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key.substr(9, childSnapshot.key.length - 1);
                console.log("KEY: " + key);

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

                    console.log("BODY: " + body);
                    var jsonResponse = JSON.parse(body);
                    console.log("NAME: " + jsonResponse.items[0].displayName);
                    var name = jsonResponse.items[0].displayName;

                    console.log(name instanceof String);


                    var points = childSnapshot.val().points;
                    console.log("POINTS: " + points);

                    if (name!= "BamBot") {
                        // returnString = returnString + name + " : " + points + " \n ";
                        bot.reply(message, name + " :  " + points);
                    }



                })



            })
            console.log("here");


        })

    })

}