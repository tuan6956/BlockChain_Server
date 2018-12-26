'use strict';
const trans = require('../../lib/transaction')
const configKey = require('../../config/Key')
var axios = require('axios');
var util = require('util');
const {
    Keypair,StrKey
} = require('stellar-base');

module.exports = {
    //signUp: signUp
};

function balance(req, res) {
    let publicKey = req.swagger.params.publicKey.value;
    req.app.payment.paymentHistory(publicKey).then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(400);
        res.json(err);
    })
}
function send(req, res) {
    var body = req.swagger.params.body;
    var txs = body.value.txs;
    req.app.account.updateProfile(txs).then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(400);
        res.json(err);
    })
}

function history(req, res) {
    req.app.payment.paymentHistory().then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(400);
        res.json(err);
    })
}

