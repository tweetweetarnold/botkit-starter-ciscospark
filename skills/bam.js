
var moment = require('moment')

module.exports = function (controller, writeIntoFirebase, database) {

    controller.hears('^bam$', 'direct_message,direct_mention', function (bot, message) {
        database.ref('timestamp').child('asd').once('value').then(function (snapshot) {
            console.log("SNAPSHOT: " + snapshot.val().last);

            var a = moment(snapshot.val().last).format('MMMM Do YYYY, h:mm:ss a')
            console.log("A: " + a)

            var b = moment(snapshot.val().last).add(1, 'hours').format('MMMM Do YYYY, h:mm:ss a')
            console.log("B: " + b)

            console.log("b > a? : " + (b > a))

        })


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

        console.log(JSON.stringify("CREATED: " + message));

        database.ref('timestamp').child('asd').set({
            last: message.data.created
        })

        writeIntoFirebase(message);

        bot.reply(message, chosen_message)
    });

}
