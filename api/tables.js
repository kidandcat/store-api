var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'akatsuki',
    database: 'test'
});

connection.connect();


router.get('/:table', function (req, res, next) {
    connection.query('SELECT * FROM ' + req.params.table, function (err, rows, fields) {
        if (err) {
            res.send("ko");
            console.log(err);
        }
        res.json(rows);
    });
});

router.get('/:table/:id', function (req, res, next) {
    connection.query('SELECT * FROM ' + req.params.table + ' WHERE id=' + req.params.id, function (err, rows, fields) {
        if (err) {
            res.send("ko");
            console.log(err);
        }
        res.json(rows[0]);
    });
});

router.put('/:table', function (req, res, next) {
    connection.query("INSERT INTO " + req.params.table + " VALUES (null,'" + req.body.name + "')", function (err, rows, fields) {
        var response = {};
        response.status = "ok";
        if (err) {
            response.status = "ko";
            console.log(err);
        }
        res.json(response);
    });
});




module.exports = router;