require('dotenv').config();
var quotesManager = require('./quotes.js');
var commandsManager = require('./commands.js');
var commands = [];
var ComfyJS = require("comfy.js");

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if(user.toLowerCase() == process.env.TWITCH_USERNAME) return;

  if(commandsManager.RespondToCommand(command, message, user, ComfyJS)){
    return;
  }

  if(command === "addquote"){
    quotes = quotesManager.AddData("quotes", message, ComfyJS);
  }else if(command == "quote"){
    var quoteNo = -1;

    if(message === "" || message === null || message === undefined){
      quoteNo = Math.floor(Math.random() * quotesManager.GetTotalDataNumber("quotes"));
      console.log("Looking for quote"+quoteNo);
    }
    else{
      quoteNo = parseInt(message);
    }
    if(quoteNo == null || quoteNo == undefined || Number.isNaN(quoteNo) || quoteNo == -1) {
      ComfyJS.Say("/me Quote not found.");
      return;
    }
    else{
      ComfyJS.Say("/me "+quotesManager.GetData("quotes", quoteNo));
    }
  }
  if(command === "addjoke"){
    jokes = quotesManager.AddData("jokes", message, ComfyJS);
  }else if(command == "bread"){
    var jokeNo = -1;

    if(message === "" || message === null || message === undefined){
      jokeNo = Math.floor(Math.random() * quotesManager.GetTotalDataNumber("jokes"));
      console.log("Looking for joke"+jokeNo);
    }
    else{
      jokeNo = parseInt(message);
    }
    if(jokeNo == null || jokeNo == undefined || Number.isNaN(jokeNo) || jokeNo == -1) {
      ComfyJS.Say("/me joke not found.");
      return;
    }
    else{
      ComfyJS.Say("/me "+quotesManager.GetData("jokes", jokeNo));
    }
  }
  else if(command === "addcommand" && (flags.mod == true || flags.broadcaster == true)){
    commandsManager.AddCommand(message, ComfyJS);
  }else if(command === "removecommand" && (flags.mod == true || flags.broadcaster == true)){
    commandsManager.RemoveCommand(message, ComfyJS);
  }else if(command === "editcommand" && (flags.mod == true || flags.broadcaster == true)){
    commandsManager.EditCommand(message, ComfyJS);
  }else if (command === "nerdalert" && (flags.mod == true || flags.broadcaster == true)){
    console.log("Nerd alert!");
    obs.send('SetSceneItemProperties', {item: "Nerd Alert.mov", visible: true});

    setTimeout(()=>{
      obs.send('SetSceneItemProperties',  {item: "Nerd Alert.mov", visible: false});
    }, 3000);
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

ComfyJS.Init(process.env.TWITCH_TARGET_CHANNEL, process.env.TWITCH_AUTH_CLIENT);

const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
var scenes; var currentScene; var sourceSettings;
var sceneItems; var sceneItemProperties;
obs.connect({
        address: 'localhost:4444',
        password: ''
    })
    .then(() => {
        console.log(`Success! We're connected & authenticated.`);

        return obs.send('GetSceneItemProperties', {item: "Nerd Alert.mov"});
    })
    .then(data => {
        sceneItemProperties = data;
    })
    .catch(err => { // Promise convention dicates you have a catch on every chain.
        console.log(err);
    });
