const request = require('request');
const m = require('../req/myFunctions.js')


module.exports = function (controller, database) {

    function runGamble(amtToGamble, choice, personId) {

        return new Promise(function (resolve, reject) {

            console.log("PERSONID: " + personId)
            console.log("amtToGamble: " + amtToGamble)
            console.log("CHOICE: " + choice)

            var bigOrSmall = Math.round(Math.random())
            console.log("BigOrSmall: " + bigOrSmall);

            if (bigOrSmall === choice) {
                console.log("PLAYER WINS!")
                m.updatePoints(personId, parseInt(amtToGamble), database)
                resolve(1)
            } else {
                console.log("PLAYER LOSE!")
                m.updatePoints(personId, parseInt(amtToGamble * -1), database)
                resolve(0)
            }

        })

    }


    controller.hears(['^-gamble$'], 'direct_message,direct_mention', function (bot, message) {

        var playerChoice = "";
        var playerAmtToGamble = 0;
        var personId = message.data.personId;

        bot.startConversation(message, function (err, convo) {
            
            // Set convo timeout to 10 seconds
            convo.setTimeout(10000);
            convo.onTimeout(function (convo) {
                convo.say('You kept me waiting too long. I\'m moving on...');
                convo.next();
            });

            // convo.say("**Warning! You cannot gamble if you have no points! Go do something better with your life.")

            convo.addQuestion('**Disclaimer! Gambling is bad! Do it at your own risk!** How many points do you want to gamble? Enter a digit between 1 and 9.', [
                {
                    pattern: '^[1-9]$',
                    callback: function (response, convo) {
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


            convo.addQuestion('Choose either Big or Small? Enter **big** or **small**', [
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


}