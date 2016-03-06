var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
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


var connection = mysql.createConnection({
    host: 'galax.be',
    user: 'root',
    password: 'nope',
    database: 'shop'
});

connection.connect();



//ROUTES
//skeleton - to modify the database schema
app.get('/skeleton', function (req, res, next) {
    //TODO - return the database schema
    /*connection.query('SELECT * FROM users', function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });*/
});

//users
app.get('/users', function (req, res, next) {
    connection.query('SELECT * FROM users', function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });
});

app.get('/users/:id', function (req, res, next) {
    connection.query('SELECT * FROM users WHERE id=' + req.params.id, function (err, rows, fields) {
        if (err) throw err;
        res.json(rows[0]);
    });
});

app.put('/users', function (req, res, next) {
    connection.query("INSERT INTO users VALUES (null,'" + req.body.name + "')", function (err, rows, fields) {
        var response = {};
        response.status = "ok";
        if (err) {
            response.status = "ko";
            console.log(err);
        }
        res.json(response);
    });
});

//products




app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send('Error ');
});

module.exports = app;