
var usersInChat = [];
var channelNameString = "";
var chatterCounterOn = false;
var chatterEventOn = false;
var scrollEvents = scrollMessages = true;
var isAutoScrollEvent = false;

$(function(){
  channelNameString=localStorage.getItem("twitch");

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

  if(channelNameString == null)
    window.location.href = "index.html";

  ComfyJS.onChat = ( user, command, message, flags, extra ) => {
    AddMessage(user, command, extra);
  }

  ComfyJS.onJoin=(user, self, extra) => {
      console.log(user+' joined chat');
      if(!chatterEventOn) return;

      AddEvent('https://img.icons8.com/material/24/42ff87/chat--v1.png',
      "<span class='userEvent'>"+user+'</span> just joined.');

      if(!usersInChat.find(findUsername, user)){
        usersInChat.push(user);
        $('#viewerCount').html('<img src="https://img.icons8.com/ios-glyphs/30/ffffff/visible.png"/>'+usersInChat.length);
      }
  }

  ComfyJS.onPart=(user, self, extra) => {
      console.log(user+' left chat');
      if(!chatterEventOn) return;

      AddEvent('https://img.icons8.com/material/24/ff6ba1/chat--v1.png',
      "<span class='userEvent'>"+user+'</span> just left.');

      if(usersInChat.find(findUsername, user))
      {
        var index = usersInChat.indexOf(user);
        if(index > -1){
          usersInChat.splice(index, 1);
          $('#viewerCount').html('<img src="https://img.icons8.com/ios-glyphs/30/ffffff/visible.png"/>'+usersInChat.length);
        }
      }
  }

  ComfyJS.onHosted=(user, viewers, autohost, extra) => {
      console.log(user+' hosted');

      AddEvent('https://img.icons8.com/android/24/ff6ba1/retro-tv.png',
      "<span class='userEvent'>"+user+'</span> hosted with '+viewers+' viewers.');
  }

  ComfyJS.onRaid=(user, viewers, extra) => {
      console.log(user+' raided');

      AddEvent('https://img.icons8.com/ios-glyphs/30/ff6ba1/baby-footprints-path.png',
      "<span class='userEvent'>"+user+'</span> raided with '+viewers+' viewers.');
  }

  ComfyJS.onCheer=(user, message, bits, flags, extra) => {
      console.log(user+' cheered');

      var content = "<span class='userEvent'>"+user+'</span> cheered '+bits+' bits.';

      if(message != null)
        content = content + ' They said: <span class="italic">"'+message+'"</span>.';

      AddEvent('https://img.icons8.com/ios-filled/50/42ff87/diamond--v1.png',
      content);
  }

  ComfyJS.onSub=(user, message, subTierInfo, extra) => {
      console.log(user+' subbed. ', subTierInfo.planName);

      var content = "<span class='userEvent'>"+user+'</span> subbed with '+subTierInfo.planName+' sub.';
      if(message != null)
        content = content + ' They said: <span class="italic">"'+message+'"</span>.'
      AddEvent('https://img.icons8.com/material-sharp/24/42ff87/star.png',content);
  }

  ComfyJS.onResub=(user, message, streamMonths, cumulativeMonths, subTierInfo, extra) => {
      console.log(user+' subbed. ', subTierInfo.planName, message);

      var content =  "<span class='userEvent'>"+user+'</span> subbed with '+subTierInfo.planName+' sub. They\'ve been subbed for  <span class="bold">'+cumulativeMonths+' months</span>.';

       if(message != null)
        content = content + ' They said: <span class="italic">"' + message + '"</span>.'

      AddEvent('https://img.icons8.com/material-sharp/24/ffd000/star.png', content);
  }

  ComfyJS.onSubGift=( gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra ) => {
      console.log(user+' subbed. ', subTierInfo.planName);

      AddEvent('https://img.icons8.com/metro/26/42ff87/gift.png',
      "<span class='userEvent'>"+gifterUser+'</span> gifted a '+subTierInfo.planName+' sub to '+recipientUser+'. They\'ve gifted '+senderCount+' subs so far!');
  }

  ComfyJS.onGiftSubContinue=(user, sender, extra) => {
      console.log(user+' resubbed');

      AddEvent('https://img.icons8.com/metro/26/ffd000/gift.png',
      "<span class='userEvent'>"+sender+'</span> continued '+user+'\'s sub for them!');
  }

  ComfyJS.onSubMysteryGift=( gifterUser, numbOfSubs, senderCount, subTierInfo, extra ) => {
      console.log(user+' subbed. ', subTierInfo.planName);

      AddEvent('https://img.icons8.com/pastel-glyph/64/42ff87/christmas-gift--v2.png',
      "<span class='userEvent'>"+gifterUser+'</span> gifted '+numbOfSubs+' '+subTierInfo.planName+' subs to the channel! They\'ve gifted '+senderCount+' to the channel.');
  }

  ComfyJS.Init( channelNameString );

  $('#channelName').html(channelNameString);

  console.log("Ready!");

  $( ".buttons>img" ).click(function() {
    $.ajax({
        url: 'http://localhost:8888/handleUser'+userID,
        success: function(response) {}
      });
  });

});

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
