
module.exports = function () {

    var firebase = require("firebase");

    var firebaseConfig = {
        apiKey: "AIzaSyDC9z-aiV47fH4QXtCrYlU7mKBx3Ko1sdg",
        authDomain: "bambot-36f9f.firebaseapp.com",
        databaseURL: "https://bambot-36f9f.firebaseio.com",
        projectId: "bambot-36f9f",
        storageBucket: "bambot-36f9f.appspot.com",
        messagingSenderId: "947045026687"
    };
    firebase.initializeApp(firebaseConfig);
    console.log("FIREBASE: Initialized!");
    var database = firebase.database();

    console.log("FIREBASE: Logging in user")
    firebase.auth().signInWithEmailAndPassword(process.env.firebaseUser, process.env.firebasePass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("FIREBASE: Authentication error. Code: " + errorCode + " Message: " + errorMessage)
        process.exit(1);
    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            console.log("FIREBASE: User is signed in. Name: " + user.displayName)
        } else {
            // User is signed out.
        }
    });

    return database

}