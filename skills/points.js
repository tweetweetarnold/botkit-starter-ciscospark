var request = require('request');

module.exports = function (controller, database) {


    controller.hears(['-p *'], 'direct_message,direct_mention', function (bot, message) {

        var addOrMinus = message.text.charAt(message.text.length - 1);
        var arr = message.text.toString().split(" ");

        console.log("arr: " + arr[2]);
        addOrMinus = arr[2];
        var startIndex = message.text.indexOf("#") + 1;
        console.log("STARTINDEX: " + startIndex);

        if (startIndex == 0) {
            bot.reply(message, "Did not find reasoning. Terminating...");
            return;
        }
        var thisReason = message.text.substr(startIndex, message.text.length - 1);

        var taggedPeople = message.data.mentionedPeople;

        taggedPeople.forEach(function (personId) {

            if (personId != 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS82NTAzYzgwNC1lMDJhLTRhMGYtYjczYi02NDc2NThiNmNjYzk') {
                var personRef = database.ref('ranking').child('personId=' + personId);

                personRef.once('value').then(function (snapshot) {

                    if (addOrMinus === "+") {
                        global.updatePoints(personId, 1)
                        personRef.child('reasons').push({
                            add: true,
                            reason: thisReason
                        })

                    } else if (addOrMinus === "-") {

                        global.updatePoints(personId, -1)
                        personRef.child('reasons').push({
                            add: false,
                            reason: thisReason
                        })

                    }

                })
            }

        });

    })


    


    controller.hears(['^-dp$'], 'direct_message,direct_mention', function (bot, message) {

        database.ref('ranking').orderByChild('points').once('value').then(function (snapshot) {

            var displayNamePromiseArr = [];
            var pointsArr = [];

            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key.substr(9, childSnapshot.key.length - 1);
                var points = childSnapshot.val().points;

                pointsArr.push(points)

                var displayNamePromise = global.getDisplayName(key);
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

            var promiseArr = [global.getDisplayName(challengerId), global.getDisplayName(victimId)]

            Promise.all(promiseArr).then(function (result) {
                var challengerName = result[0];
                var victimName = result[1];

                console.log("CHALLENGER: " + challengerName)
                console.log("VICTIM: " + victimName)

                bot.reply(message, "Challenger " + challengerName + " rolled a " + challengerDice + " while Victim " + victimName + " rolled a " + victimDice)

                if (challengerDice > victimDice) {

                    console.log("challenger won");
                    global.updatePoints(victimId, -1)
                    global.updatePoints(challengerId, 1)

                    var returnMsg = "Despicable! " + challengerName + " stole a point from " + victimName


                    bot.reply(message, "**Challenger " + challengerName + " won!** " + returnMsg);
                } else {

                    console.log("challenger lost");
                    global.updatePoints(challengerId, -1)
                    global.updatePoints(victimId, 1)

                    var returnMsg = challengerName + " tried to steal a point from " + victimName + " but got arrested instead!"

                    bot.reply(message, "**Challenger " + challengerName + " lost!** " + returnMsg);
                }

            })

        });


    })


}