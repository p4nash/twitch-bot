var rawData = {};
var firebaseManager = require('./firebase.js');
var databases = {};

var databaseNames = ["quotes", "jokes", "timerFunctions"];

firebaseManager.InitialiseFirebase(function(){

  for(var i = 0; i < databaseNames.length; i++){
    databases[databaseNames[i]] = firebaseManager.GetDatabase(databaseNames[i]);
    rawData[databaseNames[i]]= [];
  }

  for(var i = 0; i < databaseNames.length; i++){
    ReadDatabase(databaseNames[i]);
  }

});

function SearchKeyword(type, word){
  var dataList = rawData[type];
  console.log("Searching keyword");
  toReturn = [];
  for(var i = 0; i < dataList.length; i++){
    if(dataList[i].quotes.includes(word+" ")
    || dataList[i].quotes.includes(" "+word)){
      toReturn.push(dataList[i].quotes);
    }
  }
  return toReturn;
}

function ReadDatabase(DBname){
  databases[DBname].once('value',function(snap){
    if(snap.val() == null || snap.val() == undefined) return;
    rawData[DBname] = snap.val();

    return snap.val();
  });
}

function AddData(type, data, client){
  SaveData(type, data, client);
  return rawData[type];
}

function GetData(type, index){
  var dataList = rawData[type];
  if(dataList[index] != undefined)
    return dataList[index][type];

  return "Data not found.";
}


function SaveData(DBname, data, client){
  var ref;
  if(rawData[DBname] == undefined)
    ref = databases[DBname].child(0);
  else
    ref = databases[DBname].child(rawData[DBname].length);

  var obj = {};
  obj[DBname]= data;
  var rawDataRef = rawData[DBname];
  ref.update(obj,(err)=>{
    if(err){
      console.log("Something went wrong. "+err);
      client.Say("Something went wrong. Couldn't add the quote. ");
    }
    else{
      console.log("/me Added data successfully.");
      var index = 0;
      if(rawData[DBname] == undefined) index = 0;
      else if(rawData[DBname].length <= 0) index = 0;
      else index = Object.keys(rawData[DBname]).length;
      rawDataRef[index]= {};
      rawDataRef[index][DBname]=data;

      client.Say("/me Quote added successfully.");
    }
  });

}

function GetTotalDataNumber(DBname){
  return rawData[DBname].length;
}

module.exports =  { ReadDatabase, AddData, GetData, GetTotalDataNumber, SearchKeyword, firebaseManager };
