var admin, serviceAccount, db;

function InitialiseFirebase(toExecute){
  admin = require("firebase-admin");

  serviceAccount = require("./marty-twitch-bot-firebase-adminsdk-21vgf-cbecf6460b.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://marty-twitch-bot.firebaseio.com"
  });

  db = admin.database();

  toExecute()
}

function GetDatabase(name){
  return db.ref(name);
}

module.exports = { InitialiseFirebase, GetDatabase };
