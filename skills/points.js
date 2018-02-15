const request = require('request');
var m = require('../req/myFunctions.js')

module.exports = function (controller, database) {


    controller.hears(['-p *'], 'direct_message,direct_mention', function (bot, message) {

        var addOrMinus = message.text.charAt(message.text.length - 1);
        var arr = message.text.toString().split(" ");

        addOrMinus = arr[2];
        var startIndex = message.text.indexOf("#") + 1;

        if (startIndex == 0) {
            bot.reply(message, "You did not add a reason!");
            return;
        }
        var thisReason = message.text.substr(startIndex, message.text.length - 1);

        var taggedPeople = message.data.mentionedPeople;

        taggedPeople.forEach(function (personId) {

            if (personId != 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS82NTAzYzgwNC1lMDJhLTRhMGYtYjczYi02NDc2NThiNmNjYzk') {
                var personRef = database.ref('ranking').child('personId=' + personId);

                personRef.once('value').then(function (snapshot) {

                    if (addOrMinus === "+") {
                        m.updatePoints(personId, 1, database)
                    } else if (addOrMinus === "-") {
                        m.updatePoints(personId, -1, database)
                    }

                })
            }

        });
        // bot.reply(message, "Understood! Points added!")

    })


    controller.hears(['^-dp$'], 'direct_message,direct_mention', function (bot, message) {
        console.log("LOG: In function -dp")

        database.ref('ranking').orderByChild('points').once('value').then(function (snapshot) {

            var displayNamePromiseArr = [];
            var pointsArr = [];

            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key.substr(9, childSnapshot.key.length - 1);
                var points = childSnapshot.val().points;

                pointsArr.push(points)

                var displayNamePromise = m.getDisplayName(key);
                displayNamePromiseArr.push(displayNamePromise);
            })

            Promise.all(displayNamePromiseArr).then(function (result) {
                // building messages
                var returnString = "";
                for (var i = pointsArr.length - 1; i >= 0; i--) {
                    returnString = returnString + "- " + pointsArr[i] + " : " + result[i] + "\n"
                }

                bot.reply(message, returnString);

            })

        })

    })



    controller.hears(['-challenge *'], 'direct_message,direct_mention', function (bot, message) {
        var taggedPeople = message.data.mentionedPeople;
        // console.log("tagged people: " + taggedPeople);
        // console.log("MESSAGE: " + JSON.stringify(message));

        var challengerId = message.data.personId;
        var victimId = "";
        console.log("message;" + JSON.stringify(message.data.personId))

        console.log("TAGGEDPEOPLE: " + taggedPeople);

        if (taggedPeople.length != 2) {
            bot.reply(message, "Invalid! Type @Bambot -challenge <person you challenging>");
            return;
        }

        taggedPeople.forEach(function (personId) {

            if (personId == 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS82NTAzYzgwNC1lMDJhLTRhMGYtYjczYi02NDc2NThiNmNjYzk') {
                return;
            }
            // do calculation here
            victimId = personId;

            var challengerDice = Math.floor(Math.random() * 6) + 1
            var victimDice = Math.floor(Math.random() * 6) + 1

            console.log("CHALLENGER DICE: " + challengerDice);
            console.log("VICTIM DICE: " + victimDice);

            var promiseArr = [m.getDisplayName(challengerId), m.getDisplayName(victimId)]

            Promise.all(promiseArr).then(function (result) {
                var challengerName = result[0];
                var victimName = result[1];

                console.log("CHALLENGER: " + challengerName)
                console.log("VICTIM: " + victimName)

                bot.reply(message, "Challenger " + challengerName + " rolled a " + challengerDice + " while Victim " + victimName + " rolled a " + victimDice)

                if (challengerDice > victimDice) {

                    console.log("challenger won");
                    m.updatePoints(victimId, -1, database)
                    m.updatePoints(challengerId, 1, database)

                    var returnMsg = "Despicable! " + challengerName + " stole a point from " + victimName


                    bot.reply(message, "**Challenger " + challengerName + " won!** " + returnMsg);
                } else {

                    console.log("challenger lost");
                    m.updatePoints(challengerId, -1, database)
                    m.updatePoints(victimId, 1, database)

                    var returnMsg = challengerName + " tried to steal a point from " + victimName + " but got arrested instead!"

                    bot.reply(message, "**Challenger " + challengerName + " lost!** " + returnMsg);
                }

            })

        });


    })


}