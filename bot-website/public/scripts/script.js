$(function(){
  console.log("I'm ready!");
  var urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.get("page"));
  var page = urlParams.get("page");
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCz-YTTojULyRzOa8wyy6Sn0EUEtajaYJ8",
    authDomain: "marty-twitch-bot.firebaseapp.com",
    databaseURL: "https://marty-twitch-bot.firebaseio.com",
    projectId: "marty-twitch-bot",
    storageBucket: "marty-twitch-bot.appspot.com",
    messagingSenderId: "825314892419",
    appId: "1:825314892419:web:178071b39373c10cfcd9b6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  if(page == "commands" || page==null){
    var commandsRef = database.ref('/commands');
    commandsRef.once('value').then(function(snapshot){
      var table = "";
      table += "<h1>Commands</h1><table>";
      for(var i = 0; i < Object.keys(snapshot.val()).length; i++){
        table+="<tr>";
        var key = Object.keys(snapshot.val())[i];
        table += "<th>" + key + "</th><td>" + snapshot.val()[key].Response+"</td>";
        table+="</tr>";
      }
      table+="</table>";
      $(".replace").html(table);
      console.log(table);
    });
  }
  else if(page == "quotes"){
    var quotesRef = database.ref('/quotes');
    quotesRef.once('value').then(function(snapshot){
      var table = "";
      table += "<h1>Quotes</h1><table>";
      for(var i = 0; i < Object.keys(snapshot.val()).length; i++){
        table+="<tr>";
        var key = Object.keys(snapshot.val())[i];
        table += "<td>" + snapshot.val()[key].quote+"</td>";
        table+="</tr>";
      }
      table+="</table>";
      $(".replace").html(table);
      console.log(table);
    });
  }
})
