require('dotenv').config();
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var app = express();

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var get_code = 'http://localhost:8888/authenticate';

app
.use(express.static(__dirname + '/public'))
.use(cors())
.use(cookieParser())
.use(bodyParser.json())
.use(bodyParser.urlencoded({  extended:true }));

var auth_token = '';


app.listen(process.env.PORT || 8888, ()=>{
  console.log("Server started on port 8888");
});
