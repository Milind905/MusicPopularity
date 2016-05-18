var express = require('express');
var router = express.Router();
var app = require('../app');
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var Q = require('q');

var client_id = '0db323f594c14bb580ba588df93224f7'; // Your client id
var client_secret = 'eb2934095d6c4e70a9b0629d727eb18b'; // Your secret
var redirect_uri = 'http://localhost:8000/api/tokenize'; // Your redirect uri
var stateKey = 'spotify_auth_state';
var state = generateRandomString(16);
var scope = 'user-read-private user-read-email';

var access_token = null;
var refresh_token = null;
var expires_in = null;
var token_type = null;

router.get('/authorize', function(req, res) {
  res.cookie(stateKey, state);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,   
      scope: scope,       
      redirect_uri: redirect_uri,
      state: state
	}));
});

router.get('/tokenize', function(req, res) {
	requestTokens(req, res).then(function(body){
		access_token = body.access_token;
    refresh_token = body.refresh_token;
    expires_in = body.expires_in;
    token_type = body.token_type;
    return getBearerInfo();
	}, function(err){
		console.log("Caused an error: ", err);
		res.redirect('/#/apierror'+querystring.stringify({error: err}));
	}).then(function(body){
		res.redirect('/#/loggedin?'+ 
			querystring.stringify({
      	access_token: access_token,
      	refresh_token: refresh_token
    }));
	}, function(err){
		console.log("Caused an error: ", err);
		res.redirect('/#/apierror'+querystring.stringify({error: err}));
	});
});

function requestTokens(req, res) {
	var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  var deferred = Q.defer();

  if (state === null || state !== storedState) {
    deferred.reject("Error: States do not match.");
  } else {
  	res.clearCookie(stateKey);
  	var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body){
    	if(error || response.statusCode !== 200){
    		deferred.reject(error);
    	} else{
    		deferred.resolve(body);
    	}
    });
  }
  return deferred.promise;
}

function getBearerInfo(){
	var deferred = Q.defer();
	var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  request.get(options, function(error, response, body) {
    if(error || response.statusCode !== 200){
    	deferred.reject(error);
    } else {
    	deferred.resolve(body);
    }
  });
	return deferred.promise;
}

function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports = router;

    /*request.post(authOptions, function(error, response, body){
      if(error || response.statusCode !== 200){
      	//do something
      	console.log("Got an error");
      } else {
        console.log("Got some shit");
        var access_token = body.access_token;
        var refresh_token = body.refresh_token;
        var expires_in = body.expires_in;
        var token_type = body.token_type;

        var options = {
	        url: 'https://api.spotify.com/v1/me',
	        headers: { 'Authorization': 'Bearer ' + access_token },
	        json: true
	      };

        var options2 = {
          url: 'https://api.spotify.com/v1/search?q=lights&type=track',
          headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        request.get(options2, function(error, response, body){
          console.log(body);
        });
      }
  	});
  }
});*/


