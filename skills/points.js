var request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {

    
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
                    var personPoints = 0;
                    if (snapshot.val() != null) {
                        personPoints = snapshot.val().points;
                    }

                    if (personPoints === null) {
                        personPoints = 0;
                    }

                    if (addOrMinus === "+") {
                        personRef.update({
                            points: personPoints + 1
                        })
                        personRef.child('reasons').push({
                            add: true,
                            reason: thisReason
                        })

                    } else if (addOrMinus === "-") {
                        personRef.update({
                            points: personPoints - 1
                        })
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

}