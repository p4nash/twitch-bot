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
  }
}

function AddACommand(com, msg){
  var toProcess = msg.split(" ");
  var res = msg.substr(msg.indexOf(" ") + 1);;
  var obj = {"Command":toProcess[0], "Response":res};
  commands.push(obj);

  var toWrite ="[\r\n";
  for(var i = 0; i < commands.length-1; i++){
    toWrite = toWrite+JSON.stringify(commands[i])+",\r\n";
  }
  toWrite=toWrite + JSON.stringify(commands[commands.length-1])+"\r\n]";

  fs.writeFile("commands.txt", toWrite, function(err) {
      if (err) {
          console.log(err);
      }else{
        console.log("Command added: "+toProcess[0]);
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
