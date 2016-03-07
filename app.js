var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var toobusy = require('toobusy-js');
var http = require('http');
//var https = require('https');
//var privateKey = fs.readFileSync('/etc/letsencrypt/live/galax.be/privkey.pem', 'utf8');
//var certificate = fs.readFileSync('/etc/letsencrypt/live/galax.be/cert.pem', 'utf8');
//var credentials = {key: privateKey, cert: certificate};

var app = express();

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

//redirect http to https
/*app.use(function(req, res, next) {
  if (req.protocol != 'https') {
    res.redirect(301, "https://" + req.headers["host"] + req.url);
  } else {
    next();
  } 
});*/

//toobusy.maxLag(40);
//toobusy.interval(700);
app.use(function (req, res, next) {
    if (toobusy()) {
        res.send(503, "I'm busy right now, sorry.");
    } else {
        next();
    }
});

httpServer.listen(80);
//httpsServer.listen(443);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//ROUTES
//skeleton - to modify the database schema
var skeleton = require('./api/skeleton');
app.use('/', skeleton);


//tables
var tables = require('./api/tables');
app.use('/', tables);



app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    throw err;
    res.send('Error ');
});

module.exports = app;