var commands = {};
var firebaseManager = require('./firebase.js');
var commandsDB;

commandsDB = firebaseManager.GetDatabase("commands");
ReadCommands();

function ReadCommands(){
  commandsDB.once('value',function(snap){
    if(snap.val() == null || snap.val() == undefined) return;
    commands = snap.val();
    return snap.val();
  });
}

function EditCommand(response, client){
    var command = response.split(" ")[0];
    var commandsRef = commandsDB.child(command);

    if(commands[command] == undefined){
      client.Say("/me Command doesn't exist.");
      return;
    }

    var res = response.substr(response.indexOf(" ") + 1);;
    var obj = {"Response": res};

    UpdateCommand(command, commandsRef, obj, client, "/me Command edited successfully.", "/me Something went wrong. Couldn't add the command.");
}

function UpdateCommand(command, dbRef, obj, client, onSuccess, onFailure){
    dbRef.update(obj, (err)=>{
      if(err){
        console.log("Something went wrong. "+err);
        client.Say(onFailure);
      }
      else{
        commands[command] = obj;
        client.Say(onSuccess);
      }
    });
}

function AddCommand(response, client){
  var command = response.split(" ")[0];
  var commandsRef = commandsDB.child(command);

  if(commands[command] != undefined){
    client.Say("/me Command already exists. Use editcommand to edit the response.");
    return;
  }

  var res = response.substr(response.indexOf(" ") + 1);;
  var obj = {"Response": res};

  UpdateCommand(command, commandsRef, obj, client, "/me Command added successfully.", "/me Something went wrong. Couldn't add the command.");
}

function GetCommandResponse(command){
  console.log("Looking for command "+command);
  return commands[command].Response;
}


function RespondToCommand(com, msg, user, client){
  //read commands text
  console.log(msg);
  var response = "";
  if(commands[com] == null || commands[com] == undefined) return false;
  else{
    console.log("Responding to command "+com+" with: "+response);
    response = GetCommandResponse(com);
    response = response.replace("$user", user);
    // newresponse = response.replaceAll("$target", msg);
    var newResponse = response.split("$target").join(msg);
    // response = response.replace("$");
    client.Say("/me " + newResponse);
    return true;
  }
}

function RemoveCommand(response, client){
  var command = response.split(" ")[0];
  var commandsRef = commandsDB.child(command);
  commandsRef.remove().then(function(){
    client.Say("/me Removed command !"+command +" successfuly.");
    commands[command] = undefined;
  })
  .catch(function(error){
    client.Say("/me Couldn't remove command. Something happened.");
  });

}

module.exports = { AddCommand, EditCommand, RespondToCommand, RemoveCommand };
