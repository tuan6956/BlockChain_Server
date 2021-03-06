'use strict';
const trans = require('../../lib/transaction')
const configKey = require('../../config/Key')
var axios = require('axios');
var util = require('util');
const {
    Keypair,StrKey
} = require('stellar-base');

module.exports = {
    balance,
    history,
    //signUp: signUp
};

function balance(req, res) {
    let publicKey = req.swagger.params.publicKey.value;
    req.app.payment.paymentHistoryByPublicKey(publicKey).then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(200);
        res.json(err);
    })
}

function history(req, res) {
    req.app.payment.paymentHistory().then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(200);
        res.json(err);
    })
}

