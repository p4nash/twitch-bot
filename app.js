require('dotenv').config();
var fs = require('fs');
const readline = require('readline');
var quotes =[];

const rl = readline.createInterface({
    input: fs.createReadStream('quotes.txt'),
    output: process.stdout,
    terminal: false
});
rl.on('line', (line) => {
    console.log(line);
    quotes.push(line);
});
// const tmi = require('tmi.js');
// const client = new tmi.Client({
// 	options: { debug: true },
// 	connection: {
// 		reconnect: true,
// 		secure: true
// 	},
// 	identity: {
// 		username: process.env.TWITCH_USERNAME,
// 		password: process.env.TWITCH_AUTH_CLIENT
// 	},
// 	channels: [ 'p4nash' ]
// });
//
// client.connect();
//
// client.on('message', (channel, tags, message, self) => {
// 	if(self) return;
//   console.log(tags.username,': '+ message);
// 	if(message.toLowerCase() === '!hello') {
// 		client.say(channel, `@${tags.username}, heya!`);
// 	}
// });
//
// client.on('join', (channel, username, self) => {
// 	if(self) return;
//   console.log(username +' just joined '+ channel);
// });


var ComfyJS = require("comfy.js");

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if(user.toLowerCase() == 'therealmartybot') return;

  if(command === "discord" ) {
    ComfyJS.Say('/me We\'ve a fun Discord server where we say things and do stuff. Join us! https://discord.gg/XcNx3Aw');
  }
  else if(command == "youtube"){
    ComfyJS.Say('/me Panash tries to edit and put up videos at https://www.youtube.com/channel/UCQKfmsTfUdJZW4EqfsWC2lQ?view_as=subscriber');
  }
  else if(command === "lurk"){
    ComfyJS.Say('/me Poof! '+user+' has disappeared into thin air!');
  }
  else if(command === "hug"){
    ComfyJS.Say('/me There there, '+user+'. Everything is going to be okay. martyHeart');
  }
  else if(command === "religion"){
    ComfyJS.Say('/me Can you spare a minute for our lord and savior The Wisdom Dog? https://youtu.be/D-UmfqFjpl0');
  }else if(command === "addquote"){
    console.log("Added a quote: "+message);
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
  }
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
