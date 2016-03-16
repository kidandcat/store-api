var express = require('express');
var router = express.Router();
var connection = require('./dbconnection');
var path = require('path');
var braintree = require('braintree');

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'n6mchxvn72r7tnct',
    publicKey: 'q3vkycfx69s65gmc',
    privateKey: '6f092ce84610dc634b496d617b67b495'
});

router.get('/buy/token', function(req, res, next) {
    token(req, res);
});

router.get('/buy/lib', function(req, res, next) {
    res.sendFile(path.join(process.cwd(), 'node_modules', 'braintree-web', 'dist', 'braintree.js'));
});

router.get('/buy/demo', function(req, res, next) {
    res.sendFile(path.join(process.cwd(), 'demo.html'));
});

router.get('/buy/test', function(req, res, next) {
    console.log(req.body);
});

router.get('/buy/:table/:id', function(req, res, next) {
    connection.query('SELECT * FROM ' + req.params.table + ' WHERE id=' + req.params.id, function(err, rows, fields) {
        if (err) {
            res.send("ko");
            console.log(err);
        } else {
            if (!rows[0]) {
                res.send("not found");
            } else {
                if (!rows[0].price && rows[0].price != 'null') {
                    res.send("price not found");
                } else {
                    res.send('lets buyy');


                }
            }
        }
    });
});

module.exports = router;





function token(req, res) {
    gateway.clientToken.generate({}, function(err, response) {
        res.send(response.clientToken);
    });
}




function sale(req, res) {
    gateway.transaction.sale({
        amount: '5.00',
        paymentMethodNonce: "nonce-from-the-client",
        options: {
            submitForSettlement: true
        }
    },
        function(err, result) {
            if (result) {
                if (result.success) {
                    console.log("Transaction ID: " + result.transaction.id)
                } else {
                    console.log(result.message)
                }
            } else {
                console.log(err)
            }
        });
}
