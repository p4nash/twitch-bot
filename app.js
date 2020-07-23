require('dotenv').config();
var fs = require('fs');
const readline = require('readline');
var quotes =[];
var commands = [{"Command": "Com", "Response": "Rep"}];

const rl = readline.createInterface({
    input: fs.createReadStream('quotes.txt'),
    output: process.stdout,
    terminal: false
});
rl.on('line', (line) => {
    console.log(line);
    quotes.push(line);
});

fs.readFile('commands.txt', (err, data) => {
    if (err) throw err;
    let command = JSON.parse(data);
    console.log(command);
    commands = command;
});

var ComfyJS = require("comfy.js");

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if(user.toLowerCase() == process.env.TWITCH_USERNAME) return;

  if(RespondToCommand(command, message, user)){
    console.log("Responding to basic command "+command);
  }
  else if(command === "addquote"){
    quotes.push(message);
    SaveQuotes();
  }else if(command == "quote"){
    var quoteNo = -1;

    if(message === "" || message === null || message === undefined)
      quoteNo = Math.floor((Math.random() * quotes.length));
    else
      quoteNo = parseInt(message);

      console.log("Quote number is "+quoteNo);
    if(quoteNo == null || quoteNo == undefined || Number.isNaN(quoteNo) || quoteNo == -1 || quoteNo > (quotes.length-1)) {
      ComfyJS.Say("/me Quote not found.");
      return;
    }
    else
      ComfyJS.Say("/me "+quotes[quoteNo]);
  }else if(command === "addcommand" && user.toLowerCase() == process.env.TWITCH_TARGET_CHANNEL){
    console.log("Adding a command");
    AddACommand(command,message);
  }else if(command === "removecommand" && user.toLowerCase() == process.env.TWITCH_TARGET_CHANNEL){
    RemoveACommand(message);
  }
}

function RemoveACommand(com){
  console.log("Removing command "+com);
  var commandIndex = -1;
  for(var i = 0; i < commands.length; i++){
    console.log(commands[i].Command);
    if(commands[i].Command === com){
      console.log("Command "+com+" exists. Removing now.");
      commandIndex = i;
    }
  }

  if(commandIndex >= 0){
    console.log("Command exists at "+commandIndex);
    commands.splice(commandIndex, 1);
    saveCommands();

    ComfyJS.Say("Command "+com+" has been removed successfully.");
  }
  else{
      ComfyJS.Say("Oopsie poopsie! Command "+com+" does not exist.");
  }
}

function AddACommand(com, msg){
  var commandExists = false;
  var toProcess = msg.split(" ");
  var res = msg.substr(msg.indexOf(" ") + 1);;
  var obj = {"Command":toProcess[0], "Response":res};

  for(var i = 0; i < commands.length; i++){
    if(commands[i].Command === toProcess[0]){
      commandExists= true;
    }
  }

  if(commandExists === true) {
    console.log("Oopsie poopsie! Command already exists. Cannot add.");
    return;
  }

  commands.push(obj);
  saveCommands();

  ComfyJS.Say("Command "+com+" has been added successfully.");
}

function saveCommands(){
    var toWrite ="[\r\n";
    for(var i = 0; i < commands.length-1; i++){
      toWrite = toWrite+JSON.stringify(commands[i])+",\r\n";
    }
    toWrite=toWrite + JSON.stringify(commands[commands.length-1])+"\r\n]";

    fs.writeFile("commands.txt", toWrite, function(err) {
        if (err) {
            console.log(err);
        }else{
          console.log("Commands updated");
          console.log(toWrite);
        }
    });
}

function RespondToCommand(com, msg, user){
  //read commands text
  var response = "";
  for(var i = 0; i < commands.length; i++){
    if(commands[i].Command == com){
      response = commands[i].Response;
      response = response.replace("$user", user);
      break;
    }
  }

  if(response != ""){
    console.log("Responding to command "+com+" with: "+response);
    ComfyJS.Say(response);
    return true;
  }
  return false;
}

function SaveQuotes(){
  var toWrite ="";
  for(var i = 0; i < quotes.length; i++){
    toWrite = toWrite+quotes[i]+"\r\n";
  }
  fs.writeFile("quotes.txt", toWrite, function(err) {
      if (err) {
          console.log(err);
      }else{
        console.log("Wrote quotes: "+quotes);
        ComfyJS.Say("/me Quote added successfully!");
      }
  });
}
ComfyJS.Init(process.env.TWITCH_TARGET_CHANNEL, process.env.TWITCH_AUTH_CLIENT);
