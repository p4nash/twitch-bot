var usersInChat = [];
var channelNameString = "";
var chatterCounterOn = false;
var chatterEventOn = false;
var scrollEvents = scrollMessages = true;
var isAutoScrollEvent = false;
var socket;

$(function(){

  initialize();

  var params = getHashParams();

  var access_token = params.access_token;
  console.log(access_token);

  socket.emit('auth_token', access_token);

  socket.on('chat', function(response){
    if(response.extra.customRewardId != null) return;
    AddMessage(response.user, response.command, response.extra);
  });

  // socket.on('join', function(response){
  //   if(!chatterEventOn) return;
  //
  //   AddEvent('https://img.icons8.com/material/24/42ff87/chat--v1.png',
  //   "<span class='userEvent'>"+response.user+'</span> just joined.');
  //
  //   if(!usersInChat.find(findUsername, response.user)){
  //     usersInChat.push(response.user);
  //     $('#viewerCount').html('<img src="https://img.icons8.com/ios-glyphs/30/ffffff/visible.png"/>'+usersInChat.length);
  //   }
  // });
  //
  // socket.on('part', function(response){
  //   if(!chatterEventOn) return;
  //
  //   AddEvent('https://img.icons8.com/material/24/42ff87/chat--v1.png',
  //   "<span class='userEvent'>"+response.user+'</span> just joined.');
  //
  //   if(!usersInChat.find(findUsername, response.user)){
  //     usersInChat.push(response.user);
  //     $('#viewerCount').html('<img src="https://img.icons8.com/ios-glyphs/30/ffffff/visible.png"/>'+usersInChat.length);
  //   }
  // });

  socket.on('reward', function(response){
    if(response.message != null && response.message != "")
      message ="<span class='messageEvent'>"+response.message+"</span>";
    else
      message = '';

    AddEvent('https://img.icons8.com/ios-glyphs/30/42ff87/sport-badge.png',
               "<span class='userEvent'>"+response.user+'</span> claimed the reward '+response.reward+
               message);
  });

  socket.on('host', function(response){
    AddEvent('https://img.icons8.com/android/24/ff6ba1/retro-tv.png',
      "<span class='userEvent'>"+response.user+'</span> hosted with '+response.viewers+' viewers.');
  });

  socket.on('raid', function(response){
    AddEvent('https://img.icons8.com/ios-glyphs/30/ff6ba1/baby-footprints-path.png',
    "<span class='userEvent'>"+response.user+'</span> raided with '+response.viewers+' viewers.');
  });

  socket.on('cheer', function(response){
    if(response.message != null)
      message ="<span class='messageEvent'>"+response.message+"</span>";
    else
      message = '';

    AddEvent('https://img.icons8.com/ios-filled/50/42ff87/diamond--v1.png',
               "<span class='userEvent'>"+response.user+'</span> cheered '+response.bits+' bits.'+
               message);
  });

  socket.on('sub', function(response){
    if(response.message != null)
      message ="<span class='messageEvent'>"+response.message+"</span>";
    else
      message = '';

    AddEvent('https://img.icons8.com/material-sharp/24/42ff87/star.png',
      "<span class='userEvent'>"+response.user+'</span> subbed with '+response.subTierInfo.planName+' sub.'+
      message);
  });

  socket.on('resub', function(response){
    if(response.message != null)
      message ="<span class='messageEvent'>"+response.message+"</span>";
    else
      message = '';

    AddEvent('https://img.icons8.com/material-sharp/24/42ff87/star.png',
      "<span class='userEvent'>"+response.user+'</span> subbed with '+response.subTierInfo.planName+' sub. They\'ve been subbed for  <span class="bold">'+response.cumulativeMonths+' months</span>.'+
      message);
  });

  socket.on('subgift', function(response){
    if(response.message != null)
      message ="<span class='messageEvent'>"+response.message+"</span>";
    else
      message = '';

    AddEvent('https://img.icons8.com/metro/26/42ff87/gift.png',
      "<span class='userEvent'>"+gifterUser+'</span> gifted a '+subTierInfo.planName+' sub to '+recipientUser+'. They\'ve gifted '+senderCount+' subs so far!'+
      message);
  });

  socket.on('giftsubcontinue', function(response){
    AddEvent('https://img.icons8.com/metro/26/ffd000/gift.png',
      "<span class='userEvent'>"+response.sender+'</span> continued '+response.user+'\'s sub for them!');
  });

  socket.on('submysterygift', function(response){
    AddEvent('https://img.icons8.com/pastel-glyph/64/42ff87/christmas-gift--v2.png',
      "<span class='userEvent'>"+response.gifterUser+'</span> gifted '+response.numbOfSubs+' '+response.subTierInfo.planName+' subs to the channel! They\'ve gifted '+response.senderCount+' to the channel.');
  });

});

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

function AddEvent(image, content){
  var userElement = "<div class='event'><div class='container'><div class='row'>"+
  "<div class='col-1'><img class='eventImg' src='"+image+"'/></div>"+
  "<div class='eventContent col-11'>"+content+"</div>"+
  "</div></div></div>";

  $('#eventsList').append(userElement);

  if(scrollEvents)
    $('#eventsList').animate({scrollTop: $('#eventsList')[0].scrollHeight}, 10);
}

function AddMessage(user, message, extra){
  emotes = extra.messageEmotes;
  var finalMsg = formatEmotes(message, emotes);

  var forSomeoneElse = isAddressedToSomeoneElse(message.toLowerCase());
  var forYou = isAddressedToYou(message.toLowerCase());

  var messageType = "";
  if(forSomeoneElse) messageType = "unhighlight";
  if(!forSomeoneElse) messageType = "normal";
  if(forYou) messageType = "highlight";

  var messageElement = "<div class='message "+messageType+"'>"+
    "<span class='userName bold' style='color:"+extra.userColor+";'>"+user+"</span>"+
    "<div class='buttons'>"+
      //'<img class="delete" src="https://img.icons8.com/material-outlined/24/fc2853/delete-forever.png"/>'+
      //'<img class="timeout" onclick="timeout(\''+user+'\')" src="https://img.icons8.com/material-outlined/24/fc2853/clock.png"/>'+
      //'<img class="ban" onclick="ban(\''+user+'\')" src="https://img.icons8.com/material-outlined/24/fc2853/cancel-2.png"/>'+
    "</div>"+
    "<span class='messageContent'>"+finalMsg+"</span>"
  +"</div>";

  $('#messagesList').append(messageElement);

  if(scrollMessages)
    $('#messagesList').animate({scrollTop: $('#messagesList')[0].scrollHeight}, 500);
}

function ban(user){
  console.log("Ban user "+user);
  $.ajax({
      url: 'http://localhost:8888/ban?user='+user,
      success: function(response) {
        console.log(response);
      }
    });
}

function timeout(user){
  console.log("Timeout user "+user);
}

function isAddressedToSomeoneElse(content){
  var ats = content.search('@');
  if(content.search('@') < 0)
    return false;

  if(content.search("@"+channelNameString) >= 0)
    return false;

  return true;
}

function isAddressedToYou(content){
  if(content.search("@"+channelNameString) >= 0)
    return true;

  return false;
}

function formatEmotes(text, emotes) {
    var splitText = text.split('');
    for(var i in emotes) {
        var e = emotes[i];
        for(var j in e) {
            var mote = e[j];
            if(typeof mote == 'string') {
                mote = mote.split('-');
                mote = [parseInt(mote[0]), parseInt(mote[1])];
                var length =  mote[1] - mote[0],
                    empty = Array.apply(null, new Array(length + 1)).map(function() { return '' });
                splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));
                splitText.splice(mote[0], 1, '<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' + i + '/3.0">');
            }
        }
    }
    return splitText.join('');
}

function findUsername(nameGiven, nameToFind){
  return nameGiven == nameToFind;
}

function logout(){
  localStorage.removeItem("twitch");
  window.location.href = "index.html";
}

function settings(){
  $('#settingsPanel').fadeIn();
}

function initialize(){channelNameString=localStorage.getItem("twitch");
  socket = io();

  chatterCounterOn = localStorage.getItem("chatterCounterOn");

  if(chatterCounterOn == null) {
    chatterCounterOn = true;
    localStorage.setItem("chatterCounterOn", true);
    $("#chatterCounterOn").prop("checked", true);
  }else{
    $("#chatterCounterOn").prop("checked", chatterCounterOn);
    if(chatterCounterOn) $('#viewerCount').show();
    else $('#viewerCount').hide();
  }

  chatterEventOn = localStorage.getItem("chatterEventOn");

  if(chatterEventOn == null) {
    chatterEventOn = true;
    localStorage.setItem("chatterEventOn", true);
    $("#chatterEventOn").prop("checked", true);
  }else{
    $("#chatterEventOn").prop("checked", chatterEventOn);
  }
}

$('.close').click(function(){
  $(this).parent().fadeOut();
});


$("input[type='checkbox']").click(function(){
  localStorage.setItem($(this).attr("id"), $(this).is(':checked'));
});

$('#chatterCounterOn').click(function(){
  chatterCounterOn = $(this).is(':checked');

  if(chatterCounterOn) $('#viewerCount').show();
  else $('#viewerCount').hide();
});

$('#chatterEventOn').click(function(){
  chatterEventOn = $(this).is(':checked');
});

$("#messagesList").on('mousewheel', function(){
    scrollMessages = false;
    $("#resumeScroll").fadeIn();
});

$("#resumeScroll").click(function(){
  scrollMessages = true;
  $(this).fadeOut();
  $('#messagesList').animate({scrollTop: $('#messagesList')[0].scrollHeight}, 500);
});
