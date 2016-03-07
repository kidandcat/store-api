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


router.get('/skeleton', function (req, res, next) {
    //TODO - return the database schema
    connection.query('SHOW TABLES', function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });
});

router.get('/skeleton/:table', function (req, res, next) {
    //TODO - return the database schema
    connection.query('DESCRIBE ' + req.params.table, function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });
});

router.delete('/skeleton/:table', function (req, res, next) {
    //TODO - return the database schema
    connection.query('DROP TABLE ' + req.params.table, function (err, rows, fields) {
        if (err) {
            res.json(err);
        }else{
            rows.status = 'ok';
            res.json(rows);
        }
    });
});

//The values MUST BE valid MYSQL TYPES
router.put('/skeleton', function (req, res, next) {
    var template = JSON.parse(req.body.template);
    var name = req.body.name;
    var fields = [];
    console.log(template);
    for (var property in template) {
        if (template.hasOwnProperty(property)) {
            fields.push(property + ' '  + template[property] + ',');
        }
    }
    fields[fields.length-1] = fields[fields.length-1].split(',')[0];
    var sql = 'CREATE TABLE ' + name + '(' + fields.join('') + ');'
    connection.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.json(err);
        }else{
            rows.status = 'ok';
            res.json(rows);
        }
    });
});




module.exports = router;