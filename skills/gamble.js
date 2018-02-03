var request = require('request');

module.exports = function (controller, writeIntoFirebase, database) {





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
    //             resolve(JSON.parse(body))
    //         })

    //     })

    // }





    controller.hears(['^-gamble$'], 'direct_message,direct_mention', function (bot, message) {

        var personId = message.data.personId;
        console.log("PERSONID: " + personId)




        // var challengerDice = Math.floor(Math.random() * 6) + 1
        // var victimDice = Math.floor(Math.random() * 6) + 1

        // console.log("CHALLENGER DICE: " + challengerDice);
        // console.log("VICTIM DICE: " + victimDice);

        // var promiseArr = [getDisplayName(challengerId), getDisplayName(victimId)]

        // Promise.all(promiseArr).then(function (result) {
        //     var challengerName = result[0].items[0].displayName;
        //     var victimName = result[1].items[0].displayName;

        //     console.log("CHALLENGER: " + challengerName)
        //     console.log("VICTIM: " + victimName)

        //     bot.reply(message, "Challenger " + challengerName + " rolled a " + challengerDice + " while Victim " + victimName + " rolled a " + victimDice)

        //     if (challengerDice > victimDice) {

        //         console.log("challenger won");
        //         updatePoints(victimId, -1)
        //         updatePoints(challengerId, 1)

        //         var returnMsg = "Despicable! " + challengerName + " stole a point from " + victimName


        //         bot.reply(message, "**Challenger " + challengerName + " won!** " + returnMsg);
        //     } else {

        //         console.log("challenger lost");
        //         updatePoints(challengerId, -1)
        //         updatePoints(victimId, 1)

        //         var returnMsg = challengerName + " tried to steal a point from " + victimName + " but got arrested instead!"

        //         bot.reply(message, "**Challenger " + challengerName + " lost!** " + returnMsg);
        //     }

        // })



    })


}