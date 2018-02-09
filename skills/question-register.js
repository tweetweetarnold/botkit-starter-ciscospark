var request = require('request');

module.exports = function (controller, database) {

    controller.hears(['-regis'], 'direct_message,direct_mention', function (bot, message) {


        bot.startConversation(message, function (err, convo) {

            // convo.say('Warning! Gambling is bad! Do not get addicted!')

            convo.addQuestion('Add your question! ', [
                {
                    pattern: '^[1-9]$',
                    callback: function (response, convo) {
                        // console.log("RESPONSE: " + JSON.stringify(response))
                        // console.log("INPUT: " + response.match[0])

                        convo.gotoThread('load_question');
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

}