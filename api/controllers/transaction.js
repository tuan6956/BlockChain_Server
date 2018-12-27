'use strict';
const trans = require('../../lib/transaction')
const configKey = require('../../config/Key')
var axios = require('axios');
var util = require('util');
const {
    Keypair,StrKey
} = require('stellar-base');
const helper = require('../../helper')
module.exports = {
    commit
};

function commit(req, res) {
    var body = req.swagger.params.body;
    var txs = body.value.txs;
    req.app.transaction.commit(txs).then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(200);
        res.json(err);
    })
}