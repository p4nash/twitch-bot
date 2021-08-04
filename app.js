require('dotenv').config();
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const http = require('http');

var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var quotesManager = require('./quotes.js');
var commandsManager = require('./commands.js');
var queueManager = require('./queue.js');
var commands = [];
var ComfyJS = require("comfy.js");

var app = express();
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app
.use(express.static(__dirname + '/public'))
.use(cors())
.use(cookieParser())
.use(bodyParser.json())
.use(bodyParser.urlencoded({  extended:true }));

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  // if(user.toLowerCase() == process.env.TWITCH_USERNAME) return;

  if(command === 'ban'){
    ComfyJS.Say('/ban '+message);
    ComfyJS.Say('/me Banning '+message);
  }

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
}if(command === "addjoke"){
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
  }else if(command === "addcommand" && (flags.mod == true || flags.broadcaster == true)){
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
  }else if(command === 'join'){
    queueManager.Join(ComfyJS, user);
  }else if(command === 'leave'){
    queueManager.Leave(ComfyJS, user);
  }else if(command === 'clear'){
    queueManager.Clear(ComfyJS);
  }else if(command === 'queue'){
    queueManager.Queue(ComfyJS);
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

var auth_token = '';

server.listen(8888, () => {
  console.log('listening on *:8888');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('auth_token', (msg)=>{
    console.log('Auth token ' + msg);

    if(auth_token != '')
      return;
    else
      auth_token = msg;

    ComfyJS.Init(process.env.TWITCH_TARGET_CHANNEL, msg);
  });

  ComfyJS.onChat = ( user, command, message, flags, extra ) => {
    console.log( user + " send a message.");
    console.log(user);
    socket.emit('chat',{
      user: user,
      command: command,
      message: message,
      flags: flags,
      extra: extra
    });
  };

  ComfyJS.onJoin=(user, self, extra) => {
    console.log( user + " joined chat.");
    socket.emit("join", {
      user: user,
      self: self,
      extra:extra
    });
  }

  ComfyJS.onPart=(user, self, extra) => {
    console.log( user + " left chat.");
    socket.emit("part", {
      user: user,
      self: self,
      extra:extra
    });
  }

  ComfyJS.onReward = ( user, reward, cost, message, extra ) => {
    console.log( user + " redeemed " + reward + " for " + cost );
    socket.emit("reward", {
      user: user,
      reward: reward,
      cost: cost,
      message: message,
      extra: extra
    });
  }

  ComfyJS.onHosted=(user, viewers, autohost, extra) => {
    console.log( user + " hosted with " + viewers + " viewers.");
    socket.emit("host", {
      user: user,
      viewers: viewers,
      autohost: autohost,
      extra: extra
    });
  }

  ComfyJS.onRaid=(user, viewers, extra) => {
    console.log( user + " raided with " + viewers + " viewers.");
    socket.emit("raid", {
      user: user,
      viewers: viewers,
      extra: extra
    });
  }

  ComfyJS.onCheer=(user, message, bits, flags, extra) => {
    console.log( user + " cheered for " + bits + " bits.");
    socket.emit("cheer", {
      user: user,
      message: message,
      bits: bits,
      flags: flags,
      extra:extra
    });
  }

  ComfyJS.onSub=(user, message, subTierInfo, extra) => {
    console.log( user + " subbed with " + subTierInfo.planName + " tier.");
    socket.emit("sub", {
      user: user,
      message: message,
      subTierInfo: subTierInfo,
      extra:extra
    });
  }

  ComfyJS.onResub=(user, message, streamMonths, cumulativeMonths, subTierInfo, extra) => {
    console.log( user + " resubbed for " + streamMonths + " months.");
    socket.emit("resub", {
      user: user,
      message: message,
      streamMonths: streamMonths,
      cumulativeMonths: cumulativeMonths,
      subTierInfo: subTierInfo,
      extra:extra
    });
  }

  ComfyJS.onSubGift=( gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra ) => {
    console.log( gifterUser + " gifted sub to " + recipientUser + " months.");
    socket.emit("subgift", {
      gifterUser: gifterUser,
      streakMonths: streakMonths,
      recipientUser: recipientUser,
      senderCount: senderCount,
      subTierInfo: subTierInfo,
      extra:extra
    });
  }

  ComfyJS.onGiftSubContinue=(user, sender, extra) => {
    console.log( user + " is continuing sub gifted by " + sender + ".");
    socket.emit("giftsubcontinue", {
      user: user,
      sender: sender,
      extra:extra
    });
  }

  ComfyJS.onSubMysteryGift=( gifterUser, numbOfSubs, senderCount, subTierInfo, extra ) => {
    console.log( gifterUser + " was gifted a sub by anonymous.");
    socket.emit("submysterygift", {
      gifterUser: gifterUser,
      numbOfSubs: numbOfSubs,
      senderCount: senderCount,
      subTierInfo: subTierInfo,
      extra:extra
    });
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
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
       scope: 'channel:manage:redemptions channel:read:redemptions channel:moderate user:read:email chat:edit chat:read'
     });

     res.redirect(options);
});

app.get('/ban', function(req, res){
  console.log("Ban user "+req.query.user);
  ComfyJS.Say("/ban "+req.query.user);
});

app.get('/feed', function(req, res){
  client_token = req.query.access_token;
  console.log("Logging in user using token "+client_token);
});


const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
var scenes; var currentScene; var sourceSettings;
var sceneItems; var sceneItemProperties;
var x = obs.connect({
        address: 'localhost:4444',
        password: ''
    })
    .then(data => {
        console.log(`Success! We're connected & authenticated.`);
        sceneItemProperties = data;
        return obs.send('GetSceneItemProperties', {item: "Nerd Alert.mov"});
    })
    .catch(err => { // Promise convention dicates you have a catch on every chain.
        console.log(err);
    });
