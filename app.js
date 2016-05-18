var express = require('express');
var request = require('request');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var routes = require('./routes/index');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public/')));
app.use('/api', routes);

var port = normalizePort(process.env.PORT || '8000');
app.set('port', port);
app.listen(port);
console.log('Listening on port: '+port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;

/*
var client_id = '0db323f594c14bb580ba588df93224f7'; // Your client id
var client_secret = 'eb2934095d6c4e70a9b0629d727eb18b'; // Your secret
var redirect_uri = 'http://localhost:8000/loggedin'; // Your redirect uri
var stateKey = 'spotify_auth_state';

function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get('/login', function(req, res){
  //used to verify additionally that the request was valid (ensure request and response made in same browser)
  var state = generateRandomString(16); 
  //Read more about scope at: https://developer.spotify.com/web-api/using-scopes/
  var scope = 'user-read-private user-read-email'; //determines access type
  //http://expressjs.com/en/api.html
  res.cookie(stateKey, state);

  //1. Request authorization
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,   
      scope: scope,       
      redirect_uri: redirect_uri,
      state: state
    }));
});
*/
app.get('/loggedin', function(req, res){
  console.log("I am here!!");
  //2. Recieve Authorization
  //3. Redirect to here
  var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
            error: 'state_mismatch'
      }));
  } else {
    //4. Get a token to access the API
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
      if(!error && response.statusCode === 200){
        console.log("Got some shit");
        var access_token = body.access_token;
              var refresh_token = body.refresh_token;
              var expires_in = body.expires_in;
              var token_type = body.token_type;
              console.log("access_token: ", access_token);
              console.log("refresh_token: ", refresh_token);
              console.log("expires_in: ", expires_in);
              console.log("token_type: ", token_type);

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
                //console.log(body.tracks.items);
                console.log(body);
              });
      } else {
        console.log("You dun goofed");
      }
    });


  }
    
});


