var usersInChat = [];
var channelNameString = "";
var chatterCounterOn = false;
var chatterEventOn = false;
var scrollEvents = scrollMessages = true;
var isAutoScrollEvent = false;

$(function(){

  initialize();

  var params = getHashParams();

  var access_token = params.access_token;
  console.log(access_token);

  $.ajax({
          url: 'http://localhost:8888/feed?access_token='+access_token,
          success: function(response) {
            console.log(response);
            switch(response.type){
              case "chat":
              AddMessage(response.user, response.command, response.extra);
              break;

              case "join":
              if(!chatterEventOn) return;

              AddEvent('https://img.icons8.com/material/24/42ff87/chat--v1.png',
              "<span class='userEvent'>"+response.user+'</span> just joined.');

              if(!usersInChat.find(findUsername, response.user)){
                usersInChat.push(response.user);
                $('#viewerCount').html('<img src="https://img.icons8.com/ios-glyphs/30/ffffff/visible.png"/>'+usersInChat.length);
              }
              break;

              case "part":
              if(!chatterEventOn) return;

              AddEvent('https://img.icons8.com/material/24/ff6ba1/chat--v1.png',
              "<span class='userEvent'>"+response.user+'</span> just left.');

              if(usersInChat.find(findUsername, response.user))
              {
                var index = usersInChat.indexOf(response.user);
                if(index > -1){
                  usersInChat.splice(index, 1);
                  $('#viewerCount').html('<img src="https://img.icons8.com/ios-glyphs/30/ffffff/visible.png"/>'+usersInChat.length);
                }
              }
              break;

              case "reward":
              AddEvent('https://img.icons8.com/material/24/ff6ba1/sport-badge.png',
              "<span class='userEvent'>"+response.user+'</span> claimed the reward '+response.reward+
              "<span class='messageEvent'>"+response.message+"</span>");
              break;

              case "host":
              break;

              case "raid":
              break;

              case "cheer":
              break;

              case "sub":
              break;

              case "resub":
              break;

              case "subgift":
              break;

              case "giftsubcontinue":
              break;

              case "submysterygift":
              break;
            }
          }
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
  var userElement = "<div class='event'><img src='"+image+"'/>"+
  content+"</div>";

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
      '<img class="delete" src="https://img.icons8.com/material-outlined/24/fc2853/delete-forever.png"/>'+
      '<img class="timeout" src="https://img.icons8.com/material-outlined/24/fc2853/clock.png"/>'+
      '<img class="ban" src="https://img.icons8.com/material-outlined/24/fc2853/cancel-2.png"/>'+
    "</div>"+
    "<span class='messageContent'>"+finalMsg+"</span>"
  +"</div>";

  $('#messagesList').append(messageElement);

  if(scrollMessages)
    $('#messagesList').animate({scrollTop: $('#messagesList')[0].scrollHeight}, 500);
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
  //
  // if(channelNameString == null)
  //   window.location.href = "index.html";
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
