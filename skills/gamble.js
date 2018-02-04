var request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {


    controller.hears(['^-gamble$'], 'direct_message,direct_mention', function (bot, message) {

        var personId = message.data.personId;
        console.log("PERSONID: " + personId)

        var playerChoice = "";
        var playerAmtToGamble = 0;

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
                        runGamble(playerAmtToGamble, 0, message.data.personId, bot)

                        convo.say('Wise choice. Small registered.')
                        convo.gotoThread('gamble_end');
                    },
                },
                {
                    pattern: '^big$',
                    callback: function (response, convo) {
                        console.log("INPUT: " + response.match[0])
                        convo.say('Awesome choice. Big registered.')
                        runGamble(playerAmtToGamble, 1, message.data.personId)

                        convo.gotoThread('gamble_end');
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

        console.log("PERSONID: " + personId)
        console.log("amtToGamble: " + amtToGamble)
        console.log("CHOICE: " + choice)

        var bigOrSmall = Math.round(Math.random())
        console.log("BigOrSmall: " + bigOrSmall);

        if (bigOrSmall === choice) {
            console.log("PLAYER WINS!")
            updatePoints(personId, parseInt(amtToGamble))
            return 1
        } else {
            console.log("PLAYER LOSE!")
            updatePoints(personId, parseInt(amtToGamble * -1))
            return 0
        }


    }

    function updatePoints(personId, increment) {
        var personRef = database.ref('ranking').child('personId=' + personId);

        personRef.once('value').then(function (snapshot) {
            var personPoints = snapshot.val().points;

            if (personPoints == undefined) {
                personPoints = 0;
            }

            personRef.update({
                points: personPoints + increment
            })

        })

    }


}