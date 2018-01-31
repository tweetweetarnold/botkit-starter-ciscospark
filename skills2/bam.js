
module.exports = function (controller, writeIntoFirebase) {

    controller.hears('bam', 'direct_message,direct_mention', function (bot, message) {
        var message_options = [
            "Did I just hear a bam? BAM!!!!",
            "Woah! You like bam? Me too!",
            "You BAM! I BAM! WE BAM!",
            'BAAAAAAAAAAAAAAAMMMMMMMMMMMMMMMMMMM!',
            'BAM BAM BAM',
            'Boom'
        ]
        var random_index = Math.floor(Math.random() * message_options.length)
        var chosen_message = message_options[random_index]

        writeIntoFirebase(message);

        bot.reply(message, chosen_message)
    });
    
}
