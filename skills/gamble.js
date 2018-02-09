var request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {


    controller.hears(['^-gamble$'], 'direct_message,direct_mention', function (bot, message) {

        var playerChoice = "";
        var playerAmtToGamble = 0;
        var personId = message.data.personId;
        console.log("PERSONID: " + personId)
        

        bot.startConversation(message, function (err, convo) {

            convo.say('Warning! Gambling is bad! Do not get addicted!')

            convo.addQuestion('How many points do you want to gamble? Enter a digit between 1 and 9. Go big or go home!', [
                {
                    pattern: '^[1-9]$',
                    callback: function (response, convo) {
                        // console.log("RESPONSE: " + JSON.stringify(response))
                        console.log("INPUT: " + response.match[0])
                        playerAmtToGamble = response.match[0]
                        convo.gotoThread('gamble_select_thread');
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.say('I did not understand. Let\'s try again!')
                        convo.repeat()
                        convo.next()
                    },
                }
            ], {}, 'default')


            convo.addQuestion('Choose either Big or Small? Enter *big* or *small*', [
                {
                    pattern: '^small$',
                    callback: function (response, convo) {
                        console.log("INPUT: " + response.match[0])
                        var promise = runGamble(playerAmtToGamble, 0, message.data.personId, bot)

                        promise.then(function (result) {

                            if (result == 1) {
                                convo.addMessage('Player wins!', 'gamble_end')
                            } else {
                                convo.addMessage('Player loses!', 'gamble_end')
                            }

                            convo.gotoThread('gamble_end');

                        })
                        convo.gotoThread('gamble_end');
                    },
                },
                {
                    pattern: '^big$',
                    callback: function (response, convo) {
                        console.log("INPUT: " + response.match[0])
                        convo.say('Awesome choice. Big registered.')
                        var promise = runGamble(playerAmtToGamble, 1, message.data.personId)

                        promise.then(function (result) {

                            if (result == 1) {
                                convo.addMessage('Player wins!', 'gamble_end')
                            } else {
                                convo.addMessage('Player loses!', 'gamble_end')
                            }

                            convo.gotoThread('gamble_end');
                            // convo.

                        })

                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.say('I did not understand. Let\'s try again!')
                        convo.repeat()
                        convo.next()
                    }
                }
            ], {}, 'gamble_select_thread')

            convo.addMessage('Gamble completed', 'gamble_end')

        })


    })



    function runGamble(amtToGamble, choice, personId) {

        return new Promise(function (resolve, reject) {

            console.log("PERSONID: " + personId)
            console.log("amtToGamble: " + amtToGamble)
            console.log("CHOICE: " + choice)

            var bigOrSmall = Math.round(Math.random())
            console.log("BigOrSmall: " + bigOrSmall);

            if (bigOrSmall === choice) {
                console.log("PLAYER WINS!")
                global.updatePoints(personId, parseInt(amtToGamble))
                resolve(1)
            } else {
                console.log("PLAYER LOSE!")
                global.updatePoints(personId, parseInt(amtToGamble * -1))
                resolve(0)
            }

        })

    }


    // function updatePoints(personId, increment) {
    //     var personRef = database.ref('ranking').child('personId=' + personId);
    //     var promise = getDisplayName(personId)

    //     personRef.once('value').then(function (snapshot) {
    //         var personPoints = snapshot.val().points;

    //         if (personPoints == undefined) {
    //             personPoints = 0;
    //         }

    //         promise.then(function (result) {

    //             personRef.update({
    //                 points: personPoints + increment,
    //                 personEmail: result
    //             })

    //         })

    //     })

    // }




    // function getDisplayName(key) {

    //     return new Promise(function (resolve, reject) {

    //         request({
    //             url: 'https://api.ciscospark.com/v1/people',
    //             headers: {
    //                 'Content-Type': 'application/json; charset=utf-8',
    //                 'Authorization': 'Bearer ' + process.env.access_token
    //             },
    //             qs: {
    //                 'id': key
    //             }
    //         }, function (error, response, body) {
    //             resolve(JSON.parse(body).items[0].displayName)
    //         })

    //     })

    // }




}