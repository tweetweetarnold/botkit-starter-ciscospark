
var request = require('request');

module.exports = function (controller, database) {

    // Update points of person
    global.updatePoints = function updatePoints(personId, increment) {
        var personRef = database.ref('ranking').child('personId=' + personId);
        var promise = global.getDisplayName(personId)

        personRef.once('value').then(function (snapshot) {
            var personPoints = snapshot.val().points;

            if (personPoints == undefined) {
                personPoints = 0;
            }

            promise.then(function (result) {

                personRef.update({
                    points: personPoints + increment,
                    personEmail: result[0]
                })
            })

        })
    }


    // Return person's name given personId
    global.getDisplayName = function (personId) {

        return new Promise(function (resolve, reject) {

            request({
                url: 'https://api.ciscospark.com/v1/people',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'Bearer ' + process.env.access_token
                },
                qs: {
                    'id': personId
                }
            }, function (error, response, body) {
                resolve(JSON.parse(body).items[0].displayName)
            })

        })
    }
}