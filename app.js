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
    quotes = quotesManager.AddQuote(message, ComfyJS);
  }else if(command == "quote"){
    var quoteNo = -1;

    if(message === "" || message === null || message === undefined){
      quoteNo = Math.floor(Math.random() * quotesManager.GetTotalQuotes());
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
      ComfyJS.Say("/me "+quotesManager.GetQuote(quoteNo));
    }
  }else if(command === "addcommand" && (flags.mod == true || flags.broadcaster == true)){
    commandsManager.AddCommand(message, ComfyJS);
  }else if(command === "removecommand" && (flags.mod == true || flags.broadcaster == true)){
    commandsManager.RemoveCommand(message, ComfyJS);
  }else if(command === "editcommand" && (flags.mod == true || flags.broadcaster == true)){
    commandsManager.EditCommand(message, ComfyJS);
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

// ComfyJS.Init(process.env.TWITCH_TARGET_CHANNEL, process.env.TWITCH_AUTH_CLIENT);

const request = require('request');

const getToken = (url, callback)=>{
  const options={
    url: process.env.GET_TOKEN_URL,
    json: true,
    body: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  };

  request.post(options, (err, res, body)=>{
    if(err){
      return console.log("Error: "+err);
    }

    callback(res);
  });
};

var AT ='';
getToken(process.env.GET_TOKEN_URL, (res)=>{
  AT = res.body.access_token;
  console.log(AT);
  getSub(process.env.GET_SUBSCRIPTION_URL, AT, (response)=>{});
});

const getSub = (url, accessToken, callback)=>{
  const options = {
    url: process.env.GET_SUBSCRIPTION_URL,
    method: 'POST',
    headers: {
      'Client-ID': process.env.CLIENT_ID,
      'Authorization': 'Bearer '+accessToken
    },
    body: {
      type: "channel.follow",
      version: "1",
      condition: {
        broadcaster_user_id: ""
      }
    }
  };

  request.post(options, (err, res, body)=>{
    if(err){
      return console.log("Error: "+err);
    }

    console.log(res.body);
  });
};
