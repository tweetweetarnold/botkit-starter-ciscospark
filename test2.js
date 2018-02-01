require('timers');

var request = require('request');
var env = require('node-env-file');
env(__dirname + '/.env');

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");


var firebaseConfig = {
    // apiKey: "apiKey",
    // authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://bambot-36f9f.firebaseio.com/",
    // storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(firebaseConfig);
console.log("FIREBASE: Initialized!");
var database = firebase.database();



function getDisplayName() {

    return new Promise(function (resolve, reject) {

        request({
            url: 'https://api.ciscospark.com/v1/people',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + process.env.access_token
            },
            qs: {
                'id': 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS83OGRjNDkxNi1hODE5LTQ5ZmQtYmZlMC0wMWIwMTc3NTNlM2E'
            }
        }, function (error, response, body) {

            var name = JSON.parse(body).items[0].displayName;
            console.log("BODY: " + body)

            if (name != "BamBot") {
                console.log("NAME: " + name);
            }

            resolve(JSON.parse(body))

            // return name;
        })

    })


}

function a() {

    console.log("**************inside A");
    var myPromise = getDisplayName();
    console.log("here now")
    myPromise.then(function (result) {
        console.log("here  leh????")

        console.log("RESULT :" + result)

    }, function (err) {
        console.log(err);
    })
}



a();



console.log("completed");