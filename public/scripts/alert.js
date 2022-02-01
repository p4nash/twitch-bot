$(function(){

  ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
    if( flags.broadcaster && command === "test" ) {
      console.log( "!test was typed in chat" );
    }
  }

  ComfyJS.onHosted = ( user, viewers, autohost, extra )=>{
    console.log("Hosted from "+user);
    var alertText = user + " showed us to their "+viewers+" friends!";
    var message = "";

    Alert("images/shark.webm", alertText, message, 7000);
  }

  ComfyJS.onRaid = ( user, viewers, extra )=>{
    var alertText = user + " brought their friends over!";
    var message = "";

    Alert("images/shark.webm", alertText, message, 7000);
  }

  ComfyJS.onCheer = ( user, message, bits, flags, extra )=>{
    var alertText = "Huzzah! "+user+" cheered for "+bits+" bits!";

    Alert("images/wave.webm", alertText, message, 5000);
  }

  ComfyJS.onSub = ( user, message, subTierInfo, extra )=>{
    var alertText = user+" just joined Panashistan!";

    Alert("images/wiggle.webm", alertText, message, 7000);
  }

  ComfyJS.onResub = ( user, message, streamMonths, cumulativeMonths, subTierInfo, extra )=>{
      var alertText = user+" is continuing their stay!";

      Alert("images/wiggle.webm", alertText, message, 7000);
  }

  ComfyJS.onSubGift = ( gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra )=>{
    var alertText = gifterUser+" gifted a sub to "+recipientUser+"!";
    var message = "";

    Alert("images/gift.webm", alertText, message, 9000);
  }

  ComfyJS.onSubMysteryGift = ( gifterUser, numbOfSubs, senderCount, subTierInfo, extra )=>{
    var alertText = gifterUser+" gifted a sub!";
    var message = "";

    Alert("images/gift.webm", alertText, message, 9000);
  }


  ComfyJS.onGiftSubContinue = ( user, sender, extra )=>{
      var alertText = user+" is continuing their stay!";
      var message = "";

      Alert("images/wiggle.webm", alertText, message, 7000);
  }

  $.getScript("scripts/hidden.js", function() {
     ComfyJS.Init(broadcaster, token);
  });
});


  function Alert(src, alertText, message, time){
      $("#alert-text>p").text(alertText);
      if(message != "") {
        $("#alert-text>p#alert-message").show().text(message);

      }
      $("#alert-gif").html('<video width="300" height="300" autoplay><source src="'+src+'" type="video/webm"></source>');

      $("#alert").fadeIn();
      setTimeout(function(){ $("#alert").fadeOut(); }, time);
  }
