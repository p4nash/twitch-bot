var queue = [];
var firebaseManager = require('./firebase.js');
var queueDB;

queueDB = firebaseManager.GetDatabase("queue");
ReadQueue();


function ReadQueue(){
  queueDB.once('value',function(snap){
    if(snap.val() == null || snap.val() == undefined) return;
    queue = snap.val();
    return snap.val();
  });
}

function Join(client, username){
  if(queue.includes(username)){
    client.Say("/me "+username+" is already in queue.");
    return;
  }

  queue.push(username);

  UpdateQueue(client, username+" has joined the queue.",
  username+ " could not join queue.");
}

function Clear(client){
  queue = [];

  UpdateQueue(client, "Cleared the queue.",
  "Could not clear queue.");
}

function Leave(client, username){
  if(!queue.includes(username)){
    client.Say("/me " +username + " is not in queue");
    return;
  }

  queue = queue.filter(e => e !== 'B');

  UpdateQueue(client, "Removed "+username+" from the queue.",
  "Could not remove "+username+" from queue.");

}

function UpdateQueue(client, onSuccess, onFailure){
  queueDB.set(queue, function(error) {
    if (error) {
      client.Say("/me "+onFailure);
    } else {
      client.Say("/me "+onSuccess);
    }
  });
}

function Queue(client){
  if(queue.length <= 0) {
    client.Say("/me Queue is empty.");
    return;
  }

  client.Say("Currently, queue has: "+queue);
}

module.exports = { Join, Clear, Leave, Queue };
