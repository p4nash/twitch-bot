
$(function(){
  console.log("Ready");
  var channelStored = localStorage.getItem("twitch");
  // console.log(channelStored);
  //if a channel name is stored, go to feed and skip name change
  if(channelStored != null) window.location.href = "feed.html";
});

function login(){
  var channel = $('#twitchChannelName').val();

  window.location.href = "/login";
  // $.ajax({
  //   url: "http://localhost:8888/login",
  //   success: function(response) {
  //     console.log(response);
  //
  //     if(response.status === 200){
  //       window.location.href = "feed.html";
  //     }
  //   }
  // });
}
