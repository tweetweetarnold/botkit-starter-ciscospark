var request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {

    function updatePoints(personId, increment) {
        var personRef = database.ref('ranking').child('personId=' + personId);

        personRef.once('value').then(function (snapshot) {
            var personPoints = 0
            if (snapshot.val() != null) {
                personPoints = snapshot.val().points;
            }

            personRef.update({
                points: personPoints + increment
            })
        })

    }


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
                        updatePoints(personId, 1)
                        personRef.child('reasons').push({
                            add: true,
                            reason: thisReason
                        })

                    } else if (addOrMinus === "-") {
                        updatePoints(personId, -1)
                        personRef.child('reasons').push({
                            add: false,
                            reason: thisReason
                        })
                    }

                })
            }

        });

    })

    // controller.hears(['-reasons *'], 'direct_message,direct_mention', function (bot, message) {

    //     var taggedPeople = message.data.mentionedPeople;

    //     taggedPeople.forEach(function (personId) {
    //         if (personId != 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS82NTAzYzgwNC1lMDJhLTRhMGYtYjczYi02NDc2NThiNmNjYzk') {
    //             var personReasonRef = database.ref('ranking').child('personId=' + personId).child('reasons');
    //             // personRef.child('points');

    //             console.log("ID: " + personId);
    //             personReasonRef.orderByKey().limitToLast(3).once('value').then(function (snapshot) {
    //                 console.log("LAST3: " + JSON.stringify(snapshot.val()));

    //             })


    //         }
    //     })

    // })


    function getDisplayName(key) {

        return new Promise(function (resolve, reject) {

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
                resolve(JSON.parse(body))
            })

        })

    }


    controller.hears(['^-dp$'], 'direct_message,direct_mention', function (bot, message) {

        database.ref('ranking').orderByChild('points').once('value').then(function (snapshot) {

            var displayNamePromiseArr = [];
            var pointsArr = [];

            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key.substr(9, childSnapshot.key.length - 1);
                var points = childSnapshot.val().points;

                pointsArr.push(points)

                var displayNamePromise = getDisplayName(key);
                displayNamePromiseArr.push(displayNamePromise);
            })

            Promise.all(displayNamePromiseArr).then(function (result) {
                // building messages
                var returnString = "";
                for (var i = pointsArr.length - 1; i >= 0; i--) {
                    returnString = returnString + "- " + pointsArr[i] + " : " + result[i].items[0].displayName + "\n"
                }
                bot.reply(message, returnString);

            })

        })

    })



    controller.hears(['-challenge *'], 'direct_message,direct_mention', function (bot, message) {
        var taggedPeople = message.data.mentionedPeople;
        console.log("tagged people: " + taggedPeople);
        // console.log("MESSAGE: " + JSON.stringify(message));

        var challenger = message.data.personId;
        var victim = "";
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
            victim = personId;

            var dice1 = Math.floor(Math.random() * 6) + 1
            var dice2 = Math.floor(Math.random() * 6) + 1

            console.log(dice1);
            console.log(dice2);

            var challengerNamePromise = getDisplayName(challenger)
            var victimNamePromise = getDisplayName(victim)

            var challengerName = "";
            var victimName = "";

            challengerNamePromise.then(function(result){
                console.log("CHALLENGER NAME :" + JSON.stringify(result));
                challengerName = result.items[0].displayName
            })
            victimNamePromise.then(function(result){
                console.log("VICTIM NAME :" + result.items[0].displayName);
                victimName = result.items[0].displayName

                if (dice1 <= dice2) {
                    updatePoints(challenger, -1)
                    updatePoints(victim, 1)
                    console.log("challenger lost");
                    bot.reply(message, challengerName + " tried to steal but failed. Justice prevail and point awarded to " + victimName)
                } else {
                    console.log("challenger won");
                    updatePoints(victim, -1)
                    updatePoints(challenger, 1)
                    bot.reply(message, challengerName + " robbed a point and got away! Point stolen from " + victimName);
                }
    
            })

        });



    })


}