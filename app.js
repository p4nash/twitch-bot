require('dotenv').config();
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var quotesManager = require('./quotes.js');
var commandsManager = require('./commands.js');
var commands = [];
var ComfyJS = require("comfy.js");

var app = express();

app
.use(express.static(__dirname + '/public'))
.use(cors())
.use(cookieParser())
.use(bodyParser.json())
.use(bodyParser.urlencoded({  extended:true }));

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

var auth_token, client_token = '';
app.listen(process.env.PORT || 8888, ()=>{
  console.log("Server started on port 8888");
});

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/login', function(req, res){
  console.log("Authorizing user");
  var options = 'https://id.twitch.tv/oauth2/authorize?'+
     querystring.stringify({
       client_id: process.env.CLIENT_ID,
       redirect_uri: 'http://localhost:8888/feed.html',
       response_type: 'token',
       scope: 'channel:manage:redemptions channel:read:redemptions user:read:email chat:edit chat:read',
       force_verify: true
     });

     res.redirect(options);
});

app.get('/feed', function(req, res){
  client_token = req.query.access_token;
  console.log("Logging in user using token "+client_token);
  ComfyJS.Init(process.env.TWITCH_TARGET_CHANNEL, client_token);


  res.setHeader('Content-Type', 'application/json');

  ComfyJS.onChat = ( user, command, message, flags, extra ) => {
    console.log( user + " send a message.");
    res.write(JSON.stringify({
      type: "chat",
      user: user,
      command: command,
      message: message,
      flags: flags,
      extra: extra
    }));
  }

  // ComfyJS.onReward = ( user, reward, cost, message, extra ) => {
  //   console.log( user + " redeemed " + reward + " for " + cost );
  //   res.send({
  //     type: "reward",
  //     user: user,
  //     reward: reward,
  //     cost: cost,
  //     message: message,
  //     extra: extra
  //   });
  // }
  //
  // ComfyJS.onHosted=(user, viewers, autohost, extra) => {
  //   console.log( user + " hosted with " + viewers + " viewers.");
  //   res.send({
  //     type: "host",
  //     user: user,
  //     viewers: viewers,
  //     autohost: autohost,
  //     extra: extra
  //   });
  // }
  //
  // ComfyJS.onRaid=(user, viewers, extra) => {
  //   console.log( user + " raided with " + viewers + " viewers.");
  //   res.send({
  //     type: "raid",
  //     user: user,
  //     viewers: viewers,
  //     extra: extra
  //   });
  // }
  //
  // ComfyJS.onCheer=(user, message, bits, flags, extra) => {
  //   console.log( user + " cheered for " + bits + " bits.");
  //   res.send({
  //     type: "cheer",
  //     user: user,
  //     message: message,
  //     bits: bits,
  //     flags: flags,
  //     extra:extra
  //   });
  // }
  //
  // ComfyJS.onSub=(user, message, subTierInfo, extra) => {
  //   console.log( user + " subbed with " + subTierInfo.planName + " tier.");
  //   res.send({
  //     type: "sub",
  //     user: user,
  //     message: message,
  //     subTierInfo: subTierInfo,
  //     extra:extra
  //   });
  // }
  //
  // ComfyJS.onResub=(user, message, streamMonths, cumulativeMonths, subTierInfo, extra) => {
  //   console.log( user + " resubbed for " + streamMonths + " months.");
  //   res.send({
  //     type: "resub",
  //     user: user,
  //     message: message,
  //     streamMonths: streamMonths,
  //     cumulativeMonths: cumulativeMonths,
  //     subTierInfo: subTierInfo,
  //     extra:extra
  //   });
  // }
  //
  // ComfyJS.onSubGift=( gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra ) => {
  //   console.log( gifterUser + " gifted sub to " + recipientUser + " months.");
  //   res.send({
  //     type: "subgift",
  //     user: user,
  //     message: message,
  //     streamMonths: streamMonths,
  //     cumulativeMonths: cumulativeMonths,
  //     subTierInfo: subTierInfo,
  //     extra:extra
  //   });
  // }
  //
  // ComfyJS.onGiftSubContinue=(user, sender, extra) => {
  //   console.log( user + " is continuing sub gifted by " + sender + ".");
  //   res.send({
  //     type: "giftsubcontinue",
  //     user: user,
  //     sender: sender,
  //     extra:extra
  //   });
  // }
  //
  // ComfyJS.onSubMysteryGift=( gifterUser, numbOfSubs, senderCount, subTierInfo, extra ) => {
  //   console.log( gifterUser + " was gifted a sub by anonymous.");
  //   res.send({
  //     type: "submysterygift",
  //     gifterUser: gifterUser,
  //     numbOfSubs: numbOfSubs,
  //     senderCount: senderCount,
  //     subTierInfo: subTierInfo,
  //     extra:extra
  //   });
  // }

  ComfyJS.onJoin=(user, self, extra) => {
    console.log( user + " joined chat.");
    res.write(JSON.stringify({
      type: "join",
      user: user,
      self: self,
      extra:extra
    }));
  }

  ComfyJS.onPart=(user, self, extra) => {
    console.log( user + " left chat.");
    res.write(JSON.stringify({
      type: "part",
      user: user,
      self: self,
      extra:extra
    }));
  }

});
