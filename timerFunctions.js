var database = {};
var rawData = {};
var firebase = require ('./quotes.js');

function AddData(data, client){
  var ref;
  console.log(rawData.length);
  if(rawData == undefined || rawData.length == undefined)
    ref = database.child(0);
  else
    ref = database.child(rawData.length);

    var obj = {};
    obj["timerFunctions"] = data;

    ref.update(obj, (err)=>{
      if(err){
        console.log("Something went wrong "+err);
      }
      else{
        var index = 0;
        console.log(Object.keys(rawData).length)
        if(rawData == undefined || rawData.length <= 0) index =0;
        else index = Object.keys(rawData).length;
        rawData[index] = {"timerFunctions": data};
        InitializeTimedFunction(data, client);
      }
    });
}

function Initialize(client){
  database = firebase.firebaseManager.GetDatabase("timerFunctions");

  database.once('value', function(snap){
    if(snap.val() == null || snap.val() == undefined) return;
    rawData = snap.val();
    console.log(rawData);
    SetUpFunctions(client);
  });
}

function SetUpFunctions(client){
  console.log(rawData);
  for(var i =0 ; i < rawData.length; i++){
    InitializeTimedFunction(rawData[i]["timerFunctions"], client);
  }
}

function InitializeTimedFunction(data, client){
  var timerStr = data.split(' ')[0];
  var message = data.split(' ').slice(1).join(' ');

  if(parseInt(timerStr) != NaN){
    var timer = parseInt(timerStr);
    setInterval(function(){
      console.log("saying message "+message+" after timer "+timer);
      client.Say(message);
    }, timer *1000);
  }
}

module.exports = {AddData, SetUpFunctions, Initialize};
