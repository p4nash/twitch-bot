var toSay = ["Artemis is pretty cute, but with each ${type} she gets cuter and she can't deny it if she keeps giving ${type}.",
"Look at her agreeing with that statement. She's getting 10x cuter with every ${type}!",
"Better stop or the world will implode with your cuteness, Artemis.",
"Please stop.",
"Look at this cutie Artemis! I'm a little jealous!",
"What a narcissist thinking she's cute and agreeing with it.",
"She also kicks ass at Siege. Imagine being adorable AND good at video games.",
"I sure love ${type}s, Artemis. I sure love taking all your money.",
"It's time to stop! Where are your parents?! And how cute did they have to be for Artemis to be this adorable?!",
"There's no possible way she can get any cuter.",
"Artemis has achieved maximum cuteness! All hail our adorable overlord Arty!"];

var giftedSubs = -1;

function getSaying(type){
    giftedSubs++;
    if(giftedSubs > 10) giftedSubs = 10;
    var message = toSay[giftedSubs].split("${type}").join(type);
    return message;
}

module.exports = { getSaying };
