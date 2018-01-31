
module.exports = function (controller, writeIntoFirebase) {

    controller.hears(['^hello$', '^hey$', '^hi$', '^aloha$'], 'direct_message,direct_mention', function (bot, message) {
        var message_options = [
            "Hello!",
            "Hello <@personEmail:" + message.user + ">!",
            "Yes, I'm listening...",
            "Hi! How can I help?",
            "Hey, what's up!",
            "Yes, tell me! What are you looking for?",
            "What's up?",
            "Yuhoo!",
            "你好！"
        ]
        var random_index = Math.floor(Math.random() * message_options.length)
        var chosen_message = message_options[random_index]

        writeIntoFirebase(message);

        bot.reply(message, chosen_message)
    })

}