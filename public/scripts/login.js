
$(function(){
  console.log("Ready");
  var channelStored = localStorage.getItem("twitch");
  // console.log(channelStored);
  //if a channel name is stored, go to feed and skip name change
  if(channelStored != null) window.location.href = "feed.html";
});

function login(){
  var channel = $('#twitchChannelName').val();

  localStorage.setItem("twitch", channel);
  window.location.href = "feed.html";
}
