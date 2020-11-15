var quotes = [];
var firebaseManager = require('./firebase.js');
var quotesDB;

firebaseManager.InitialiseFirebase(function(){
  quotesDB = firebaseManager.GetDatabase("quotes");
  ReadQuotes(quotesDB);
});

function ReadQuotes(){
  quotesDB.once('value',function(snap){
    if(snap.val() == null || snap.val() == undefined) return;

    quotes = snap.val();
    return snap.val();
  });
}

function AddQuote(quote, client){
  SaveQuotes(quote, client);
  return quotes;
}

function GetQuote(index){
  return quotes[index].quote;
}

function SaveQuotes(quote, client){
  var quoteRef=quotesDB.child(quotes.length-1);
  var obj = {"quote": quote};
  quoteRef.update(obj,(err)=>{
    if(err){
      console.log("Something went wrong. "+err);
      client.Say("Something went wrong. Couldn't add the quote. ");
    }
    else{
      console.log("/me Added quote successfully.");
      var index = 0;
      if(quotes == null) index = 0;
      else index = Object.keys(quotes).length;
      quotes[index] = quote;
      client.Say("/me Quote added successfully.");
    }
  });

}

function GetTotalQuotes(){
  return quotes.length;
}

module.exports =  { ReadQuotes, AddQuote, GetQuote, GetTotalQuotes };
