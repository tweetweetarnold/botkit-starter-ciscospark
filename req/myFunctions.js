const request = require('request');


// Check if personID is a person
exports.ifPerson = function (personId) {
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
            // resolve(JSON.parse(body).items[0].type)
            if (JSON.parse(body).items[0].type != "person") {
                return false
            } else {
                return true
            }
        })
    })
}



// Update points of person
exports.updatePoints = function (personId, increment, database) {
    var personRef = database.ref('ranking').child('personId=' + personId);
    var promise = exports.getPersonEmail(personId)

    personRef.once('value').then(function (snapshot) {
        var personPoints = snapshot.val().points;
        if (personPoints == undefined) {
            personPoints = 0;
        }
        promise.then(function (result) {
            personRef.update({
                points: personPoints + increment,
                personEmail: result
            })
        })
    })
}


// Return person's email given personId
exports.getPersonEmail = function (personId) {
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
            resolve(JSON.parse(body).items[0].emails[0])
        })
    })
}


// Return person's name given personId
exports.getDisplayName = function (personId) {
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


// Return person's id given personEmail
exports.getPersonId = function (personEmail) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://api.ciscospark.com/v1/people',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + process.env.access_token
            },
            qs: {
                'email': personEmail
            }
        }, function (error, response, body) {
            resolve(JSON.parse(body).items[0].id)
        })
    })
}