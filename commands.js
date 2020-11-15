var commands = {};
var firebaseManager = require('./firebase.js');
var commandsDB;

commandsDB = firebaseManager.GetDatabase("commands");
ReadCommands();
// firebaseManager.InitialiseFirebase(function(){
//   commandsDB = firebaseManager.GetDatabase("commands");
//   ReadCommands();
// });

function ReadCommands(){
  commandsDB.once('value',function(snap){
    if(snap.val() == null || snap.val() == undefined) return;
    console.log(snap.val());
    commands = snap.val();
    return snap.val();
  });
}

function AddCommand(response, client){
  var command = response.split(" ")[0];
  var commandsRef = commandsDB.child(command);
  var res = response.substr(response.indexOf(" ") + 1);;
  var obj = {"Response": res};

  commandsRef.update(obj, (err)=>{
    if(err){
      console.log("Something went wrong. "+err);
      client.Say("/me Something went wrong. Couldn't add the command. ");
    }
    else{
      console.log("Added command successfully.");
      commands[command] = {"Response": res};
      client.Say("/me Command added successfully.");
    }
  });
}

function GetCommandResponse(command){
  console.log("Looking for command "+command);
  return commands[command].Response;
}


function RespondToCommand(com, msg, user, client){
  //read commands text
  var response = "";
  if(commands[com] == null || commands[com] == undefined) return false;
  else{
    console.log("Responding to command "+com+" with: "+response);
    response = GetCommandResponse(com);
    response = response.replace("$user", user);
    client.Say("/me " + response);
    return true;
  }
}

function RemoveCommand(response, client){
  var command = response.split(" ")[0];
  var commandsRef = commandsDB.child(command);
  commandsRef.remove().then(function(){
    client.Say("/me Removed command !"+command +"successfuly.");
  })
  .catch(function(error){
    client.Say("/me Couldn't remove command. Something happened.");
  });

}

module.exports = { AddCommand, RespondToCommand, RemoveCommand };
